import { App, Modal, TFile } from 'obsidian';
import type { Locale, SupportedLocale } from '../locales';
import { getLocale } from '../locales';
import { HelpModal } from './help';
import { buildTemplateTree } from '../template/TemplateTreeBuilder';
import type { TabType, TemplateEntry, TemplateFolderNode } from '../model/TemplateEntry';
import type FormBuilderPlugin from '../main';

/**
 * テンプレート選択モーダル（タブ切替版）。
 *
 * - 📁 フォルダタブ: テンプレートフォルダの階層構造をそのまま表示
 * - ★ お気に入りタブ: お気に入り登録したテンプレートのみ表示
 * - 🕒 使用履歴タブ: 直近で使用したテンプレートを新しい順に表示
 * - 検索ボックスは常時表示の共通フィルターとして機能する（タブではない）。
 *   入力中は右側に「×」ボタンが現れ、検索文字列だけをクリアできる。
 * - 昇順・降順の並び替えボタンと、使用履歴クリアボタンは下部の「？ヘルプ」ボタンの左隣に配置する。
 *   検索ボックスのすぐ隣に置くと「検索のクリア」と誤認されるため、あえて離してある。
 *   並び順は [使用履歴をクリア]（使用履歴タブでのみ表示）→ [昇順・降順] → [？ヘルプ] とし、
 *   昇順・降順ボタンが常にヘルプボタンのすぐ左に来るようにして、表示位置が動いて見えないようにする。
 *   昇順・降順ボタンは全タブ共通で常に表示されるが、使用履歴タブでは押せないようグレーアウトする
 *   （使用履歴は使用順を優先するため）。
 * - お気に入り／使用履歴タブは階層を持たないフラット表示のため、
 *   テンプレート名は templateFolder を基準とした相対パス（例: item/case/item-b）で表示する。
 *
 * お気に入り・使用履歴タブでは、リネーム・移動・削除により
 * 実体が見つからなくなったテンプレートをグレーアウト表示し、
 * ユーザー自身の操作（✕）で削除できるようにする（自動では消さない）。
 *
 * モーダルの横幅・縦幅は表示内容に関わらず固定とし、一覧部分のみが内部スクロールする。
 */
export class TemplatePickerModal extends Modal {
    private plugin: FormBuilderPlugin;
    private locale: SupportedLocale;
    private onSelect: (file: TFile) => void;

    private allTemplates: TFile[];
    private templateFolderPath: string;

    private activeTab: TabType;
    private searchQuery = '';
    private ascending = true;
    private expandedFolders = new Set<string>();

    private tabBarEl!: HTMLElement;
    private listContainer!: HTMLElement;
    private searchInputEl!: HTMLInputElement;
    private searchClearBtnEl!: HTMLButtonElement;
    private sortToggleEl!: HTMLButtonElement;
    private clearRecentBtnEl!: HTMLButtonElement;
    private resetClearRecentConfirm: () => void = () => {};

    constructor(
        app: App,
        plugin: FormBuilderPlugin,
        allTemplates: TFile[],
        templateFolderPath: string,
        locale: SupportedLocale,
        onSelect: (file: TFile) => void,
    ) {
        super(app);
        this.plugin = plugin;
        this.allTemplates = allTemplates;
        this.templateFolderPath = templateFolderPath;
        this.locale = locale;
        this.onSelect = onSelect;
        this.activeTab = plugin.templateStore.getLastTab();
    }

    onOpen(): void {
        // fb-picker-modal: このモーダルにのみ「固定サイズ・シンプルデザイン」を適用するためのスコープ用クラス
        this.modalEl.addClass('fb-modal-root', 'fb-picker-modal');
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.selectorTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal fb-picker' });

        this.renderSearchBox(root, L);
        this.tabBarEl = root.createDiv({ cls: 'fb-tab-bar' });
        this.listContainer = root.createDiv({ cls: 'fb-picker-list' });

        this.renderTabBar(L);
        this.renderList(L);

        const btnRow = root.createDiv({ cls: 'fb-btn-row' });
        this.renderClearRecentButton(btnRow, L);
        this.renderSortToggle(btnRow, L);
        btnRow.createEl('button', { cls: 'fb-btn', text: L.btnHelp })
            .addEventListener('click', () => new HelpModal(this.app, this.locale).open());

        this.updateActionButtons();
    }

    onClose(): void {
        this.contentEl.empty();
    }

    // ------------------------------------------------------------
    // 検索ボックス（共通フィルター。入力時のみ「×」でクリアできる）
    // ------------------------------------------------------------

    private renderSearchBox(root: HTMLElement, L: Locale): void {
        const wrap = root.createDiv({ cls: 'fb-search-wrap' });

        this.searchInputEl = wrap.createEl('input', {
            cls: 'fb-input fb-search-input',
            type: 'text',
            placeholder: L.pickerSearchPlaceholder,
        });
        this.searchInputEl.value = this.searchQuery;
        this.searchInputEl.addEventListener('input', () => {
            this.searchQuery = this.searchInputEl.value;
            this.updateSearchClearVisibility();
            this.renderList(L);
        });

        this.searchClearBtnEl = wrap.createEl('button', { cls: 'fb-search-clear', text: '×' });
        this.searchClearBtnEl.setAttribute('aria-label', 'Clear search');
        this.searchClearBtnEl.addEventListener('click', () => {
            this.searchQuery = '';
            this.searchInputEl.value = '';
            this.updateSearchClearVisibility();
            this.searchInputEl.focus();
            this.renderList(L);
        });

        this.updateSearchClearVisibility();
    }

    private updateSearchClearVisibility(): void {
        this.searchClearBtnEl.toggleClass('fb-search-clear--visible', this.searchQuery.length > 0);
    }

    // ------------------------------------------------------------
    // 昇順／降順トグル・使用履歴クリアボタン（？ヘルプボタンの左隣に常設）
    // ------------------------------------------------------------

    private renderSortToggle(container: HTMLElement, L: Locale): void {
        const btn = container.createEl('button', {
            cls: 'fb-sort-toggle',
            text: this.ascending ? L.sortAsc : L.sortDesc,
        });
        this.sortToggleEl = btn;
        btn.addEventListener('click', () => {
            if (this.activeTab === 'recent') return; // disabled 状態でも念のため二重ガード
            this.ascending = !this.ascending;
            btn.textContent = this.ascending ? L.sortAsc : L.sortDesc;
            this.renderList(L);
        });
    }

    /** 使用履歴の全削除ボタン。誤操作防止のため、1回目のタップで確認表示にし、
     *  一定時間内に再度タップした場合のみ実際に削除する。使用履歴タブ以外では非表示にする。 */
    private renderClearRecentButton(container: HTMLElement, L: Locale): void {
        const btn = container.createEl('button', { cls: 'fb-sort-toggle', text: L.pickerClearRecent });
        this.clearRecentBtnEl = btn;

        let confirming = false;
        let revertTimer: number | undefined;

        const reset = () => {
            confirming = false;
            if (revertTimer !== undefined) window.clearTimeout(revertTimer);
            btn.textContent = L.pickerClearRecent;
            btn.removeClass('fb-clear-toggle--confirm');
        };
        this.resetClearRecentConfirm = reset;

        btn.addEventListener('click', () => {
            if (!confirming) {
                confirming = true;
                btn.textContent = L.pickerClearRecentConfirm;
                btn.addClass('fb-clear-toggle--confirm');
                revertTimer = window.setTimeout(reset, 3000);
                return;
            }
            reset();
            void this.plugin.templateStore.clearRecent().then(() => this.renderList(L));
        });
    }

    /** タブ切替のたびに呼び出し、昇順・降順ボタンの有効/無効と、
     *  使用履歴クリアボタンの表示/非表示を切り替える。 */
    private updateActionButtons(): void {
        const isRecent = this.activeTab === 'recent';

        this.sortToggleEl.disabled = isRecent;
        this.sortToggleEl.toggleClass('fb-sort-toggle--disabled', isRecent);

        this.clearRecentBtnEl.toggleClass('fb-hidden', !isRecent);
        if (!isRecent) this.resetClearRecentConfirm();
    }

    // ------------------------------------------------------------
    // タブバー
    // ------------------------------------------------------------

    private renderTabBar(L: Locale): void {
        this.tabBarEl.empty();
        const tabs: { id: TabType; label: string }[] = [
            { id: 'folder', label: L.pickerTabFolder },
            { id: 'favorites', label: L.pickerTabFavorites },
            { id: 'recent', label: L.pickerTabRecent },
        ];

        for (const tab of tabs) {
            const btn = this.tabBarEl.createEl('button', {
                cls: this.activeTab === tab.id ? 'fb-tab fb-tab-active' : 'fb-tab',
                text: tab.label,
            });
            btn.addEventListener('click', () => {
                if (this.activeTab === tab.id) return;
                this.activeTab = tab.id;
                void this.plugin.templateStore.setLastTab(tab.id);
                this.renderTabBar(L);
                this.updateActionButtons();
                this.renderList(L);
            });
        }
    }

    // ------------------------------------------------------------
    // コンテンツ（タブ切替時・検索時・ソート切替時に呼び出される）
    // ------------------------------------------------------------

    private renderList(L: Locale): void {
        this.listContainer.empty();
        switch (this.activeTab) {
            case 'folder':
                this.renderFolderTab(L);
                break;
            case 'favorites':
                this.renderFavoritesTab(L);
                break;
            case 'recent':
                this.renderRecentTab(L);
                break;
        }
    }

    // ---- フォルダタブ ----

    private renderFolderTab(L: Locale): void {
        const dir = this.ascending ? 1 : -1;

        if (this.searchQuery) {
            // 検索中は階層を無視してフラット表示する
            const filtered = this.filterFiles(this.allTemplates)
                .sort((a, b) => dir * this.displayName(a.path).localeCompare(this.displayName(b.path)));
            if (filtered.length === 0) {
                this.listContainer.createDiv({ cls: 'fb-picker-empty', text: L.pickerNoResults });
                return;
            }
            const ul = this.listContainer.createEl('ul', { cls: 'fb-template-list' });
            for (const file of filtered) this.renderTemplateButton(ul, file, this.displayName(file.path));
            return;
        }

        const tree = buildTemplateTree(this.templateFolderPath, this.allTemplates, this.ascending);
        this.renderFolderNode(this.listContainer, tree, true);
    }

    private renderFolderNode(container: HTMLElement, node: TemplateFolderNode, isRoot: boolean): void {
        let body: HTMLElement;

        if (isRoot) {
            body = container;
        } else {
            const expanded = this.expandedFolders.has(node.path);
            const header = container.createDiv({ cls: 'fb-folder-header' });
            header.createSpan({ cls: 'fb-folder-icon', text: expanded ? '📂' : '📁' });
            header.createSpan({ cls: 'fb-folder-name', text: node.name });
            header.addEventListener('click', () => {
                if (expanded) this.expandedFolders.delete(node.path);
                else this.expandedFolders.add(node.path);
                this.renderList(getLocale(this.locale));
            });
            if (!expanded) return;
            body = container.createDiv({ cls: 'fb-folder-body' });
        }

        for (const child of node.children) {
            this.renderFolderNode(body, child, false);
        }

        if (node.files.length > 0) {
            const ul = body.createEl('ul', { cls: 'fb-template-list' });
            for (const path of node.files) {
                const file = this.allTemplates.find(f => f.path === path);
                if (file) this.renderTemplateButton(ul, file);
            }
        }
    }

    // ---- お気に入りタブ ----

    private renderFavoritesTab(L: Locale): void {
        const entries = this.plugin.templateStore.annotate(this.app, this.plugin.templateStore.getFavorites());
        this.renderEntryList(entries, L, L.pickerNoFavorites, true);
    }

    // ---- 使用履歴タブ（使用順のため並び替え対象外） ----

    private renderRecentTab(L: Locale): void {
        const entries = this.plugin.templateStore.annotate(this.app, this.plugin.templateStore.getRecent());
        this.renderEntryList(entries, L, L.pickerNoRecent, false);
    }

    private renderEntryList(entries: TemplateEntry[], L: Locale, emptyMessage: string, sortable: boolean): void {
        let filtered = this.filterEntries(entries);
        if (sortable) {
            const dir = this.ascending ? 1 : -1;
            filtered = [...filtered].sort((a, b) => dir * this.displayName(a.path).localeCompare(this.displayName(b.path)));
        }
        if (filtered.length === 0) {
            this.listContainer.createDiv({ cls: 'fb-picker-empty', text: emptyMessage });
            return;
        }
        const ul = this.listContainer.createEl('ul', { cls: 'fb-template-list' });
        for (const entry of filtered) this.renderEntryButton(ul, entry, L);
    }

    // ------------------------------------------------------------
    // 検索フィルター（共通）
    // ------------------------------------------------------------

    private filterFiles(files: TFile[]): TFile[] {
        if (!this.searchQuery) return files;
        const q = this.searchQuery.toLowerCase();
        return files.filter(f => f.basename.toLowerCase().includes(q));
    }

    private filterEntries(entries: TemplateEntry[]): TemplateEntry[] {
        if (!this.searchQuery) return entries;
        const q = this.searchQuery.toLowerCase();
        return entries.filter(e => this.displayName(e.path).toLowerCase().includes(q));
    }

    /** テンプレートフォルダ（templateFolderPath）を基準とした相対パスを表示名として返す（拡張子は除く）。
     *  例: templateFolder が "template" の場合
     *    template/charactor.md            → charactor
     *    template/item/item-a.md          → item/item-a
     *    template/item/case/item-b.md     → item/case/item-b
     *  お気に入り・使用履歴タブはフラット表示のため、この相対パスで区別しやすくする。 */
    private displayName(path: string): string {
        const noExt = path.endsWith('.md') ? path.slice(0, -3) : path;
        const root = this.templateFolderPath;
        if (root && noExt.startsWith(`${root}/`)) {
            return noExt.slice(root.length + 1);
        }
        // テンプレートフォルダ配下でない場合（通常は発生しない）のフォールバック
        return noExt.split('/').pop() || noExt;
    }

    // ------------------------------------------------------------
    // 1件分の項目描画
    // ------------------------------------------------------------

    /** フォルダタブ用（実体が必ず存在する TFile ベース）。
     *  label 省略時はファイル名のみ（ツリー表示時）、指定時はその文字列を表示する（検索時のフラット表示など）。 */
    private renderTemplateButton(ul: HTMLElement, file: TFile, label?: string): void {
        const li = ul.createEl('li');
        const row = li.createDiv({ cls: 'fb-template-row' });

        const btn = row.createEl('button', { cls: 'fb-template-btn' });
        btn.appendText(label ?? file.basename);
        btn.addEventListener('click', () => this.selectTemplate(file));

        const favBtn = row.createEl('button', {
            cls: 'fb-fav-toggle',
            text: this.plugin.templateStore.isFavorite(file.path) ? '★' : '☆',
        });
        favBtn.setAttribute('aria-label', 'Toggle favorite');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            void this.plugin.templateStore.toggleFavorite(file.path).then(() => {
                this.renderList(getLocale(this.locale));
            });
        });
    }

    /** お気に入り／使用履歴タブ用（見つからない場合のグレーアウト表示に対応） */
    private renderEntryButton(ul: HTMLElement, entry: TemplateEntry, L: Locale): void {
        const li = ul.createEl('li');
        const row = li.createDiv({
            cls: entry.isMissing ? 'fb-template-row fb-template-missing' : 'fb-template-row',
        });

        const btn = row.createEl('button', { cls: 'fb-template-btn' });
        btn.appendText(this.displayName(entry.path));

        if (entry.isMissing) {
            btn.createSpan({ cls: 'fb-missing-label', text: ` ${L.pickerMissingLabel}` });
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => {
                const file = this.app.vault.getFileByPath(entry.path);
                if (file instanceof TFile) this.selectTemplate(file);
            });
        }

        const favBtn = row.createEl('button', {
            cls: 'fb-fav-toggle',
            text: entry.isMissing ? '✕' : (this.plugin.templateStore.isFavorite(entry.path) ? '★' : '☆'),
        });
        favBtn.setAttribute('aria-label', entry.isMissing ? 'Remove' : 'Toggle favorite');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            void (async () => {
                if (entry.isMissing) {
                    // 見つからない項目はここで初めてデータから実削除する
                    await this.plugin.templateStore.removeFavorite(entry.path);
                    await this.plugin.templateStore.removeRecent(entry.path);
                } else {
                    await this.plugin.templateStore.toggleFavorite(entry.path);
                }
                this.renderList(L);
            })();
        });
    }

    // ------------------------------------------------------------
    // テンプレート選択 → フォーム生成へ
    // ------------------------------------------------------------

    private selectTemplate(file: TFile): void {
        this.close();
        void this.plugin.templateStore.pushRecent(file.path);
        this.onSelect(file);
    }
}
