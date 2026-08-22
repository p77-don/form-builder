import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig, ValueStore } from '../model/FieldModel';
import type { Locale } from '../locales';
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

    // 制御文字（U+0000–U+001F）を除去（Windows/macOS/Linux 共通で問題になる）。
    // 正規表現の文字クラスに制御文字の範囲を書くと ESLint の
    // no-control-regex（および Obsidian の自動チェック）に警告されるため、
    // 文字コードでの判定に置き換えている。
    sanitized = Array.from(sanitized)
        .filter(ch => {
            const code = ch.codePointAt(0) ?? 0;
            return code > 0x1f;
        })
        .join('');

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

// フォルダパスのセグメントに使用できない文字（"/" は区切り文字のため対象外）
const INVALID_FOLDER_SEGMENT_CHARS = /[\\:*?"<>|]/g;

/**
 * 出力フォルダパス（meta|folder を展開した文字列）をサニタイズする。
 * これまでファイル名はサニタイズしていたが、フォルダパスは無検査で
 * createFolder() に渡していたため、"..' や OS 禁止文字を含むテンプレート／
 * フォーム入力が環境依存のわかりにくいエラーになっていた（CodeReview #3）。
 *
 * 対応スコープ（最小限）:
 * - "." / ".." セグメントの拒否（親・カレントディレクトリ参照を無害化）
 * - 連続スラッシュ・前後の空白・空セグメントの正規化
 * - ファイル名と共通の OS 禁止文字・制御文字・Windows 予約名・末尾の "." やスペースの除去
 *
 * セグメントごとに具体的な不正内容をローカライズして通知する等、フルバリデーションへの
 * 拡張は将来の検討課題とする。
 */
export function sanitizeFolderPath(folderPath: string, folderSanitizedNotice: string): string {
    if (!folderPath) return '';

    const rawSegments = folderPath.replace(/\\/g, '/').split('/');
    const segments: string[] = [];
    let changed = false;

    for (const rawSeg of rawSegments) {
        let seg = rawSeg.trim();
        if (seg !== rawSeg) changed = true;

        // 空セグメント（連続スラッシュ・先頭/末尾スラッシュ）は詰めて無視する
        if (seg === '') {
            if (rawSeg !== '') changed = true;
            continue;
        }

        // "." "..": 親・カレントディレクトリ参照は許可せず、同じ文字数の "_" に置き換える
        if (seg === '.' || seg === '..') {
            seg = '_'.repeat(seg.length);
            changed = true;
        }

        // OS禁止文字を "_" に置換（ファイル名と共通のポリシー）
        const noInvalidChars = seg.replace(INVALID_FOLDER_SEGMENT_CHARS, '_');
        if (noInvalidChars !== seg) changed = true;
        seg = noInvalidChars;

        // 制御文字を除去（sanitizeFileName と同じ方針）
        const noControl = Array.from(seg)
            .filter(ch => (ch.codePointAt(0) ?? 0) > 0x1f)
            .join('');
        if (noControl !== seg) changed = true;
        seg = noControl;

        // 末尾の "." とスペースを除去（Windows の制約。ファイル名と同様）
        const trimmedEnd = seg.replace(/[.\s]+$/, '');
        if (trimmedEnd !== seg) changed = true;
        seg = trimmedEnd;

        if (seg === '') { changed = true; continue; }

        if (WINDOWS_RESERVED_NAMES.test(seg)) {
            seg = '_' + seg;
            changed = true;
        }

        segments.push(seg);
    }

    const sanitized = segments.join('/');
    if (changed) new Notice(folderSanitizedNotice);
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
    L: Locale
): Promise<void> {
    // ファイル名の変数展開（%folder% / %filename% はまだ使えない。自己参照になるため）
    const rawFilename = meta.filename ?? 'Untitled';
    const { result: filename0 } = resolveUserVariables(rawFilename, values, fields, L);
    let resolvedFilename = resolveSystemVariables(filename0);
    resolvedFilename = sanitizeFileName(resolvedFilename, L.noticeSanitized);

    // フォルダの変数展開（同様に %folder% / %filename% はまだ使えない）
    const rawFolder = meta.folder ?? '';
    const { result: folder0 } = resolveUserVariables(rawFolder, values, fields, L);
    const expandedFolder = resolveSystemVariables(folder0);
    const resolvedFolder = sanitizeFolderPath(expandedFolder, L.noticeFolderSanitized);

    const filenameWithExt = resolvedFilename.endsWith('.md') ? resolvedFilename : `${resolvedFilename}.md`;

    await ensureFolder(app, resolvedFolder);

    // 同名ファイルが既に存在する場合は " (2)" のように連番を付与して衝突を回避する
    const { path: filePath, finalNameWithExt, renamed } = resolveUniqueFilePath(app, resolvedFolder, filenameWithExt);
    const finalNameNoExt = finalNameWithExt.endsWith('.md') ? finalNameWithExt.slice(0, -3) : finalNameWithExt;

    // 本文の変数展開。ここで初めて %folder% / %filename%（拡張子なし）を本文中に展開できる。
    // %filename% には（連番が付与された場合は）実際に保存される最終的なファイル名を使う。
    const { result: content0, warnings: bodyWarnings } = resolveUserVariables(bodyTemplate, values, fields, L);
    const content = resolveSystemVariables(content0, { folder: resolvedFolder, filename: finalNameNoExt });

    // モディファイア警告を Notice で表示（message は resolveUserVariables 側で
    // 既に設定言語に応じて組み立て済みなので、ここでの追加のプレフィックス付与は不要）
    for (const w of bodyWarnings) {
        new Notice(w.message, 6000);
    }

    if (renamed) {
        new Notice(L.noticeDuplicateFilename.replace('{name}', finalNameWithExt), NOTICE_DURATION);
    }

    await app.vault.create(filePath, content);

    const file = app.vault.getFileByPath(filePath);
    if (file) await app.workspace.getLeaf().openFile(file);
}
