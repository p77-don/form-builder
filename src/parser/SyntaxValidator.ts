import type { FormField, ParseError, ParseWarning } from '../model/FieldModel';

const KNOWN_FIELD_TYPES = new Set([
    'text', 'textarea', 'number', 'date', 'checkbox', 'select', 'multiselect', 'multilist'
]);

const KNOWN_FIELD_OPTIONS: Record<string, string[]> = {
    text:        ['required', 'label', 'placeholder', 'description', 'default'],
    textarea:    ['required', 'label', 'placeholder', 'description', 'default', 'rows'],
    number:      ['required', 'label', 'placeholder', 'description', 'default', 'min', 'max'],
    date:        ['required', 'label', 'placeholder', 'description', 'default'],
    checkbox:    ['required', 'label', 'description', 'default'],
    select:      ['required', 'label', 'description', 'default', 'list'],
    multiselect: ['required', 'label', 'description', 'default', 'list', 'rows'],
    multilist:   ['required', 'label', 'placeholder', 'description', 'default', 'rows'],
};

const VALID_KEY = /^[a-zA-Z0-9_-]+$/;

function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function suggestOption(unknown: string, known: string[]): string | null {
    let best: string | null = null;
    let bestDist = Infinity;
    for (const k of known) {
        const d = levenshtein(unknown, k);
        if (d < bestDist) { bestDist = d; best = k; }
    }
    return bestDist <= 2 ? best : null;
}

export interface ValidationResult {
    errors: ParseError[];
    warnings: ParseWarning[];
}

export function validateFieldType(type: string, line?: number): ParseError | null {
    if (!KNOWN_FIELD_TYPES.has(type)) {
        return { message: `Unknown field type: "${type}"`, line };
    }
    return null;
}

export function validateKey(key: string, line?: number): ParseError | null {
    if (!VALID_KEY.test(key)) {
        return { message: `Invalid key: "${key}". Keys must match [a-zA-Z0-9_-]`, line };
    }
    return null;
}

export function validateOptionName(
    optionName: string,
    fieldType: string,
    line?: number
): ParseWarning | null {
    const known = KNOWN_FIELD_OPTIONS[fieldType] ?? [];
    if (!known.includes(optionName)) {
        const suggestion = suggestOption(optionName, known);
        const hint = suggestion ? ` Did you mean "${suggestion}"?` : '';
        return {
            message: `Unknown option "${optionName}" in field type "${fieldType}".${hint}`,
            line
        };
    }
    return null;
}

export function validateField(field: FormField, line?: number): ValidationResult {
    const errors: ParseError[] = [];
    const warnings: ParseWarning[] = [];

    // select / multiselect の list 必須チェック
    if (field.type === 'select' || field.type === 'multiselect') {
        const f = field as { list?: string[] };
        if (!f.list || f.list.length === 0) {
            errors.push({ message: `"${field.type}" requires the "list" option`, line });
        }
    }

    // number の min > max チェック
    if (field.type === 'number') {
        const { min, max } = field;
        if (min !== undefined && max !== undefined && min > max) {
            errors.push({
                message: `"min" (${min}) must not exceed "max" (${max}) in field "${field.key}"`,
                line
            });
        }
    }

    // multiselect の default 値が list に存在するかチェック
    if (field.type === 'multiselect' && field.default && field.list) {
        for (const dv of field.default.split(';').map(s => s.trim())) {
            if (!field.list.includes(dv)) {
                warnings.push({
                    message: `Default value "${dv}" is not in the list of field "${field.key}"`,
                    line
                });
            }
        }
    }

    // select の default 値が list に存在するかチェック
    if (field.type === 'select' && field.default && field.list) {
        if (field.default !== '' && !field.list.includes(field.default)) {
            warnings.push({
                message: `Default value "${field.default}" is not in the list of field "${field.key}"`,
                line
            });
        }
    }

    return { errors, warnings };
}

const KNOWN_META_KEYS = new Set(['folder', 'filename']);

export function validateMetaKey(key: string, line?: number): ParseWarning | null {
    if (!KNOWN_META_KEYS.has(key)) {
        return { message: `Unknown meta key: "${key}"`, line };
    }
    return null;
}
