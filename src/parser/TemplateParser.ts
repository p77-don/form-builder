import type {
    FormField, MetaConfig, ParseError, ParseWarning, ParseResult,
    MultiselectField, ListField
} from '../model/FieldModel';
import {
    validateFieldType, validateKey, validateOptionName,
    validateField, validateMetaKey
} from './SyntaxValidator';

/**
 * formbuilder コードブロックを検出する正規表現。
 * main.ts の存在確認と TemplateParser の解析で共通使用する。
 */
export const FORMBUILDER_BLOCK_RE = /^```formbuilder\s*\r?\n([\s\S]*?)\r?\n```/m;
const FIELD_SYNTAX_RE = /^\{\{([\s\S]*?)\}\}$/;
const KV_OPTION_RE = /^([a-zA-Z_-]+)=\[([^\]]*)\]$/;

function trimSpaces(s: string): string {
    return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}

function parseList(raw: string): string[] {
    return raw.split(';').map(item => trimSpaces(item)).filter(item => item !== '');
}

/**
 * rows オプション値をパースして正の整数に変換する。
 * 非数値・NaN・1未満の値はすべて undefined として扱い、レンダラー側のデフォルト値に委ねる。
 */
function parseRows(rawStr: string | null | undefined): number | undefined {
    if (!rawStr) return undefined;
    const n = parseInt(rawStr, 10);
    return (!isNaN(n) && n >= 1) ? n : undefined;
}

function splitTokens(inner: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '[') { depth++; current += ch; }
        else if (ch === ']') { depth--; current += ch; }
        else if (ch === '|' && depth === 0) {
            tokens.push(trimSpaces(current));
            current = '';
        } else {
            current += ch;
        }
    }
    tokens.push(trimSpaces(current));
    return tokens;
}

interface ParsedOption {
    key: string;
    value: string | null;
}

function parseOptionToken(token: string): ParsedOption | null {
    const kvMatch = KV_OPTION_RE.exec(token);
    if (kvMatch) return { key: kvMatch[1], value: kvMatch[2] };
    if (/^[a-zA-Z_-]+$/.test(token)) return { key: token, value: null };
    return null;
}

function parseMetaLine(
    tokens: string[],
    meta: MetaConfig,
    warnings: ParseWarning[],
    lineNum: number
): void {
    for (let i = 1; i < tokens.length; i++) {
        const opt = parseOptionToken(tokens[i]);
        if (!opt) continue;
        const metaWarning = validateMetaKey(opt.key, lineNum);
        if (metaWarning) { warnings.push(metaWarning); continue; }
        if (opt.key === 'folder' && opt.value !== null) meta.folder = opt.value;
        else if (opt.key === 'filename' && opt.value !== null) meta.filename = opt.value;
    }
}

function parseFieldLine(
    tokens: string[],
    errors: ParseError[],
    warnings: ParseWarning[],
    lineNum: number
): FormField | null {
    if (tokens.length < 2) {
        errors.push({ message: 'Field syntax requires at least type and key', line: lineNum });
        return null;
    }

    const type = tokens[0];
    const key  = tokens[1];

    const typeError = validateFieldType(type, lineNum);
    if (typeError) { errors.push(typeError); return null; }

    const keyError = validateKey(key, lineNum);
    if (keyError) { errors.push(keyError); return null; }

    const optMap: Map<string, string | null> = new Map();

    for (let i = 2; i < tokens.length; i++) {
        const opt = parseOptionToken(tokens[i]);
        if (!opt) {
            warnings.push({ message: `Cannot parse option token: "${tokens[i]}"`, line: lineNum });
            continue;
        }
        const optWarning = validateOptionName(opt.key, type, lineNum);
        if (optWarning) { warnings.push(optWarning); continue; }
        if (!optMap.has(opt.key)) {
            optMap.set(opt.key, opt.value);
        }
    }

    const base = {
        key,
        label:       optMap.has('label')       ? (optMap.get('label')       ?? undefined) : undefined,
        placeholder: optMap.has('placeholder') ? (optMap.get('placeholder') ?? undefined) : undefined,
        description: optMap.has('description') ? (optMap.get('description') ?? undefined) : undefined,
        default:     optMap.has('default')     ? (optMap.get('default')     ?? undefined) : undefined,
        required:    optMap.has('required'),
    };

    switch (type) {
        case 'text':
            return { type: 'text', ...base };

        case 'textarea': {
            const rows = parseRows(optMap.get('rows'));
            return { type: 'textarea', ...base, ...(rows !== undefined && { rows }) };
        }

        case 'number': {
            const minStr = optMap.get('min');
            const maxStr = optMap.get('max');
            const min = minStr != null ? parseFloat(minStr) : undefined;
            const max = maxStr != null ? parseFloat(maxStr) : undefined;
            return {
                type: 'number', ...base,
                min: min !== undefined && !isNaN(min) ? min : undefined,
                max: max !== undefined && !isNaN(max) ? max : undefined,
            };
        }

        case 'date':
            return { type: 'date', ...base };

        case 'checkbox':
            return { type: 'checkbox', ...base };

        case 'select': {
            const listRaw = optMap.get('list');
            if (listRaw == null) {
                errors.push({ message: `"select" requires the "list" option in field "${key}"`, line: lineNum });
                return null;
            }
            return { type: 'select', ...base, list: parseList(listRaw) };
        }

        case 'multiselect': {
            const listRaw = optMap.get('list');
            if (listRaw == null) {
                errors.push({ message: `"multiselect" requires the "list" option in field "${key}"`, line: lineNum });
                return null;
            }
            const list = parseList(listRaw);
            const rows = parseRows(optMap.get('rows'));
            const msField: MultiselectField = { type: 'multiselect', ...base, list };
            if (rows !== undefined) (msField as unknown as { rows?: number }).rows = rows;
            return msField;
        }

        case 'multilist': {
            const rows = parseRows(optMap.get('rows'));
            const lf: ListField = { type: 'multilist', ...base };
            if (rows !== undefined) lf.rows = rows;
            return lf;
        }

        default:
            errors.push({ message: `Unknown field type: "${type}"`, line: lineNum });
            return null;
    }
}

export function parseTemplate(templateContent: string): ParseResult {
    const errors:   ParseError[]   = [];
    const warnings: ParseWarning[] = [];
    const meta:     MetaConfig     = {};
    const fields:   FormField[]    = [];

    const blockMatch = FORMBUILDER_BLOCK_RE.exec(templateContent);
    if (!blockMatch) {
        return { meta, fields, bodyTemplate: templateContent, errors, warnings };
    }

    const blockContent = blockMatch[1];
    const bodyTemplate = templateContent.replace(blockMatch[0], '').replace(/^\n/, '');
    const lines = blockContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line    = lines[i].trim();
        const lineNum = i + 1;
        if (line === '') continue;

        const openCount  = (line.match(/\{\{/g) ?? []).length;
        const closeCount = (line.match(/\}\}/g) ?? []).length;
        if (openCount !== closeCount) {
            errors.push({ message: `Unclosed "{{" found on line ${lineNum}`, line: lineNum });
            continue;
        }

        const syntaxMatch = FIELD_SYNTAX_RE.exec(line);
        if (!syntaxMatch) continue;

        const tokens     = splitTokens(syntaxMatch[1]);
        if (tokens.length === 0 || tokens[0] === '') continue;

        if (tokens[0] === 'meta') {
            parseMetaLine(tokens, meta, warnings, lineNum);
        } else {
            const field = parseFieldLine(tokens, errors, warnings, lineNum);
            if (field) {
                const vr = validateField(field, lineNum);
                errors.push(...vr.errors);
                warnings.push(...vr.warnings);
                if (vr.errors.length === 0) fields.push(field);
            }
        }
    }

    return { meta, fields, bodyTemplate, errors, warnings };
}
