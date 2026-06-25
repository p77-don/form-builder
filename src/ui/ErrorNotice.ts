import { Notice } from 'obsidian';
import type { ParseError } from '../model/FieldModel';

/**
 * 致命的エラーを Notice で表示する
 */
export function showFatalError(errors: ParseError[]): void {
    const messages = errors.map(e => {
        const lineInfo = e.line ? ` (line ${e.line})` : '';
        return `• ${e.message}${lineInfo}`;
    }).join('\n');

    new Notice(`Form Builder Error:\n${messages}`, 8000);
}

/**
 * 汎用エラー通知
 */
export function showError(message: string): void {
    new Notice(`Form Builder: ${message}`, 6000);
}
