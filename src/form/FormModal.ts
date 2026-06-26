import { App, Modal, Notice, TFile } from 'obsidian';
import type { ParseResult } from '../model/FieldModel';
import type { SupportedLocale } from '../locales';
import { getLocale } from '../locales';
import { HelpModal } from './help';
import { renderField, highlightRequiredErrors } from './FieldRenderer';
import { generateNote } from '../generator/NoteGenerator';
import type FormBuilderPlugin from '../main';

type ValueStore = Map<string, string | string[] | boolean>;

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
        for (const field of this.parseResult.fields) {
            renderField(root, field, this.values);
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
            new Notice(`${L.noticeCreateError}\n${message}`, 8000);
        }
    }
}

// ============================================================
// テンプレート選択モーダル（下部に Help ボタン）
// ============================================================

export class TemplateSelectorModal extends Modal {
    private templates: TFile[];
    private onSelect: (file: TFile) => void;
    private locale: SupportedLocale;

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

        const list = root.createEl('ul', { cls: 'fb-template-list' });
        for (const file of this.templates) {
            const li = list.createEl('li');
            const btn = li.createEl('button', { cls: 'fb-template-btn' });
            btn.appendText(file.basename);
            btn.addEventListener('click', () => {
                this.close();
                this.onSelect(file);
            });
        }

        const btnRow = root.createDiv({ cls: 'fb-btn-row' });
        const helpBtn = btnRow.createEl('button', { cls: 'fb-btn', text: L.btnHelp });
        helpBtn.addEventListener('click', () => new HelpModal(this.app, this.locale).open());
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
