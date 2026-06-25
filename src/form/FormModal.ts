import { App, Modal, Notice, Setting, TFile } from 'obsidian';
import type { ParseResult, FormField } from '../model/FieldModel';
import { renderField, highlightRequiredErrors } from './FieldRenderer';
import { generateNote } from '../generator/NoteGenerator';
import { resolveFilenamePreview, resolveSystemVariables } from '../generator/VariableResolver';
import type FormBuilderPlugin from '../main';

type ValueStore = Map<string, string | string[] | boolean>;

/**
 * フォームモーダル本体
 */
export class FormModal extends Modal {
    private parseResult: ParseResult;
    private values: ValueStore = new Map();
    private outputFolder: string;
    private fileName: string;

    constructor(app: App, parseResult: ParseResult) {
        super(app);
        this.parseResult = parseResult;
        this.outputFolder = parseResult.meta.folder ?? '';
        // filename テンプレートをプレビュー展開
        this.fileName = parseResult.meta.filename
            ? resolveFilenamePreview(parseResult.meta.filename, parseResult.fields)
            : 'Untitled';
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        this.setTitle('Form Builder');

        this.renderWarnings();
        this.renderMetaSection();
        this.renderFields();
        this.renderSubmitButton();
    }

    onClose(): void {
        this.contentEl.empty();
    }

    // ---------- 警告ブロック ----------

    private renderWarnings(): void {
        if (this.parseResult.warnings.length === 0) return;
        const warningBlock = this.contentEl.createDiv({ cls: 'form-builder-warning-block' });
        for (const w of this.parseResult.warnings) {
            const div = warningBlock.createDiv({ cls: 'form-builder-warning' });
            div.createSpan({ text: `⚠ ${w.message}` });
        }
    }

    // ---------- 出力フォルダ・ファイル名 ----------

    private renderMetaSection(): void {
        const { contentEl } = this;

        // Output Folder
        new Setting(contentEl)
            .setName('Output folder')
            .setDesc('Folder where the note will be saved.')
            .addText(text => text
                .setPlaceholder('e.g. Notes/Characters')
                .setValue(this.outputFolder)
                .onChange(value => { this.outputFolder = value; }));

        // File Name
        new Setting(contentEl)
            .setName('File name')
            .setDesc('Name of the note to create (without .md extension).')
            .addText(text => text
                .setValue(this.fileName)
                .onChange(value => { this.fileName = value; }));
    }

    // ---------- フィールド群 ----------

    private renderFields(): void {
        const { contentEl } = this;

        if (this.parseResult.fields.length > 0) {
            contentEl.createEl('hr');
        }

        for (const field of this.parseResult.fields) {
            renderField(contentEl, field, this.values);
        }
    }

    // ---------- 送信ボタン ----------

    private renderSubmitButton(): void {
        const { contentEl } = this;
        contentEl.createEl('hr');

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Create Note')
                .setCta()
                .onClick(() => this.onSubmit()));
    }

    // ---------- 送信処理 ----------

    private async onSubmit(): Promise<void> {
        const missing = highlightRequiredErrors(
            this.contentEl,
            this.parseResult.fields,
            this.values
        );

        if (missing.length > 0) {
            new Notice(`Form Builder: Please fill in all required fields.`);
            return;
        }

        // ファイル名の最終確認
        const rawFileName = this.fileName.trim() || 'Untitled';

        try {
            await generateNote(
                this.app,
                this.parseResult.bodyTemplate,
                this.values,
                this.parseResult.fields,
                this.parseResult.meta,
                this.outputFolder.trim(),
                rawFileName
            );
            this.close();
        } catch (e) {
            console.error('Form Builder: Failed to create note', e);
            const message = e instanceof Error ? e.message : String(e);
            new Notice(`Form Builder: Failed to create note.\n${message}`, 8000);
        }
    }
}

// ============================================================
// テンプレート選択モーダル
// ============================================================

export class TemplateSelectorModal extends Modal {
    private templates: TFile[];
    private onSelect: (file: TFile) => void;

    constructor(app: App, templates: TFile[], onSelect: (file: TFile) => void) {
        super(app);
        this.templates = templates;
        this.onSelect = onSelect;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        this.setTitle('Select Template');

        const listEl = contentEl.createEl('ul', { cls: 'form-builder-template-list' });
        for (const file of this.templates) {
            const li = listEl.createEl('li', { cls: 'form-builder-template-item' });
            const btn = li.createEl('button', { cls: 'form-builder-template-btn' });
            btn.textContent = file.basename;
            btn.addEventListener('click', () => {
                this.close();
                this.onSelect(file);
            });
        }
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

    constructor(app: App, plugin: FormBuilderPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        this.setTitle('Welcome to Form Builder');

        contentEl.createEl('p', {
            text: 'No templates found. Please create a template file and place it in your template folder.'
        });

        const exampleBlock = contentEl.createEl('pre', { cls: 'form-builder-example' });
        exampleBlock.createEl('code', {
            text: [
                '```formbuilder',
                '{{text|name|label=[名前]}}',
                '{{textarea|description|label=[説明]}}',
                '```',
            ].join('\n')
        });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Open Settings')
                .onClick(() => {
                    this.close();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.app as any).setting.open();
                }))
            .addButton(btn => btn
                .setButtonText('Documentation')
                .onClick(() => {
                    window.open('https://github.com/your-repo/form-builder#readme');
                }))
            .addButton(btn => btn
                .setButtonText('Close')
                .onClick(() => this.close()));
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
