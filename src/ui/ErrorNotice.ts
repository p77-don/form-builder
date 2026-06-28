import { Notice } from 'obsidian';
import type { ParseError } from '../model/FieldModel';

/** Notice の表示時間（ミリ秒）。エラー・警告で共通使用する。 */
export const NOTICE_DURATION = 8000;

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

    new Notice(`${header}\n${messages}`, NOTICE_DURATION);
}
