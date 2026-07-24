import type { App } from 'obsidian';
import type FormBuilderPlugin from '../main';
import type { TabType, TemplateEntry } from '../model/TemplateEntry';

const MAX_RECENT = 20;

/**
 * お気に入り・最近使った・最後に開いたタブ の永続データ操作を1箇所にまとめる。
 * 実データは plugin.settings（= data.json）に保持し、
 * このクラスは読み書きロジックのみを提供する。
 */
export class TemplateStore {
    constructor(private plugin: FormBuilderPlugin) {}

    // ------------------------------------------------------------
    // お気に入り
    // ------------------------------------------------------------

    getFavorites(): string[] {
        return [...this.plugin.settings.favorites];
    }

    isFavorite(path: string): boolean {
        return this.plugin.settings.favorites.includes(path);
    }

    async toggleFavorite(path: string): Promise<void> {
        const favorites = this.plugin.settings.favorites;
        const idx = favorites.indexOf(path);
        if (idx === -1) {
            favorites.push(path);
        } else {
            favorites.splice(idx, 1);
        }
        await this.plugin.saveSettings();
    }

    /** グレーアウトした「見つからない」項目をユーザーが手動で削除する場合に使用する。 */
    async removeFavorite(path: string): Promise<void> {
        const favorites = this.plugin.settings.favorites;
        const idx = favorites.indexOf(path);
        if (idx !== -1) {
            favorites.splice(idx, 1);
            await this.plugin.saveSettings();
        }
    }

    // ------------------------------------------------------------
    // 最近使った
    // ------------------------------------------------------------

    getRecent(): string[] {
        return [...this.plugin.settings.recentTemplates];
    }

    /** テンプレート生成成功時に呼び出す。重複は先頭へ移動し、最大件数を超えたら古いものを切り詰める。 */
    async pushRecent(path: string): Promise<void> {
        const recent = this.plugin.settings.recentTemplates;
        const existing = recent.indexOf(path);
        if (existing !== -1) recent.splice(existing, 1);
        recent.unshift(path);
        if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
        await this.plugin.saveSettings();
    }

    async removeRecent(path: string): Promise<void> {
        const recent = this.plugin.settings.recentTemplates;
        const idx = recent.indexOf(path);
        if (idx !== -1) {
            recent.splice(idx, 1);
            await this.plugin.saveSettings();
        }
    }

    /** 使用履歴をすべて削除する。 */
    async clearRecent(): Promise<void> {
        if (this.plugin.settings.recentTemplates.length === 0) return;
        this.plugin.settings.recentTemplates.length = 0;
        await this.plugin.saveSettings();
    }

    // ------------------------------------------------------------
    // 最後に開いていたタブ
    // ------------------------------------------------------------

    getLastTab(): TabType {
        return this.plugin.settings.lastTab;
    }

    async setLastTab(tab: TabType): Promise<void> {
        if (this.plugin.settings.lastTab === tab) return;
        this.plugin.settings.lastTab = tab;
        await this.plugin.saveSettings();
    }

    // ------------------------------------------------------------
    // リネーム追従（Obsidian 内でのファイル移動・リネームをリアルタイムに反映）
    // ------------------------------------------------------------

    async handleRename(oldPath: string, newPath: string): Promise<void> {
        let changed = false;

        const favorites = this.plugin.settings.favorites;
        const favIdx = favorites.indexOf(oldPath);
        if (favIdx !== -1) {
            favorites[favIdx] = newPath;
            changed = true;
        }

        const recent = this.plugin.settings.recentTemplates;
        const recentIdx = recent.indexOf(oldPath);
        if (recentIdx !== -1) {
            recent[recentIdx] = newPath;
            changed = true;
        }

        if (changed) await this.plugin.saveSettings();
    }

    // ------------------------------------------------------------
    // 存在チェック（表示用の安全網。PCエクスプローラー等での変更・削除を検知する）
    // ------------------------------------------------------------

    isMissing(app: App, path: string): boolean {
        return app.vault.getFileByPath(path) === null;
    }

    annotate(app: App, paths: string[]): TemplateEntry[] {
        return paths.map(path => ({ path, isMissing: this.isMissing(app, path) }));
    }
}
