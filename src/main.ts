import { Notice, Plugin, TFile } from 'obsidian';
import { FormBuilderSettingTab, DEFAULT_SETTINGS, sanitizeSettings } from './settings';
import type { FormBuilderSettings } from './settings';
import { FormModal, NoTemplateModal } from './form/FormModal';
import { TemplatePickerModal } from './form/TemplatePickerModal';
import { FieldGeneratorModal } from './form/FieldGeneratorModal';
import { parseTemplate } from './parser/TemplateParser';
import { collectTemplateFiles } from './template/TemplateScanner';
import { TemplateStore } from './template/TemplateStore';
import { showFatalError } from './ui/ErrorNotice';
import { getLocale } from './locales';

export default class FormBuilderPlugin extends Plugin {
    settings!: FormBuilderSettings;
    templateStore!: TemplateStore;

    onload(): void {
        void this.loadSettings()
            .then(() => {
                this.templateStore = new TemplateStore(this);

                this.addSettingTab(new FormBuilderSettingTab(this.app, this));

                this.addCommand({
                    id: 'create-note-from-template',
                    name: 'Create note from template',
                    callback: () => { void this.openTemplatePicker(); },
                });

                this.addCommand({
                    id: 'insert-field',
                    name: 'Syntax generator',
                    callback: () => {
                        new FieldGeneratorModal(this.app, this.settings.locale).open();
                    },
                });

                // ファイルのリネーム・移動を検知し、お気に入り・履歴のパスを追従させる。
                // （Obsidian を閉じている間・PCのエクスプローラーでの変更は追従できないため、
                //   その分は TemplatePickerModal 側の「見つかりません」表示で安全網を張っている）
                this.registerEvent(
                    this.app.vault.on('rename', (file, oldPath) => {
                        if (file instanceof TFile && file.extension === 'md') {
                            void this.templateStore.handleRename(oldPath, file.path);
                        }
                    })
                );
            })
            .catch((e) => {
                // loadSettings() 自体はどんな入力データでも例外を投げない設計にしたが
                // （sanitizeSettings 参照）、TemplateStore の初期化や addCommand など
                // その後の初期化処理が失敗した場合の最終防御として catch を用意する
                // （CodeReview #8）。これがないと初期化失敗が未処理の Promise rejection になり、
                // 原因が分かりにくいまま機能が使えない状態になっていた。
                console.error('Form Builder: Failed to initialize the plugin', e);
                const locale = this.settings?.locale ?? DEFAULT_SETTINGS.locale;
                new Notice(getLocale(locale).noticeInitError);
            });
    }

    onunload(): void {}

    private async openTemplatePicker(): Promise<void> {
        const { templateFolder, locale } = this.settings;

        // テンプレートフォルダを直接取得（Vault 全件列挙を避ける）
        const folder = this.app.vault.getFolderByPath(templateFolder);
        if (!folder) {
            new NoTemplateModal(this.app, this, locale).open();
            return;
        }

        // サブフォルダも含めて formbuilder ブロックを持つファイルを再帰的に収集する
        const templates = await collectTemplateFiles(this.app.vault, folder);

        if (templates.length === 0) {
            new NoTemplateModal(this.app, this, locale).open();
            return;
        }

        if (templates.length === 1) {
            await this.openFormForTemplate(templates[0]);
        } else {
            new TemplatePickerModal(this.app, this, templates, folder.path, locale, (file: TFile) => {
                void this.openFormForTemplate(file);
            }).open();
        }
    }

    private async openFormForTemplate(file: TFile): Promise<void> {
        const { locale } = this.settings;
        const L = getLocale(locale);

        let content: string;
        try {
            content = await this.app.vault.read(file);
        } catch {
            new Notice(`${L.noticeReadError}\n"${file.path}"`);
            return;
        }

        const parseResult = parseTemplate(content, L);

        if (parseResult.errors.length > 0) {
            showFatalError(parseResult.errors, L.noticeFatalHeader);
            return;
        }

        new FormModal(this.app, parseResult, locale).open();
    }

    async loadSettings(): Promise<void> {
        let raw: unknown;
        try {
            raw = await this.loadData();
        } catch (e) {
            // loadData() 自体が失敗するケース（ストレージ層の異常など）も含め、
            // 常に有効な FormBuilderSettings を用意する（CodeReview #8）。
            console.error('Form Builder: Failed to read settings data; falling back to defaults.', e);
            raw = undefined;
        }
        this.settings = sanitizeSettings(raw);
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
