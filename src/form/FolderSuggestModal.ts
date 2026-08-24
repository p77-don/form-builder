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
    private readonly initialQuery: string;

    constructor(app: App, currentValue: string, placeholder: string, onChoose: (folder: TFolder) => void) {
        super(app);
        this.onChoose = onChoose;
        this.startFolder = this.resolveStartFolder(currentValue);
        this.initialQuery = currentValue.trim();
        this.setPlaceholder(placeholder);
    }

    /**
     * default（= input の初期値）を検索欄の初期値として使う。
     * 実在するフォルダかどうかは問わない（存在しない値でも、絞り込みの
     * 起点としてそのまま検索欄に表示し、候補一覧はユーザーの入力に委ねる）。
     * FuzzySuggestModal（SuggestModal）は inputEl を用意した上で onOpen() を
     * 呼び出すため、super.onOpen() の後で値を設定し、"input" イベントを
     * 発火させて候補一覧（getSuggestions）を再計算させる必要がある。
     */
    onOpen(): void {
        super.onOpen();
        if (this.initialQuery) {
            this.inputEl.value = this.initialQuery;
            this.inputEl.dispatchEvent(new Event('input'));
            this.inputEl.select();
        }
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
