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

function isValidLocale(value: unknown): value is SupportedLocale {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LOCALE_LABELS, value);
}

function isValidTab(value: unknown): value is TabType {
    return value === 'folder' || value === 'favorites' || value === 'recent';
}

/** 配列であることを確認し、文字列以外の要素だけを取り除いた文字列配列を返す。 */
function toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((v): v is string => typeof v === 'string');
}

/**
 * `loadData()` が返す未検証のデータ（旧バージョンの形式・ユーザーによる手編集・
 * 同期競合による破損などを含み得る）を、安全に使える `FormBuilderSettings` へ
 * 検証・移行する（CodeReview #8）。
 *
 * 従来は `Object.assign({}, DEFAULT_SETTINGS, await this.loadData())` という
 * 浅いマージのみを行っていたため、例えば保存データの `favorites` が `null` や
 * 文字列だった場合でも、そのまま `TemplateStore` の `.includes()` / `.push()` などに
 * 渡ってしまい、実行時例外につながる可能性があった。
 *
 * ここではプロパティ単位で型・値を検証し、不正なものだけを既定値へ戻す
 * （正常なプロパティはそのまま活かす）。
 */
export function sanitizeSettings(raw: unknown): FormBuilderSettings {
    const data = (raw !== null && typeof raw === 'object') ? raw as Record<string, unknown> : {};

    return {
        templateFolder: typeof data.templateFolder === 'string'
            ? data.templateFolder
            : DEFAULT_SETTINGS.templateFolder,
        locale: isValidLocale(data.locale) ? data.locale : DEFAULT_SETTINGS.locale,
        favorites: toStringArray(data.favorites),
        recentTemplates: toStringArray(data.recentTemplates),
        lastTab: isValidTab(data.lastTab) ? data.lastTab : DEFAULT_SETTINGS.lastTab,
    };
}

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
        // 定義済みの設定キーのみを対象にする（想定外のキーには関与しない）（CodeReview #8）。
        if (key === 'templateFolder') return this.plugin.settings.templateFolder;
        if (key === 'locale') return this.plugin.settings.locale;
        return undefined;
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        // 許可した設定キーだけを、型を検証したうえで更新する。
        // 以前は `(settings as Record<string, unknown>)[key] = value` という
        // 任意の key・型をそのまま書き込む実装だったため、想定外の呼び出しや
        // 将来の API 変更で不正な値が settings に混入する余地があった（CodeReview #8）。
        if (key === 'templateFolder') {
            // Template folder はレガシー版と同様、前後の空白を除去してから保存する。
            // （入力欄の表示自体は setValue() で書き戻さない限り変わらないため、
            //   タイピング中に勝手に空白が消えることはない）
            this.plugin.settings.templateFolder = typeof value === 'string'
                ? value.trim()
                : DEFAULT_SETTINGS.templateFolder;
        } else if (key === 'locale') {
            this.plugin.settings.locale = isValidLocale(value) ? value : DEFAULT_SETTINGS.locale;
        } else {
            console.warn(`Form Builder: Unknown setting key "${key}"; ignoring.`);
            return;
        }

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
