import { App, PluginSettingTab, Setting } from 'obsidian';
import type FormBuilderPlugin from './main';
import { type SupportedLocale, LOCALE_LABELS, getLocale } from './locales';
import type { TabType } from './model/TemplateEntry';

export interface FormBuilderSettings {
    templateFolder: string;
    locale: SupportedLocale;
    /** お気に入り登録されたテンプレートのパス一覧 */
    favorites: string[];
    /** 最近使ったテンプレートのパス一覧（先頭が最新、最大20件） */
    recentTemplates: string[];
    /** テンプレート選択モーダルで最後に開いていたタブ */
    lastTab: TabType;
}

export const DEFAULT_SETTINGS: FormBuilderSettings = {
    templateFolder: 'Templates',
    locale: 'en',
    favorites: [],
    recentTemplates: [],
    lastTab: 'folder',
};

export class FormBuilderSettingTab extends PluginSettingTab {
    plugin: FormBuilderPlugin;

    constructor(app: App, plugin: FormBuilderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // 回避策: v1.13.0+ の宣言的 API（getSettingDefinitions() / update()）は、
    // locale を変更した際に「変更元の行（Language 自身）の name / desc だけ
    // 再描画されない」という不具合が確認されたため、あえて使用しない。
    //
    // ドキュメント上、getSettingDefinitions() が「非空配列」を返した場合のみ
    // display() がバイパスされる仕様になっているため、このメソッド自体を
    // 定義しない（基底クラスの既定実装が空配列を返す）ことで、
    // 常に下の display()（レガシーAPI）が使われるようにする。
    // display() 側は日本語切り替え時の再描画も含めて正しく動作することを確認済み。

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        const L = getLocale(this.plugin.settings.locale);

        new Setting(containerEl)
            .setHeading()
            .setName(L.settingHeading);

        new Setting(containerEl)
            .setName(L.settingFolderName)
            .setDesc(L.settingFolderDesc)
            .addText(text => text
                .setPlaceholder(L.settingFolderPlaceholder)
                .setValue(this.plugin.settings.templateFolder)
                .onChange(async (value) => {
                    this.plugin.settings.templateFolder = value.trim();
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(L.settingLanguageName)
            .setDesc(L.settingLanguageDesc)
            .addDropdown(drop => {
                for (const [key, label] of Object.entries(LOCALE_LABELS)) {
                    drop.addOption(key, label);
                }
                drop.setValue(this.plugin.settings.locale);
                drop.onChange(async (value) => {
                    this.plugin.settings.locale = value as SupportedLocale;
                    await this.plugin.saveSettings();
                    this.display();
                });
            });
    }
}
