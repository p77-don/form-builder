import { App, FuzzySuggestModal, TFolder } from 'obsidian';

/**
 * text フィールドの folder オプション用フォルダ選択モーダル。
 *
 * 候補の範囲:
 * - 現在値（input の入力値）が実在する「ルート以外」のフォルダを指している場合、
 *   そのフォルダ自身と配下のフォルダのみを候補にする（起点スコープ）。
 * - 現在値が空、または実在しない場合は Vault 内の全フォルダを候補にする。
 * - Vault ルート（"/"）自体は常に候補から除外する
 *   （値を空のままにすればルートにノートが作成されるため、選択する意味がない）。
 */
export class FolderSuggestModal extends FuzzySuggestModal<TFolder> {
    private readonly onChoose: (folder: TFolder) => void;
    private readonly startFolder: TFolder | null;

    constructor(app: App, currentValue: string, placeholder: string, onChoose: (folder: TFolder) => void) {
        super(app);
        this.onChoose = onChoose;
        this.startFolder = this.resolveStartFolder(currentValue);
        this.setPlaceholder(placeholder);
    }

    private resolveStartFolder(currentValue: string): TFolder | null {
        const trimmed = currentValue.trim();
        if (!trimmed) return null;
        const folder = this.app.vault.getFolderByPath(trimmed);
        if (!folder || folder.isRoot()) return null;
        return folder;
    }

    getItems(): TFolder[] {
        if (this.startFolder) {
            return this.collectSubtree(this.startFolder);
        }
        // includeRoot: false → Vault ルート自体は除外される
        return this.app.vault.getAllFolders(false);
    }

    getItemText(folder: TFolder): string {
        return folder.path;
    }

    onChooseItem(folder: TFolder): void {
        this.onChoose(folder);
    }

    /** startFolder 自身と、その配下のフォルダをすべて集める。 */
    private collectSubtree(root: TFolder): TFolder[] {
        const result: TFolder[] = [root];
        for (const child of root.children) {
            if (child instanceof TFolder) {
                result.push(...this.collectSubtree(child));
            }
        }
        return result;
    }
}
