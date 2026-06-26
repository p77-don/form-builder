import { App, PluginSettingTab, Setting } from 'obsidian';
import type FormBuilderPlugin from './main';
import { type SupportedLocale, LOCALE_LABELS, getLocale } from './locales';

export interface FormBuilderSettings {
    templateFolder: string;
    locale: SupportedLocale;
}

export const DEFAULT_SETTINGS: FormBuilderSettings = {
    templateFolder: 'Templates',
    locale: 'en',
};

export class FormBuilderSettingTab extends PluginSettingTab {
    plugin: FormBuilderPlugin;

    constructor(app: App, plugin: FormBuilderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

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
                    // 言語切り替え後に設定画面を再描画
                    this.display();
                });
            });
    }
}
