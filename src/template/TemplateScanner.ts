import { TFile, TFolder, Vault } from 'obsidian';
import { FORMBUILDER_BLOCK_RE } from '../parser/TemplateParser';

/**
 * テンプレートフォルダ以下を再帰的に走査し、
 * ```formbuilder ブロックを含む Markdown ファイルのみを収集する。
 * サブフォルダも対象に含める（フォルダタブでの階層表示のため）。
 */
export async function collectTemplateFiles(vault: Vault, folder: TFolder): Promise<TFile[]> {
    const result: TFile[] = [];

    for (const child of folder.children) {
        if (child instanceof TFolder) {
            const nested = await collectTemplateFiles(vault, child);
            result.push(...nested);
        } else if (child instanceof TFile && child.extension === 'md') {
            try {
                const content = await vault.read(child);
                if (FORMBUILDER_BLOCK_RE.test(content)) {
                    result.push(child);
                }
            } catch {
                // 読み込み失敗したファイルは無視
            }
        }
    }

    return result;
}
