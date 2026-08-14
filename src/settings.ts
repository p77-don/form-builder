import { App, PluginSettingTab } from 'obsidian';
import type { SettingDefinitionItem } from 'obsidian';
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

    // v1.13.0+ の宣言的設定 API。getSettingDefinitions() は設定タブが
    // 開かれるたび・update() が呼ばれるたびに再評価されるため、
    // name / desc に現在のロケール（L）の文字列をそのまま使えば
    // 言語切り替え時に全行を再描画できる … はずだったが、実際には
    // update() が既存の行の DOM を可能な限り再利用しようとする挙動があり、
    // 「変更操作を行った行自身（Language 行）」だけ name/desc が
    // 更新されないことを確認した（Obsidian フォーラムにも 1.13 系の
    // 宣言的設定 API で update() 後に行が正しく再構築されない、という
    // 趣旨の不具合報告が複数ある）。
    //
    // 対処として、setControlValue() 側で update() を呼ぶ前に
    // containerEl.empty() を挟み、再利用できる既存行を残さないようにする。
    // これはレガシー版の display()（毎回 containerEl.empty() してから
    // 全行を作り直す）と同じ考え方で、実際にレガシー版では発生しなかった
    // 挙動であることからも有効と判断した。
    getSettingDefinitions(): SettingDefinitionItem[] {
        const L = getLocale(this.plugin.settings.locale);

        return [
            {
                name: L.settingFolderName,
                desc: L.settingFolderDesc,
                control: {
                    type: 'text',
                    key: 'templateFolder',
                    placeholder: L.settingFolderPlaceholder,
                },
            },
            {
                name: L.settingLanguageName,
                desc: L.settingLanguageDesc,
                control: {
                    type: 'dropdown',
                    key: 'locale',
                    defaultValue: DEFAULT_SETTINGS.locale,
                    options: LOCALE_LABELS,
                },
            },
        ];
    }

    getControlValue(key: string): unknown {
        return (this.plugin.settings as unknown as Record<string, unknown>)[key];
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        // Template folder はレガシー版と同様、前後の空白を除去してから保存する。
        // （入力欄の表示自体は setValue() で書き戻さない限り変わらないため、
        //   タイピング中に勝手に空白が消えることはない）
        if (key === 'templateFolder' && typeof value === 'string') {
            value = value.trim();
        }

        (this.plugin.settings as unknown as Record<string, unknown>)[key] = value;
        await this.plugin.saveSettings();

        // locale はすべての行の name / desc に影響するうえ、update() だけでは
        // 変更操作を行った行（Language 行）自身の DOM が再利用されてしまい
        // name/desc が更新されないため、containerEl を明示的に空にしてから
        // update() を呼び、全行を確実に作り直す。
        if (key === 'locale') {
            this.containerEl.empty();
            this.update();
        }
    }
}
