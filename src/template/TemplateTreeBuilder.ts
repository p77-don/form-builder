import type { TFile } from 'obsidian';
import type { TemplateFolderNode } from '../model/TemplateEntry';

/**
 * 既にスキャン済みのテンプレートファイル一覧（TemplateScanner の結果）から
 * フォルダ階層のツリー構造を組み立てる。
 * ファイル内容の再読み込みは行わない（同期的・軽量）。
 *
 * @param ascending true: 昇順（A→Z） / false: 降順（Z→A）。フォルダ名・ファイル名の両方に適用する。
 */
export function buildTemplateTree(rootPath: string, files: TFile[], ascending = true): TemplateFolderNode {
    const rootName = rootPath.split('/').pop() || rootPath;
    const root: TemplateFolderNode = { name: rootName, path: rootPath, children: [], files: [] };
    const nodeMap = new Map<string, TemplateFolderNode>();
    nodeMap.set(rootPath, root);

    function ensureNode(path: string): TemplateFolderNode {
        const existing = nodeMap.get(path);
        if (existing) return existing;

        const lastSlash = path.lastIndexOf('/');
        const parentPath = lastSlash === -1 ? rootPath : path.slice(0, lastSlash);
        const parent = ensureNode(parentPath);

        const name = path.split('/').pop() || path;
        const node: TemplateFolderNode = { name, path, children: [], files: [] };
        parent.children.push(node);
        nodeMap.set(path, node);
        return node;
    }

    for (const file of files) {
        const folderPath = file.parent ? file.parent.path : rootPath;
        const node = folderPath === rootPath ? root : ensureNode(folderPath);
        node.files.push(file.path);
    }

    sortNode(root, ascending);
    return root;
}

function sortNode(node: TemplateFolderNode, ascending: boolean): void {
    const dir = ascending ? 1 : -1;
    node.children.sort((a, b) => dir * a.name.localeCompare(b.name));
    node.files.sort((a, b) => dir * a.localeCompare(b));
    for (const child of node.children) sortNode(child, ascending);
}
