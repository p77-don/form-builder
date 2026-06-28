import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig, ValueStore } from '../model/FieldModel';
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
    // OS禁止文字を "_" に置換
    let sanitized = name.replace(INVALID_FILENAME_CHARS, '_');

    // 制御文字（U+0000–U+001F）を除去（Windows/macOS/Linux 共通で問題になる）
    sanitized = sanitized.replace(/[\u0000-\u001F]/g, '');

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
    values: ValueStore,
    fields: FormField[],
    meta: MetaConfig,
    sanitizedNotice: string
): Promise<void> {
    // 本文の変数展開
    const { result: content0, warnings: bodyWarnings } = resolveUserVariables(bodyTemplate, values, fields);
    let content = resolveSystemVariables(content0);

    // モディファイア警告を Notice で表示
    for (const w of bodyWarnings) {
        new Notice(`Form Builder: ${w.message}`, 6000);
    }

    // ファイル名の変数展開（モディファイア警告は重複するため省略）
    const rawFilename = meta.filename ?? 'Untitled';
    const { result: filename0 } = resolveUserVariables(rawFilename, values, fields);
    let resolvedFilename = resolveSystemVariables(filename0);
    resolvedFilename = sanitizeFileName(resolvedFilename, sanitizedNotice);
    if (!resolvedFilename.endsWith('.md')) resolvedFilename += '.md';

    // フォルダの変数展開
    const rawFolder = meta.folder ?? '';
    const { result: folder0 } = resolveUserVariables(rawFolder, values, fields);
    const resolvedFolder = resolveSystemVariables(folder0);

    await ensureFolder(app, resolvedFolder);

    const filePath = resolvedFolder
        ? normalizePath(`${resolvedFolder}/${resolvedFilename}`)
        : normalizePath(resolvedFilename);

    await app.vault.create(filePath, content);

    const file = app.vault.getFileByPath(filePath);
    if (file) await app.workspace.getLeaf().openFile(file);
}
