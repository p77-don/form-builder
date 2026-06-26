import { App, normalizePath, Notice } from 'obsidian';
import type { FormField, MetaConfig } from '../model/FieldModel';
import { resolveUserVariables, resolveSystemVariables } from './VariableResolver';

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;

/**
 * ファイル名サニタイズ。通知文言はロケールから渡す。
 */
export function sanitizeFileName(name: string, sanitizedNotice: string): string {
    const sanitized = name.replace(INVALID_FILENAME_CHARS, '_');
    if (sanitized !== name) {
        new Notice(sanitizedNotice);
    }
    return sanitized;
}

async function ensureFolder(app: App, folderPath: string): Promise<void> {
    if (!folderPath) return;
    if (!app.vault.getFolderByPath(folderPath)) {
        await app.vault.createFolder(folderPath);
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
