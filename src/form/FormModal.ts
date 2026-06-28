import { App, Modal, Notice, TFile } from 'obsidian';
import type { ParseResult, ValueStore } from '../model/FieldModel';
import type { SupportedLocale } from '../locales';
import { getLocale } from '../locales';
import { HelpModal } from './help';
import { renderField, highlightRequiredErrors } from './FieldRenderer';
import { generateNote } from '../generator/NoteGenerator';
import { NOTICE_DURATION } from '../ui/ErrorNotice';
import type FormBuilderPlugin from '../main';

// ============================================================
// フォームモーダル（Help ボタンなし）
// ============================================================

export class FormModal extends Modal {
    private parseResult: ParseResult;
    private values: ValueStore = new Map();
    private locale: SupportedLocale;

    constructor(app: App, parseResult: ParseResult, locale: SupportedLocale) {
        super(app);
        this.parseResult = parseResult;
        this.locale = locale;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.formTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal' });
        this.renderWarnings(root);
        this.renderFields(root);
        this.renderSubmitButton(root, L.btnCreateNote);
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private renderWarnings(root: HTMLElement): void {
        if (this.parseResult.warnings.length === 0) return;
        const block = root.createDiv({ cls: 'fb-warning-block' });
        for (const w of this.parseResult.warnings) {
            block.createDiv({ cls: 'fb-warning', text: `⚠ ${w.message}` });
        }
    }

    private renderFields(root: HTMLElement): void {
        const L = getLocale(this.locale);
        for (const field of this.parseResult.fields) {
            renderField(root, field, this.values, L.multilistHint);
        }
    }

    private renderSubmitButton(root: HTMLElement, label: string): void {
        const wrap = root.createDiv({ cls: 'fb-submit-wrap' });
        const btn = wrap.createEl('button', { cls: 'fb-submit-btn', text: label });
        btn.addEventListener('click', () => this.onSubmit());
    }

    private async onSubmit(): Promise<void> {
        const L = getLocale(this.locale);
        const root = this.contentEl.querySelector('.fb-modal') as HTMLElement;
        const missing = highlightRequiredErrors(root, this.parseResult.fields, this.values);

        if (missing.length > 0) {
            new Notice(L.noticeRequired);
            return;
        }

        try {
            await generateNote(
                this.app,
                this.parseResult.bodyTemplate,
                this.values,
                this.parseResult.fields,
                this.parseResult.meta,
                L.noticeSanitized
            );
            this.close();
        } catch (e) {
            console.error('Form Builder: Failed to create note', e);
            const message = e instanceof Error ? e.message : String(e);
            new Notice(`${L.noticeCreateError}\n${message}`, NOTICE_DURATION);
        }
    }
}

// ============================================================
// テンプレート選択モーダル（ソート切替・下部に Help ボタン）
// ============================================================

export class TemplateSelectorModal extends Modal {
    private templates: TFile[];
    private onSelect: (file: TFile) => void;
    private locale: SupportedLocale;
    private ascending = true;  // 起動時は昇順

    constructor(app: App, templates: TFile[], locale: SupportedLocale, onSelect: (file: TFile) => void) {
        super(app);
        this.templates = templates;
        this.locale = locale;
        this.onSelect = onSelect;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.selectorTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal' });

        // ソートボタン（リスト上部）
        const sortRow = root.createDiv({ cls: 'fb-sort-row' });
        const sortBtn = sortRow.createEl('button', {
            cls: 'fb-btn fb-sort-btn',
            text: L.sortAsc,
        });

        // テンプレートリスト（ソート状態に応じて再描画）
        const listWrap = root.createDiv();
        const renderList = () => {
            listWrap.empty();
            const sorted = [...this.templates].sort((a, b) =>
                this.ascending
                    ? a.basename.localeCompare(b.basename)
                    : b.basename.localeCompare(a.basename)
            );
            const ul = listWrap.createEl('ul', { cls: 'fb-template-list' });
            for (const file of sorted) {
                const btn = ul.createEl('li').createEl('button', {
                    cls: 'fb-template-btn',
                });
                btn.appendText(file.basename);
                btn.addEventListener('click', () => {
                    this.close();
                    this.onSelect(file);
                });
            }
        };

        // ソートボタンの動作
        sortBtn.addEventListener('click', () => {
            this.ascending = !this.ascending;
            sortBtn.textContent = this.ascending ? L.sortAsc : L.sortDesc;
            sortBtn.toggleClass('fb-sort-btn--desc', !this.ascending);
            renderList();
        });

        renderList();  // 初期描画（昇順）

        // 下部ボタン行
        const btnRow = root.createDiv({ cls: 'fb-btn-row' });
        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnHelp })
            .addEventListener('click', () => new HelpModal(this.app, this.locale).open());
    }

    onClose(): void {
        this.contentEl.empty();
    }
}

// ============================================================
// テンプレート未検出モーダル
// ============================================================

export class NoTemplateModal extends Modal {
    private plugin: FormBuilderPlugin;
    private locale: SupportedLocale;

    constructor(app: App, plugin: FormBuilderPlugin, locale: SupportedLocale) {
        super(app);
        this.plugin = plugin;
        this.locale = locale;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.welcomeTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal' });

        root.createDiv({ cls: 'fb-no-template-msg', text: L.noTemplateMessage });
        root.createEl('pre', { cls: 'fb-example-block' })
            .createEl('code', { text: L.noTemplateSample });

        const btnRow = root.createDiv({ cls: 'fb-btn-row' });

        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnHelp })
            .addEventListener('click', () => new HelpModal(this.app, this.locale).open());

        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnSettings })
            .addEventListener('click', () => {
                this.close();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.app as any).setting.open();
            });

        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnClose })
            .addEventListener('click', () => this.close());
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
