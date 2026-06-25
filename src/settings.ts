import { App, PluginSettingTab, Setting } from 'obsidian';
import type FormBuilderPlugin from './main';

export interface FormBuilderSettings {
    templateFolder: string;
}

export const DEFAULT_SETTINGS: FormBuilderSettings = {
    templateFolder: 'Templates',
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

        new Setting(containerEl).setHeading().setName('Form Builder Settings');

        new Setting(containerEl)
            .setName('Template folder')
            .setDesc('Folder to look for template files. Markdown files in this folder will be treated as templates.')
            .addText(text => text
                .setPlaceholder('Templates')
                .setValue(this.plugin.settings.templateFolder)
                .onChange(async (value) => {
                    this.plugin.settings.templateFolder = value.trim();
                    await this.plugin.saveSettings();
                }));
    }
}
