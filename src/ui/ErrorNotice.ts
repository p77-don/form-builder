import { Notice } from 'obsidian';
import type { ParseError } from '../model/FieldModel';

/**
 * 致命的エラーを Notice で表示する。
 * ヘッダー文言はロケールから渡す。
 * エラーメッセージ本文はパーサーが生成する技術的情報のため英語固定。
 */
export function showFatalError(errors: ParseError[], header: string): void {
    const messages = errors.map(e => {
        const lineInfo = e.line ? ` (line ${e.line})` : '';
        return `• ${e.message}${lineInfo}`;
    }).join('\n');

    new Notice(`${header}\n${messages}`, 8000);
}
