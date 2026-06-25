import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig } from '../model/FieldModel';
import { resolveUserVariables, resolveSystemVariables } from './VariableResolver';

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;

/**
 * ファイル名のサニタイズ（OS 禁止文字を _ に置換）
 */
export function sanitizeFileName(name: string): string {
    const sanitized = name.replace(INVALID_FILENAME_CHARS, '_');
    if (sanitized !== name) {
        new Notice(`Form Builder: Some invalid characters in the file name were replaced with "_".`);
    }
    return sanitized;
}

/**
 * フォルダが存在しなければ作成する
 */
async function ensureFolder(app: App, folderPath: string): Promise<void> {
    if (!folderPath) return;
    const folder = app.vault.getFolderByPath(folderPath);
    if (!folder) {
        await app.vault.createFolder(folderPath);
    }
}

/**
 * ノートを生成・保存し、作成したファイルを開く
 */
export async function generateNote(
    app: App,
    bodyTemplate: string,
    values: Map<string, string | string[] | boolean>,
    fields: FormField[],
    meta: MetaConfig,
    outputFolder: string,
    fileName: string
): Promise<void> {
    // 1. ユーザー変数展開
    let content = resolveUserVariables(bodyTemplate, values, fields);

    // 2. システム変数展開（保存直前）
    content = resolveSystemVariables(content);

    // ファイル名もシステム変数を展開する
    let resolvedFileName = resolveSystemVariables(fileName);
    resolvedFileName = sanitizeFileName(resolvedFileName);
    if (!resolvedFileName.endsWith('.md')) {
        resolvedFileName += '.md';
    }

    // 3. 出力フォルダの存在確認・作成
    await ensureFolder(app, outputFolder);

    // 4. ファイルパス決定
    const filePath = outputFolder
        ? normalizePath(`${outputFolder}/${resolvedFileName}`)
        : normalizePath(resolvedFileName);

    // 5. ファイル作成（Vault API 使用）
    await app.vault.create(filePath, content);

    // 6. 作成したノートを開く
    const file = app.vault.getFileByPath(filePath);
    if (file) {
        await app.workspace.getLeaf().openFile(file);
    }
}
