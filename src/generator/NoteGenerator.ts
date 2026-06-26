import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig } from '../model/FieldModel';
import { resolveUserVariables, resolveSystemVariables } from './VariableResolver';

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;

// Windows で作成できない予約デバイス名（大文字・小文字問わず）
const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;

/**
 * ファイル名サニタイズ。通知文言はロケールから渡す。
 * - OS禁止文字を "_" に置換
 * - Windows予約名（CON, NUL, COM1 等）を "_" でプレフィックス
 * - 末尾の "." やスペースを除去（Windows で問題になる）
 */
export function sanitizeFileName(name: string, sanitizedNotice: string): string {
    let sanitized = name.replace(INVALID_FILENAME_CHARS, '_');

    // Windows予約名への対応
    if (WINDOWS_RESERVED_NAMES.test(sanitized)) {
        sanitized = '_' + sanitized;
    }

    // 末尾の "." とスペースを除去
    sanitized = sanitized.replace(/[.\s]+$/, '');

    // 空になった場合のフォールバック
    if (!sanitized) sanitized = 'Untitled';

    if (sanitized !== name) {
        new Notice(sanitizedNotice);
    }
    return sanitized;
}

/**
 * 多階層フォルダを順番に作成する。
 * app.vault.createFolder() は親フォルダを自動生成しないため、
 * パスを分割して存在しない階層を上から順に作る。
 */
async function ensureFolder(app: App, folderPath: string): Promise<void> {
    if (!folderPath) return;

    const parts = folderPath.replace(/\\/g, '/').split('/').filter(p => p !== '');
    let current = '';

    for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        if (!app.vault.getFolderByPath(current)) {
            await app.vault.createFolder(current);
        }
    }
}

export async function generateNote(
    app: App,
    bodyTemplate: string,
    values: Map<string, string | string[] | boolean>,
    fields: FormField[],
    meta: MetaConfig,
    sanitizedNotice: string
): Promise<void> {
    let content = resolveUserVariables(bodyTemplate, values, fields);
    content = resolveSystemVariables(content);

    const rawFilename = meta.filename ?? 'Untitled';
    let resolvedFilename = resolveUserVariables(rawFilename, values, fields);
    resolvedFilename = resolveSystemVariables(resolvedFilename);
    resolvedFilename = sanitizeFileName(resolvedFilename, sanitizedNotice);
    if (!resolvedFilename.endsWith('.md')) resolvedFilename += '.md';

    const rawFolder = meta.folder ?? '';
    let resolvedFolder = resolveUserVariables(rawFolder, values, fields);
    resolvedFolder = resolveSystemVariables(resolvedFolder);

    await ensureFolder(app, resolvedFolder);

    const filePath = resolvedFolder
        ? normalizePath(`${resolvedFolder}/${resolvedFilename}`)
        : normalizePath(resolvedFilename);

    await app.vault.create(filePath, content);

    const file = app.vault.getFileByPath(filePath);
    if (file) await app.workspace.getLeaf().openFile(file);
}
