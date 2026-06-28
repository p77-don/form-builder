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

    // v1.13.0+ 向け宣言的 API。
    // Obsidian は getSettingDefinitions() が配列を返す場合に display() をバイパスするため、
    // 両メソッドを実装することで v1.13.0 未満との後方互換を保つ（デュアルサポートパターン）。
    getSettingDefinitions() {
        const localeOptions = Object.fromEntries(
            Object.entries(LOCALE_LABELS) as [SupportedLocale, string][]
        );

        return [
            {
                name: 'Form Builder',
            },
            {
                name: 'Template folder',
                desc: 'Folder where your formbuilder template files are stored.',
                control: {
                    type: 'folder' as const,
                    key: 'templateFolder' as const,
                    placeholder: 'Templates',
                    includeRoot: false,
                },
            },
            {
                name: 'Language',
                desc: 'Language used in forms, notices, and the settings page.',
                control: {
                    type: 'dropdown' as const,
                    key: 'locale' as const,
                    options: localeOptions,
                },
            },
        ];
    }

    // v1.13.0 未満の Obsidian 向けフォールバック。
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
