import type { FormField } from '../model/FieldModel';

// ---------------------------------------------------------------------------
// 日時フォーマット
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 配列展開
// ---------------------------------------------------------------------------

/**
 * $key:separator[区切り文字]$ の展開。
 * [] 内をそのまま区切り文字として使用する。
 */
function applyModifierSeparator(values: string[], sep: string): string {
    return values.join(sep);
}

/**
 * $key:list[行頭文字列]$ の展開。
 * [] 内をそのまま各行の行頭に付けて改行で結合する。
 * [] 内が "1." で始まる場合のみ自動採番する。
 */
function applyModifierList(values: string[], prefix: string): string {
    const isNumbered = prefix.replace(/^[\s\u3000]+/, '').startsWith('1.');
    if (isNumbered) {
        // "1." より前のインデント部分を保持しつつ採番
        const indentEnd = prefix.indexOf('1.');
        const indent = prefix.slice(0, indentEnd);
        const suffix = prefix.slice(indentEnd + 2); // "1." の後ろ（スペース等）
        return values.map((v, i) => `${indent}${i + 1}.${suffix}${v}`).join('\n');
    }
    return values.map(v => `${prefix}${v}`).join('\n');
}

// ---------------------------------------------------------------------------
// モディファイア付き変数のパース
// ---------------------------------------------------------------------------

/**
 * $key$、$key:separator[...]$、$key:list[...]$ を検出する正規表現。
 * [] 内に ] が含まれないことを前提とする（仕様と同じ制約）。
 *
 * キャプチャグループ：
 *   [1] key
 *   [2] modifier name（separator / list）、なければ undefined
 *   [3] modifier value（[] 内）、なければ undefined
 */
const VARIABLE_RE = /\$([a-zA-Z0-9_-]+)(?::([a-zA-Z]+)\[([^\]]*)\])?\$/g;

// ---------------------------------------------------------------------------
// 配列かどうかの判定
// ---------------------------------------------------------------------------

function isArrayField(field: FormField): boolean {
    return field.type === 'multiselect' || field.type === 'multilist';
}

// ---------------------------------------------------------------------------
// スカラー値の展開
// ---------------------------------------------------------------------------

function formatScalarValue(
    value: string | string[] | boolean | undefined,
    field: FormField
): string {
    if (value === undefined || value === null) return '';
    if (field.type === 'checkbox') {
        return value === true || value === 'true' ? 'true' : 'false';
    }
    if (Array.isArray(value)) return value.join(',');
    return String(value);
}

// ---------------------------------------------------------------------------
// 配列値の取得
// ---------------------------------------------------------------------------

function toStringArray(value: string | string[] | boolean | undefined, field: FormField): string[] {
    if (field.type === 'multiselect') {
        return Array.isArray(value) ? value : [];
    }
    if (field.type === 'multilist') {
        const raw = typeof value === 'string' ? value : '';
        return raw.split('\n').map(l => l.trim()).filter(l => l !== '');
    }
    return [];
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

export interface ModifierWarning {
    key: string;
    modifier: string;
    message: string;
}

/**
 * ユーザー変数を展開する。
 * モディファイア付き変数（$key:separator[...]$ / $key:list[...]$）にも対応する。
 *
 * @returns 展開済みテンプレート文字列と、モディファイア適用時の警告リスト
 */
export function resolveUserVariables(
    template: string,
    values: Map<string, string | string[] | boolean>,
    fields: FormField[]
): { result: string; warnings: ModifierWarning[] } {
    const fieldMap = new Map<string, FormField>(fields.map(f => [f.key, f]));
    const warnings: ModifierWarning[] = [];

    const result = template.replace(VARIABLE_RE, (match, key, modifier, modValue) => {
        const field = fieldMap.get(key);

        // キーが未定義の場合はそのまま出力（仕様：未定義変数は置換しない）
        if (!field) return match;

        const value = values.get(key);

        // モディファイアなし
        if (!modifier) {
            if (isArrayField(field)) {
                // 配列変数のデフォルト：カンマのみで結合（スペースなし）
                return toStringArray(value, field).join(',');
            }
            return formatScalarValue(value, field);
        }

        // モディファイアあり：配列フィールド以外には警告を出してそのまま展開
        if (!isArrayField(field)) {
            warnings.push({
                key,
                modifier,
                message: `Modifier ":${modifier}" is only valid for "multilist" or "multiselect" fields. Ignored for field "${key}".`
            });
            return formatScalarValue(value, field);
        }

        const arr = toStringArray(value, field);

        if (modifier === 'separator') {
            return applyModifierSeparator(arr, modValue);
        }

        if (modifier === 'list') {
            return applyModifierList(arr, modValue);
        }

        // 未知のモディファイア
        warnings.push({
            key,
            modifier,
            message: `Unknown modifier ":${modifier}" on field "${key}". Known modifiers: "separator", "list". Ignored.`
        });
        // デフォルト展開にフォールバック
        return arr.join(',');
    });

    return { result, warnings };
}

export function resolveSystemVariables(template: string): string {
    const now = new Date();
    return template
        .split('%timestamp%').join(formatTimestamp(now))
        .split('%date%').join(formatDate(now))
        .split('%time%').join(formatTime(now));
}
