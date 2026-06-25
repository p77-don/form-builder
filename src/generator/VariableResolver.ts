import type { FormField, MarkdownListStyle, MultiselectField } from '../model/FieldModel';

// ゼロ埋め補助
function pad2(n: number): string { return String(n).padStart(2, '0'); }
function pad4(n: number): string { return String(n).padStart(4, '0'); }

function formatTimestamp(d: Date): string {
    return `${pad4(d.getFullYear())}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
           `${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
}

function formatDate(d: Date): string {
    return `${pad4(d.getFullYear())}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatTime(d: Date): string {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * markdownlist 形式で選択値を展開する
 */
function formatMarkdownList(values: string[], style: MarkdownListStyle): string {
    if (style === '1.') {
        return values.map((v, i) => `${i + 1}. ${v}`).join('\n');
    }
    return values.map(v => `${style} ${v}`).join('\n');
}

/**
 * multiselect の出力値を生成する
 */
function formatMultiselect(selected: string[], field: MultiselectField): string {
    if (field.markdownlist) {
        return formatMarkdownList(selected, field.markdownlist);
    }
    const sep = field.separator ?? ', ';
    return selected.join(sep);
}

/**
 * フィールド値を出力文字列に変換する
 */
function formatValue(
    value: string | string[] | boolean | undefined,
    field: FormField
): string {
    if (value === undefined || value === null) return '';

    if (field.type === 'multiselect') {
        const selected = Array.isArray(value) ? value : [];
        return formatMultiselect(selected, field as MultiselectField);
    }

    if (field.type === 'checkbox') {
        return value === true || value === 'true' ? 'true' : 'false';
    }

    if (Array.isArray(value)) return value.join(', ');

    return String(value);
}

/**
 * ユーザー変数（$key$）を展開する
 * 未定義のキーはそのまま出力する
 */
export function resolveUserVariables(
    template: string,
    values: Map<string, string | string[] | boolean>,
    fields: FormField[]
): string {
    let result = template;
    for (const field of fields) {
        const value = values.get(field.key);
        const expanded = formatValue(value, field);
        result = result.split(`$${field.key}$`).join(expanded);
    }
    return result;
}

/**
 * システム変数（%timestamp% 等）を展開する（保存直前に呼ぶ）
 */
export function resolveSystemVariables(template: string): string {
    const now = new Date();
    return template
        .split('%timestamp%').join(formatTimestamp(now))
        .split('%date%').join(formatDate(now))
        .split('%time%').join(formatTime(now));
}

/**
 * filename テンプレートを展開する（フォーム表示時の初期値生成用）
 * ユーザー変数は空文字で仮展開し、システム変数は現在値で展開する
 */
export function resolveFilenamePreview(
    filenameTemplate: string,
    fields: FormField[]
): string {
    let result = filenameTemplate;
    // ユーザー変数を空文字で仮展開
    for (const field of fields) {
        result = result.split(`$${field.key}$`).join('');
    }
    // システム変数を現在値で展開
    result = resolveSystemVariables(result);
    return result;
}
