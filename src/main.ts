import { Notice, Plugin, TFile } from 'obsidian';
import { FormBuilderSettingTab, DEFAULT_SETTINGS } from './settings';
import type { FormBuilderSettings } from './settings';
import { FormModal, NoTemplateModal, TemplateSelectorModal } from './form/FormModal';
import { parseTemplate, FORMBUILDER_BLOCK_RE } from './parser/TemplateParser';
import { showFatalError } from './ui/ErrorNotice';
import { getLocale } from './locales';

export default class FormBuilderPlugin extends Plugin {
    settings!: FormBuilderSettings;

    async onload(): Promise<void> {
        await this.loadSettings();
        this.addSettingTab(new FormBuilderSettingTab(this.app, this));

        this.addCommand({
            id: 'create-note-from-template',
            name: 'Create Note From Template',
            callback: () => this.openTemplatePicker(),
        });
    }

    async onunload(): Promise<void> {}

    private async openTemplatePicker(): Promise<void> {
        const { templateFolder, locale } = this.settings;

        // テンプレートフォルダ内の Markdown ファイルを収集
        const allFiles = this.app.vault.getMarkdownFiles().filter(f =>
            f.path.startsWith(templateFolder + '/') ||
            f.path.startsWith(templateFolder + '\\')
        );

        // formbuilder ブロックを持つファイルのみに絞り込む
        const templates: TFile[] = [];
        for (const file of allFiles) {
            try {
                const content = await this.app.vault.read(file);
                if (FORMBUILDER_BLOCK_RE.test(content)) templates.push(file);
            } catch {
                // 読み込み失敗したファイルは無視
            }
        }

        if (templates.length === 0) {
            new NoTemplateModal(this.app, this, locale).open();
            return;
        }

        if (templates.length === 1) {
            await this.openFormForTemplate(templates[0]);
        } else {
            new TemplateSelectorModal(this.app, templates, locale, async (file: TFile) => {
                await this.openFormForTemplate(file);
            }).open();
        }
    }

    private async openFormForTemplate(file: TFile): Promise<void> {
        const { locale } = this.settings;
        const L = getLocale(locale);

        let content: string;
        try {
            content = await this.app.vault.read(file);
        } catch (e) {
            new Notice(`${L.noticeReadError}\n"${file.path}"`);
            return;
        }

        const parseResult = parseTemplate(content);

        if (parseResult.errors.length > 0) {
            showFatalError(parseResult.errors, L.noticeFatalHeader);
            return;
        }

        new FormModal(this.app, parseResult, locale).open();
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
