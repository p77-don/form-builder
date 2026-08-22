import { App, Modal, Notice } from 'obsidian';
import type { ParseResult, ValueStore } from '../model/FieldModel';
import type { SupportedLocale } from '../locales';
import { getLocale } from '../locales';
import { HelpModal } from './help';
import { renderField, highlightRequiredErrors, validateNumberFields } from './FieldRenderer';
import { generateNote } from '../generator/NoteGenerator';
import { NOTICE_DURATION } from '../ui/ErrorNotice';
import { applyMobileModalBehavior } from '../ui/MobileModal';
import type FormBuilderPlugin from '../main';

/** Obsidian の内部 setting パネルを開く。公開 API がないため型安全なラッパーを使用。 */
interface AppWithSetting {
    setting: { open: () => void };
}
function openObsidianSettings(app: App): void {
    (app as unknown as AppWithSetting).setting.open();
}

// FormModal のインスタンスごとに一意な ID を発行する（multiselect のチェックボックス ID
// 衝突防止に使う。CodeReview #9）。プラグイン全体で1つのカウンターを共有すればよい。
let fbModalInstanceCounter = 0;
function generateInstanceId(): string {
    fbModalInstanceCounter++;
    return `fbm-${Date.now().toString(36)}-${fbModalInstanceCounter}`;
}

// ============================================================
// フォームモーダル（Help ボタンなし）
// ============================================================

export class FormModal extends Modal {
    private parseResult: ParseResult;
    private values: ValueStore = new Map();
    private locale: SupportedLocale;
    private instanceId = generateInstanceId();

    private submitBtnEl?: HTMLButtonElement;
    // Create Note の連打・多重クリックで generateNote() が並行実行されるのを防ぐフラグ
    // （CodeReview #2）。送信中は送信ボタンを disabled にし、完了後に解除する。
    private isSubmitting = false;

    constructor(app: App, parseResult: ParseResult, locale: SupportedLocale) {
        super(app);
        this.parseResult = parseResult;
        this.locale = locale;
    }

    onOpen(): void {
        this.modalEl.addClass('fb-modal-root');
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.formTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal' });
        this.renderWarnings(root);
        this.renderFields(root);
        this.renderSubmitButton(root, L.btnCreateNote);
        applyMobileModalBehavior(this);
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
        const ctx = {
            app: this.app,
            multilistHint: L.multilistHint,
            folderPickerBtnLabel: L.folderPickerBtnLabel,
            folderPickerPlaceholder: L.folderPickerPlaceholder,
            instanceId: this.instanceId,
        };
        for (const field of this.parseResult.fields) {
            renderField(root, field, this.values, ctx);
        }
    }

    private renderSubmitButton(root: HTMLElement, label: string): void {
        const wrap = root.createDiv({ cls: 'fb-submit-wrap' });
        const btn = wrap.createEl('button', { cls: 'fb-submit-btn', text: label });
        this.submitBtnEl = btn;
        btn.addEventListener('click', () => { void this.onSubmit(); });
    }

    private async onSubmit(): Promise<void> {
        // ボタンは送信中に disabled にしているが、イベントが既にキューされているケースへの
        // 最終防御として、フラグでも二重実行を防ぐ（CodeReview #2）。
        if (this.isSubmitting) return;

        const L = getLocale(this.locale);
        const root = this.contentEl.querySelector('.fb-modal') as HTMLElement;
        const missing = highlightRequiredErrors(root, this.parseResult.fields, this.values);
        const numberErrors = validateNumberFields(root, this.parseResult.fields, this.values);

        if (missing.length > 0) new Notice(L.noticeRequired);
        if (numberErrors.length > 0) new Notice(L.noticeInvalidNumber);
        if (missing.length > 0 || numberErrors.length > 0) return;

        this.isSubmitting = true;
        if (this.submitBtnEl) this.submitBtnEl.disabled = true;

        try {
            await generateNote(
                this.app,
                this.parseResult.bodyTemplate,
                this.values,
                this.parseResult.fields,
                this.parseResult.meta,
                L
            );
            this.close();
        } catch (e) {
            console.error('Form Builder: Failed to create note', e);
            const message = e instanceof Error ? e.message : String(e);
            new Notice(`${L.noticeCreateError}\n${message}`, NOTICE_DURATION);
        } finally {
            this.isSubmitting = false;
            if (this.submitBtnEl) this.submitBtnEl.disabled = false;
        }
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
        this.modalEl.addClass('fb-modal-root');
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
                openObsidianSettings(this.app);
            });

        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnClose })
            .addEventListener('click', () => this.close());

        applyMobileModalBehavior(this);
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
