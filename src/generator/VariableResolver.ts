import type { FormField, ListField, MarkdownListStyle, MultiselectField } from '../model/FieldModel';

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

function formatMarkdownList(values: string[], style: MarkdownListStyle): string {
    if (style === '1.') return values.map((v, i) => `${i + 1}. ${v}`).join('\n');
    return values.map(v => `${style} ${v}`).join('\n');
}

function formatMultiselect(selected: string[], field: MultiselectField): string {
    if (field.markdownlist) return formatMarkdownList(selected, field.markdownlist);
    return selected.join(field.separator ?? ', ');
}

/**
 * list フィールドの出力フォーマット
 * 入力テキストを改行で分割し、空行を除去したうえで指定形式に変換する。
 * separator 省略時のデフォルトは "\n"（改行区切り）。
 * → Frontmatter の aliases のように各行を独立した値として扱う用途に適する。
 */
function formatList(rawText: string, field: ListField): string {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l !== '');
    if (lines.length === 0) return '';
    if (field.markdownlist) return formatMarkdownList(lines, field.markdownlist);
    return lines.join(field.separator ?? '\n');
}

function formatValue(
    value: string | string[] | boolean | undefined,
    field: FormField
): string {
    if (value === undefined || value === null) return '';

    if (field.type === 'multiselect') {
        return formatMultiselect(Array.isArray(value) ? value : [], field as MultiselectField);
    }
    if (field.type === 'multilist') {
        return formatList(typeof value === 'string' ? value : '', field as ListField);
    }
    if (field.type === 'checkbox') {
        return value === true || value === 'true' ? 'true' : 'false';
    }
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
}

export function resolveUserVariables(
    template: string,
    values: Map<string, string | string[] | boolean>,
    fields: FormField[]
): string {
    let result = template;
    for (const field of fields) {
        const expanded = formatValue(values.get(field.key), field);
        result = result.split(`$${field.key}$`).join(expanded);
    }
    return result;
}

export function resolveSystemVariables(template: string): string {
    const now = new Date();
    return template
        .split('%timestamp%').join(formatTimestamp(now))
        .split('%date%').join(formatDate(now))
        .split('%time%').join(formatTime(now));
}
