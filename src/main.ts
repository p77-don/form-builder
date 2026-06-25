import { Notice, Plugin, TFile } from 'obsidian';
import { FormBuilderSettingTab, DEFAULT_SETTINGS } from './settings';
import type { FormBuilderSettings } from './settings';
import { FormModal, NoTemplateModal, TemplateSelectorModal } from './form/FormModal';
import { parseTemplate } from './parser/TemplateParser';
import { showFatalError } from './ui/ErrorNotice';

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

    async onunload(): Promise<void> {
        // registerEvent 等は自動解放されるため追加処理なし
    }

    /**
     * テンプレートフォルダから Markdown ファイルを取得し、
     * テンプレート選択 → フォーム表示 の流れを起動する
     */
    private async openTemplatePicker(): Promise<void> {
        const folderPath = this.settings.templateFolder;

        // テンプレートフォルダ内の Markdown ファイルを収集
        const templates = this.app.vault.getMarkdownFiles().filter(f =>
            f.path.startsWith(folderPath + '/') || f.path.startsWith(folderPath + '\\')
        );

        if (templates.length === 0) {
            new NoTemplateModal(this.app, this).open();
            return;
        }

        if (templates.length === 1) {
            // 1つしかなければ直接開く
            await this.openFormForTemplate(templates[0]);
        } else {
            // 複数あればセレクターを表示
            new TemplateSelectorModal(this.app, templates, async (file: TFile) => {
                await this.openFormForTemplate(file);
            }).open();
        }
    }

    /**
     * 指定テンプレートファイルを読み込んでフォームを表示する
     */
    private async openFormForTemplate(file: TFile): Promise<void> {
        let content: string;
        try {
            content = await this.app.vault.read(file);
        } catch (e) {
            new Notice(`Form Builder: Failed to read template file "${file.path}".`);
            return;
        }

        const parseResult = parseTemplate(content);

        // 致命的エラーがある場合はフォーム生成を中止
        if (parseResult.errors.length > 0) {
            showFatalError(parseResult.errors);
            return;
        }

        new FormModal(this.app, parseResult).open();
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
