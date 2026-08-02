import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig, ValueStore } from '../model/FieldModel';
import { resolveUserVariables, resolveSystemVariables } from './VariableResolver';
import { NOTICE_DURATION } from '../ui/ErrorNotice';

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
    sanitized = sanitized.replace(/[\u0000-\u001F]/gu, '');

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

/**
 * 指定フォルダ内で衝突しないファイルパスを求める。
 * 同名ファイル（同名フォルダも含む）が既に存在する場合は
 * "note.md" → "note (2).md" → "note (3).md" ... の形式で自動的に連番を付与する。
 * 戻り値の path は必ず衝突しない状態になっている。
 */
function resolveUniqueFilePath(
    app: App,
    folder: string,
    filenameWithExt: string
): { path: string; finalNameWithExt: string; renamed: boolean } {
    const EXT = '.md';
    const base = filenameWithExt.endsWith(EXT)
        ? filenameWithExt.slice(0, -EXT.length)
        : filenameWithExt;

    let candidateName = filenameWithExt;
    let counter = 2;
    let renamed = false;

    // 無限ループ防止のための安全上限（実運用でここまで衝突することは想定していない）
    for (let i = 0; i < 1000; i++) {
        const path = folder
            ? normalizePath(`${folder}/${candidateName}`)
            : normalizePath(candidateName);

        if (!app.vault.getAbstractFileByPath(path)) {
            return { path, finalNameWithExt: candidateName, renamed };
        }

        candidateName = `${base} (${counter})${EXT}`;
        counter++;
        renamed = true;
    }

    // 安全上限に達した場合は最後の候補をそのまま返す（呼び出し元で create が失敗し得る）
    const fallbackPath = folder
        ? normalizePath(`${folder}/${candidateName}`)
        : normalizePath(candidateName);
    return { path: fallbackPath, finalNameWithExt: candidateName, renamed };
}

export async function generateNote(
    app: App,
    bodyTemplate: string,
    values: ValueStore,
    fields: FormField[],
    meta: MetaConfig,
    sanitizedNotice: string,
    duplicateRenamedNotice: string
): Promise<void> {
    // ファイル名の変数展開（%folder% / %filename% はまだ使えない。自己参照になるため）
    const rawFilename = meta.filename ?? 'Untitled';
    const { result: filename0 } = resolveUserVariables(rawFilename, values, fields);
    let resolvedFilename = resolveSystemVariables(filename0);
    resolvedFilename = sanitizeFileName(resolvedFilename, sanitizedNotice);

    // フォルダの変数展開（同様に %folder% / %filename% はまだ使えない）
    const rawFolder = meta.folder ?? '';
    const { result: folder0 } = resolveUserVariables(rawFolder, values, fields);
    const resolvedFolder = resolveSystemVariables(folder0);

    const filenameWithExt = resolvedFilename.endsWith('.md') ? resolvedFilename : `${resolvedFilename}.md`;

    await ensureFolder(app, resolvedFolder);

    // 同名ファイルが既に存在する場合は " (2)" のように連番を付与して衝突を回避する
    const { path: filePath, finalNameWithExt, renamed } = resolveUniqueFilePath(app, resolvedFolder, filenameWithExt);
    const finalNameNoExt = finalNameWithExt.endsWith('.md') ? finalNameWithExt.slice(0, -3) : finalNameWithExt;

    // 本文の変数展開。ここで初めて %folder% / %filename%（拡張子なし）を本文中に展開できる。
    // %filename% には（連番が付与された場合は）実際に保存される最終的なファイル名を使う。
    const { result: content0, warnings: bodyWarnings } = resolveUserVariables(bodyTemplate, values, fields);
    const content = resolveSystemVariables(content0, { folder: resolvedFolder, filename: finalNameNoExt });

    // モディファイア警告を Notice で表示
    for (const w of bodyWarnings) {
        new Notice(`Form Builder: ${w.message}`, 6000);
    }

    if (renamed) {
        new Notice(duplicateRenamedNotice.replace('{name}', finalNameWithExt), NOTICE_DURATION);
    }

    await app.vault.create(filePath, content);

    const file = app.vault.getFileByPath(filePath);
    if (file) await app.workspace.getLeaf().openFile(file);
}
