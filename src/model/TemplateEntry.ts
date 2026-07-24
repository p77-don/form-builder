/**
 * テンプレート選択モーダルのタブ種別。
 */
export type TabType = 'folder' | 'favorites' | 'recent';

/**
 * お気に入り／最近使ったタブの1件分のデータ。
 * isMissing は、保存されているパスに対応するファイルが
 * 現在 Vault 上に実在しない場合に true になる
 * （リネーム・移動・削除により参照が壊れているケース）。
 */
export interface TemplateEntry {
    path: string;
    isMissing: boolean;
}

/**
 * フォルダタブ用のツリー構造。
 * files には、このフォルダ直下にある formbuilder テンプレートのパスのみを保持する。
 */
export interface TemplateFolderNode {
    name: string;
    path: string;
    children: TemplateFolderNode[];
    files: string[];
}
