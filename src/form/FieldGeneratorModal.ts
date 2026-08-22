import { App, MarkdownView, Modal, Notice } from 'obsidian';
import type { FieldType } from '../model/FieldModel';
import type { Locale, SupportedLocale } from '../locales';
import { getLocale } from '../locales';
import {
    createEmptyState, buildFieldSyntax, buildVariableExamples, buildVariableClipboardText,
    buildMetaSyntax, containsVariableToken, wrapInFormbuilderBlock,
    stateHasForbiddenBracket, metaValueHasForbiddenBracket,
} from '../generator/FieldSyntaxBuilder';
import type { FieldGeneratorState, MetaKind, VariableExampleHints } from '../generator/FieldSyntaxBuilder';
import { NOTICE_DURATION } from '../ui/ErrorNotice';
import { applyMobileModalBehavior } from '../ui/MobileModal';

const FIELD_TYPES: FieldType[] = [
    'text', 'textarea', 'number', 'date', 'checkbox', 'select', 'multiselect', 'multilist',
];

const VALID_KEY = /^[a-zA-Z0-9_-]+$/;

/** Generator Type（何を生成するか） */
type GeneratorMode = 'field' | 'meta-folder' | 'meta-filename';

/**
 * カーソル行が ```formbuilder フェンスブロックの内側にあるかを判定する。
 * フェンス行自体（```formbuilder / ```）は内側に含めない。
 * TemplateParser 側は複数の formbuilder ブロックに対応しているが、ここでは
 * 「カーソルが今どのブロックの中にいるか」を判定したいだけなので、独自に
 * 行単位で走査する（複数ブロックがあっても、フェンスの開閉を追うだけで正しく判定できる）。
 */
function isCursorInFormbuilderBlock(content: string, cursorLine: number): boolean {
    const lines = content.split('\n');
    let inBlock = false;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!inBlock && /^```formbuilder\s*$/.test(trimmed)) {
            inBlock = true;
            continue;
        }
        if (inBlock && /^```\s*$/.test(trimmed)) {
            inBlock = false;
            continue;
        }
        if (inBlock && i === cursorLine) return true;
    }
    return false;
}

export class FieldGeneratorModal extends Modal {
    private locale: SupportedLocale;

    private mode: GeneratorMode = 'field';
    private type: FieldType = 'text';
    private state: FieldGeneratorState = createEmptyState();
    private metaFolderValue = '';
    private metaFilenameValue = '';

    // カーソルが既存の formbuilder ブロックの中にあるかどうか（モーダルを開いた時点で1回判定する）。
    // ブロックの外側にある場合のみ「formbuilder コードブロックを挿入する」チェックボックスを表示する。
    private cursorInBlock = false;
    private wrapInBlock = false;

    private bodyEl!: HTMLElement;
    private previewEl!: HTMLElement;
    private sideEl!: HTMLElement;
    private buttonsRowEl!: HTMLElement;

    private keyInputEl?: HTMLInputElement;
    private actionButtons: HTMLButtonElement[] = [];

    constructor(app: App, locale: SupportedLocale) {
        super(app);
        this.locale = locale;
    }

    onOpen(): void {
        this.modalEl.addClass('fb-modal-root');
        this.modalEl.addClass('fb-gen-modal');
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.genModalTitle);

        this.cursorInBlock = this.detectCursorInBlock();

        const root = contentEl.createDiv({ cls: 'fb-modal' });

        this.renderModeSelect(root);
        this.bodyEl = root.createDiv({ cls: 'fb-gen-settings' });
        this.previewEl = root.createDiv({ cls: 'fb-gen-preview' });
        this.sideEl = root.createDiv({ cls: 'fb-gen-variables' });
        if (!this.cursorInBlock) {
            this.renderWrapToggle(root);
        }
        this.buttonsRowEl = root.createDiv({ cls: 'fb-btn-row' });

        this.renderBody();
        this.renderButtons();
        this.updatePreview();
        applyMobileModalBehavior(this);
    }

    /** アクティブなエディタのカーソルが、既存の formbuilder ブロックの中にあるかどうかを判定する。 */
    private detectCursorInBlock(): boolean {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return false;
        const editor = view.editor;
        return isCursorInFormbuilderBlock(editor.getValue(), editor.getCursor().line);
    }

    private renderWrapToggle(root: HTMLElement): void {
        const L = getLocale(this.locale);
        this.addToggle(root, L.genWrapInBlockLabel, L.genWrapInBlockHint, this.wrapInBlock, (v) => {
            this.wrapInBlock = v;
            this.updatePreview();
        });
    }

    onClose(): void {
        this.contentEl.empty();
    }

    // ---------------------------------------------------------------
    // Generator Type（Field / Meta: Folder / Meta: Filename）
    // ---------------------------------------------------------------

    private renderModeSelect(root: HTMLElement): void {
        const L = getLocale(this.locale);
        const card = root.createDiv({ cls: 'fb-field' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: L.genTypeLabel });

        const select = card.createEl('select', { cls: 'fb-select' });
        const options: [GeneratorMode, string][] = [
            ['field', L.genTypeField],
            ['meta-folder', L.genTypeMetaFolder],
            ['meta-filename', L.genTypeMetaFilename],
        ];
        for (const [value, label] of options) {
            const opt = select.createEl('option');
            opt.value = value;
            opt.textContent = label;
        }
        select.value = this.mode;
        select.addEventListener('change', () => {
            this.mode = select.value as GeneratorMode;
            this.renderBody();
            this.renderButtons();
            this.updatePreview();
        });
    }

    // ---------------------------------------------------------------
    // 本体（Field Type + 設定 / Meta 値入力）の出し分け
    // ---------------------------------------------------------------

    private renderBody(): void {
        this.bodyEl.empty();
        if (this.mode === 'field') {
            this.renderFieldTypeSelect(this.bodyEl);
            this.renderFieldSettings(this.bodyEl);
        } else {
            const kind: MetaKind = this.mode === 'meta-folder' ? 'folder' : 'filename';
            this.renderMetaInput(this.bodyEl, kind);
        }
    }

    private renderFieldTypeSelect(container: HTMLElement): void {
        const L = getLocale(this.locale);
        const card = container.createDiv({ cls: 'fb-field fb-gen-row' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: L.genFieldType });
        card.createDiv({ cls: 'fb-desc', text: L.genFieldTypeHints[this.type] ?? '' });

        const select = card.createEl('select', { cls: 'fb-select' });
        for (const t of FIELD_TYPES) {
            const opt = select.createEl('option');
            opt.value = t;
            opt.textContent = L.genFieldTypeOptions[t] ?? t;
        }
        select.value = this.type;
        select.addEventListener('change', () => {
            // Key 等の入力値は state に保持されたまま、型に応じた項目だけを描き直す。
            this.type = select.value as FieldType;
            this.bodyEl.empty();
            this.renderFieldTypeSelect(this.bodyEl);
            this.renderFieldSettings(this.bodyEl);
            this.updatePreview();
        });
    }

    private renderFieldSettings(container: HTMLElement): void {
        const L = getLocale(this.locale);

        this.keyInputEl = this.addTextInput(
            container, L.genKey, L.genKeyHint, this.state.key, true, (v) => {
                this.state.key = v;
                this.updatePreview();
            });

        this.addTextInput(container, L.genLabel, L.genLabelHint, this.state.label, false, (v) => {
            this.state.label = v;
            this.updatePreview();
        });

        this.addTextInput(container, L.genDescription, L.genDescriptionHint, this.state.description, false, (v) => {
            this.state.description = v;
            this.updatePreview();
        });

        const hasPlaceholder =
            this.type === 'text' || this.type === 'textarea' ||
            this.type === 'number' || this.type === 'date' || this.type === 'multilist';
        if (hasPlaceholder) {
            // 独自構文は formbuilder ブロックを1行ずつ解析するため、
            // placeholder / default に実際の改行を含めることはできない
            // （multilist も含め、常に1行のテキスト入力にする）。
            this.addTextInput(container, L.genPlaceholder, L.genPlaceholderHint, this.state.placeholder, false, (v) => {
                this.state.placeholder = v;
                this.updatePreview();
            });
        }

        if (this.type === 'checkbox') {
            // checkbox は常に true/false のいずれかの値を持つため required は意味を持たない
            // （SyntaxValidator 上は許容されるが、実際の送信バリデーションでも checkbox は対象外）。
            this.addToggle(container, L.genDefaultChecked, L.genDefaultCheckedHint, this.state.checked, (v) => {
                this.state.checked = v;
                this.updatePreview();
            });
        } else if (this.type === 'select') {
            this.addTextarea(container, L.genList, this.state.listRaw, L.genListHint, (v) => {
                this.state.listRaw = v;
                this.updatePreview();
            });
            this.addTextInput(container, L.genDefault, L.genDefaultHintSelect, this.state.default, false, (v) => {
                this.state.default = v;
                this.updatePreview();
            });
        } else if (this.type === 'multiselect') {
            this.addTextarea(container, L.genList, this.state.listRaw, L.genListHint, (v) => {
                this.state.listRaw = v;
                this.updatePreview();
            });
            this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
                this.state.rows = v;
                this.updatePreview();
            });
            this.addTextInput(container, L.genDefault, L.genDefaultHintMultiselect, this.state.default, false, (v) => {
                this.state.default = v;
                this.updatePreview();
            });
        } else if (this.type === 'multilist') {
            // default は実際の構文（1行制限）では複数行を表現できず、
            // multilist 本来の「複数項目」という用途にそぐわないため、
            // 構文ジェネレーター上では default 自体を提供しない（rows のみ）。
            this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
                this.state.rows = v;
                this.updatePreview();
            });
        } else {
            // text / number / date
            this.addTextInput(container, L.genDefault, L.genDefaultHint, this.state.default, false, (v) => {
                this.state.default = v;
                this.updatePreview();
            });
            if (this.type === 'textarea') {
                this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
                    this.state.rows = v;
                    this.updatePreview();
                });
            }
            if (this.type === 'text') {
                // folder は text 専用オプション（Vault フォルダ選択ボタンの表示有無）
                this.addToggle(container, L.genFolder, L.genFolderHint, this.state.folder, (v) => {
                    this.state.folder = v;
                    this.updatePreview();
                });
            }
        }

        if (this.type === 'number') {
            this.addTextInput(container, L.genMin, L.genMinHint, this.state.min, false, (v) => {
                this.state.min = v;
                this.updatePreview();
            });
            this.addTextInput(container, L.genMax, L.genMaxHint, this.state.max, false, (v) => {
                this.state.max = v;
                this.updatePreview();
            });
        }

        if (this.type !== 'checkbox') {
            this.addToggle(container, L.genRequired, L.genRequiredHint, this.state.required, (v) => {
                this.state.required = v;
                this.updatePreview();
            });
        }
    }

    // ---------------------------------------------------------------
    // Meta（folder / filename）入力
    // ---------------------------------------------------------------

    private renderMetaInput(container: HTMLElement, kind: MetaKind): void {
        const L = getLocale(this.locale);
        const label = kind === 'folder' ? L.genMetaFolderLabel : L.genMetaFilenameLabel;
        const hint = kind === 'folder' ? L.genMetaFolderHint : L.genMetaFilenameHint;
        const value = kind === 'folder' ? this.metaFolderValue : this.metaFilenameValue;

        const card = container.createDiv({ cls: 'fb-field fb-gen-row' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: label });
        card.createDiv({ cls: 'fb-desc', text: hint });

        const input = card.createEl('input', { cls: 'fb-input' });
        input.type = 'text';
        input.value = value;
        input.addEventListener('input', () => {
            if (kind === 'folder') this.metaFolderValue = input.value;
            else this.metaFilenameValue = input.value;
            this.updatePreview();
        });

        // 変数クイック挿入ボタン（カーソル位置に挿入する）
        const insertRow = card.createDiv({ cls: 'fb-gen-var-insert-row' });
        insertRow.createSpan({ cls: 'fb-desc', text: L.genMetaInsertVariableLabel });
        const tokens = ['%date%', '%time%', '%timestamp%', '$key$'];
        for (const token of tokens) {
            const btn = insertRow.createEl('button', { cls: 'fb-btn fb-btn-chip', text: token });
            btn.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.insertTokenAtCursor(input, token, kind);
            });
        }
    }

    private insertTokenAtCursor(input: HTMLInputElement, token: string, kind: MetaKind): void {
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const newValue = input.value.slice(0, start) + token + input.value.slice(end);
        input.value = newValue;
        if (kind === 'folder') this.metaFolderValue = newValue;
        else this.metaFilenameValue = newValue;
        const newPos = start + token.length;
        input.focus();
        input.setSelectionRange(newPos, newPos);
        this.updatePreview();
    }

    // ---------------------------------------------------------------
    // 入力ヘルパー（既存 FieldRenderer と同じクラス名を再利用し見た目を統一）
    // ---------------------------------------------------------------

    private addTextInput(
        container: HTMLElement, label: string, hint: string, value: string, required: boolean,
        onInput: (v: string) => void
    ): HTMLInputElement {
        const card = container.createDiv({ cls: 'fb-field fb-gen-row' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: label });
        if (required) labelRow.createSpan({ cls: 'fb-required-mark', text: '*' });
        if (hint) card.createDiv({ cls: 'fb-desc', text: hint });
        const input = card.createEl('input', { cls: 'fb-input' });
        input.type = 'text';
        input.value = value;
        input.addEventListener('input', () => onInput(input.value));
        return input;
    }

    private addTextarea(
        container: HTMLElement, label: string, value: string, hint: string,
        onInput: (v: string) => void
    ): void {
        const card = container.createDiv({ cls: 'fb-field fb-gen-row' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: label });
        card.createDiv({ cls: 'fb-desc', text: hint });
        const textarea = card.createEl('textarea', { cls: 'fb-textarea' });
        textarea.value = value;
        textarea.rows = 4;
        textarea.addEventListener('input', () => onInput(textarea.value));
    }

    private addToggle(
        container: HTMLElement, label: string, hint: string, checked: boolean,
        onChange: (v: boolean) => void
    ): void {
        const card = container.createDiv({ cls: 'fb-field fb-gen-row' });
        const labelRow = card.createDiv({ cls: 'fb-label-row' });
        labelRow.createSpan({ cls: 'fb-label', text: label });
        if (hint) card.createDiv({ cls: 'fb-desc', text: hint });
        const wrap = card.createDiv({ cls: 'fb-toggle-wrap' });
        const toggleLabel = wrap.createEl('label', { cls: 'fb-toggle' });
        const input = toggleLabel.createEl('input');
        input.type = 'checkbox';
        input.checked = checked;
        toggleLabel.createDiv({ cls: 'fb-toggle-track' });
        toggleLabel.createDiv({ cls: 'fb-toggle-thumb' });
        input.addEventListener('change', () => onChange(input.checked));
    }

    // ---------------------------------------------------------------
    // Preview / 補助パネル（入力のたびにリアルタイム更新）
    // ---------------------------------------------------------------

    private currentSyntax(): string {
        if (this.mode === 'field') {
            const key = this.state.key.trim();
            const keyValid = key !== '' && VALID_KEY.test(key);
            return keyValid ? buildFieldSyntax(this.type, this.state) : '';
        }
        const kind: MetaKind = this.mode === 'meta-folder' ? 'folder' : 'filename';
        const value = this.mode === 'meta-folder' ? this.metaFolderValue : this.metaFilenameValue;
        return buildMetaSyntax(kind, value);
    }

    /**
     * 実際にコピー・挿入される構文。
     * 「formbuilder コードブロックを挿入する」がオンの場合は ```formbuilder で囲む。
     * このチェックボックスはカーソルがブロック外のときにしか表示されないため、
     * オンになっている時点でラップして問題ない。
     */
    private renderedSyntax(): string {
        const raw = this.currentSyntax();
        if (!raw) return '';
        return this.wrapInBlock ? wrapInFormbuilderBlock(raw) : raw;
    }

    private updatePreview(): void {
        const L = getLocale(this.locale);

        let enabled = false;
        let forbiddenBracket = false;

        if (this.mode === 'field') {
            const key = this.state.key.trim();
            const keyValid = key !== '' && VALID_KEY.test(key);
            forbiddenBracket = stateHasForbiddenBracket(this.type, this.state);
            enabled = keyValid && !forbiddenBracket;
            if (this.keyInputEl) this.keyInputEl.toggleClass('fb-error', key !== '' && !keyValid);
        } else {
            const value = this.mode === 'meta-folder' ? this.metaFolderValue : this.metaFilenameValue;
            forbiddenBracket = metaValueHasForbiddenBracket(value);
            enabled = this.currentSyntax() !== '' && !forbiddenBracket;
        }

        // "]" を含む値は構文として再読込できなくなるため（CodeReview #6）、
        // プレビューには出さず、警告を表示してコピー・挿入系のボタンを無効化する。
        const syntax = forbiddenBracket ? '' : this.renderedSyntax();

        this.previewEl.empty();
        this.previewEl.createDiv({ cls: 'fb-label', text: L.genPreviewTitle });
        if (forbiddenBracket) {
            const block = this.previewEl.createDiv({ cls: 'fb-warning-block' });
            block.createDiv({ cls: 'fb-warning', text: `⚠ ${L.genForbiddenBracketWarning}` });
        }
        this.previewEl.createEl('pre', { cls: 'fb-example-block fb-gen-code' })
            .createEl('code', { text: syntax || '—' });

        this.renderSidePanel(syntax, enabled);

        for (const btn of this.actionButtons) {
            btn.toggleAttribute('disabled', !enabled);
        }
    }

    private variableHints(L: Locale): VariableExampleHints {
        const isArray = this.type === 'multiselect' || this.type === 'multilist';
        return {
            default: isArray ? L.genVarHintDefaultArray : L.genVarHintDefaultScalar,
            list: L.genVarHintList,
            numbered: L.genVarHintNumbered,
            separator: L.genVarHintSeparator,
        };
    }

    private renderSidePanel(syntax: string, enabled: boolean): void {
        const L = getLocale(this.locale);
        this.sideEl.empty();

        if (this.mode === 'field') {
            this.sideEl.createDiv({ cls: 'fb-label', text: L.genVariableTitle });
            const examples = enabled
                ? buildVariableExamples(this.type, this.state, this.variableHints(L))
                : [];

            if (examples.length === 0) {
                this.sideEl.createEl('pre', { cls: 'fb-example-block fb-gen-code' })
                    .createEl('code', { text: '—' });
            } else {
                for (const ex of examples) {
                    const row = this.sideEl.createDiv({ cls: 'fb-gen-var-row' });
                    row.createEl('code', { cls: 'fb-gen-var-code', text: ex.code });
                    row.createSpan({ cls: 'fb-desc', text: ex.hint });
                }
            }
            return;
        }

        if (this.mode === 'meta-folder') {
            this.sideEl.createDiv({ cls: 'fb-desc', text: L.genMetaFolderTip });
            return;
        }

        // meta-filename: 変数を含まない固定文字列のみの場合、重複ファイル名の警告を出す
        const value = this.metaFilenameValue.trim();
        if (value === '') return;

        if (!containsVariableToken(value)) {
            const block = this.sideEl.createDiv({ cls: 'fb-warning-block' });
            block.createDiv({ cls: 'fb-warning', text: L.genMetaFilenameNoVariableWarning });
        } else {
            this.sideEl.createDiv({ cls: 'fb-desc', text: L.genMetaFilenameOkTip });
        }
    }

    // ---------------------------------------------------------------
    // ボタン（モードに応じて Copy Variable / Copy Both の有無を出し分け）
    // ---------------------------------------------------------------

    private renderButtons(): void {
        const L = getLocale(this.locale);
        this.buttonsRowEl.empty();
        this.actionButtons = [];

        const copySyntaxBtn = this.buttonsRowEl.createEl('button', { cls: 'fb-btn', text: L.genCopySyntax });
        copySyntaxBtn.addEventListener('click', () => {
            void this.copyToClipboard(this.renderedSyntax(), L);
        });
        this.actionButtons.push(copySyntaxBtn);

        if (this.mode === 'field') {
            const copyVarBtn = this.buttonsRowEl.createEl('button', { cls: 'fb-btn', text: L.genCopyVariable });
            copyVarBtn.addEventListener('click', () => {
                const variableText = buildVariableClipboardText(this.type, this.state, this.variableHints(L));
                void this.copyToClipboard(variableText, L);
            });
            this.actionButtons.push(copyVarBtn);

            const copyBothBtn = this.buttonsRowEl.createEl('button', { cls: 'fb-btn', text: L.genCopyBoth });
            copyBothBtn.addEventListener('click', () => {
                const variableText = buildVariableClipboardText(this.type, this.state, this.variableHints(L));
                void this.copyToClipboard(`${this.renderedSyntax()}\n${variableText}`, L);
            });
            this.actionButtons.push(copyBothBtn);
        }

        const insertBtn = this.buttonsRowEl.createEl('button', { cls: 'fb-btn fb-btn-accent', text: L.genInsert });
        insertBtn.addEventListener('click', () => this.handleInsert(L));
        this.actionButtons.push(insertBtn);

        const cancelBtn = this.buttonsRowEl.createEl('button', { cls: 'fb-btn', text: L.genCancel });
        cancelBtn.addEventListener('click', () => this.close());
    }

    private async copyToClipboard(text: string, L: Locale): Promise<void> {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            new Notice(L.genCopiedNotice);
        } catch (e) {
            console.error('Form Builder: Failed to copy to clipboard', e);
            new Notice(L.noticeCreateError, NOTICE_DURATION);
        }
    }

    private handleInsert(L: Locale): void {
        const raw = this.currentSyntax();
        if (!raw) return;

        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            new Notice(L.genNoActiveEditor);
            return;
        }

        const editor = view.editor;

        if (this.wrapInBlock) {
            // このチェックボックスはカーソルがブロック外のときにしか表示されないため、
            // ここでは cursor-in-block の判定を行わず、新しいブロックごと挿入する。
            editor.replaceRange(wrapInFormbuilderBlock(raw), editor.getCursor());
            new Notice(L.genInsertedNotice);
            this.close();
            return;
        }

        const cursor = editor.getCursor();
        const content = editor.getValue();

        if (!isCursorInFormbuilderBlock(content, cursor.line)) {
            new Notice(L.genInsertOutsideBlock);
            return;
        }

        editor.replaceRange(raw, cursor);
        new Notice(L.genInsertedNotice);
        this.close();
    }
}
