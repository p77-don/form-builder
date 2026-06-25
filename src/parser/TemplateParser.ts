import type {
    FormField, MetaConfig, ParseError, ParseWarning, ParseResult,
    MarkdownListStyle, MultiselectField
} from '../model/FieldModel';
import {
    validateFieldType, validateKey, validateOptionName,
    validateField, validateMetaKey
} from './SyntaxValidator';

// formbuilder コードブロックの正規表現
const FORMBUILDER_BLOCK_RE = /^```formbuilder\s*\n([\s\S]*?)\n```/m;

// フィールド構文: {{ ... }} 全体をマッチ
const FIELD_SYNTAX_RE = /^\{\{([\s\S]*?)\}\}$/;

// キーバリューオプション: key=[value]
const KV_OPTION_RE = /^([a-zA-Z_-]+)=\[([^\]]*)\]$/;

// 全角・半角スペースのトリム
function trimSpaces(s: string): string {
    return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}

/**
 * list オプションの値をセミコロンで分割し、セミコロン前後をトリムする
 */
function parseList(raw: string): string[] {
    return raw.split(';').map(item => trimSpaces(item));
}

/**
 * {{ ... }} 内のトークンを | で分割する。
 * ただし [...]内の | は分割しない（値内部に | がある場合への将来対応は仕様上不要だが安全に処理）
 */
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

/**
 * オプショントークンを解析する
 * キーバリュー形式: key=[value] → { key, value }
 * フラグ形式: required → { key: 'required', value: null }
 */
interface ParsedOption {
    key: string;
    value: string | null;
}

function parseOptionToken(token: string): ParsedOption | null {
    const kvMatch = KV_OPTION_RE.exec(token);
    if (kvMatch) {
        return { key: kvMatch[1], value: kvMatch[2] };
    }
    // フラグ（英字のみ）
    if (/^[a-zA-Z_-]+$/.test(token)) {
        return { key: token, value: null };
    }
    return null;
}

/**
 * meta 行を解析して MetaConfig を更新する
 */
function parseMetaLine(
    tokens: string[],
    meta: MetaConfig,
    warnings: ParseWarning[],
    lineNum: number
): void {
    // tokens[0] === 'meta'
    for (let i = 1; i < tokens.length; i++) {
        const opt = parseOptionToken(tokens[i]);
        if (!opt) continue;

        const metaWarning = validateMetaKey(opt.key, lineNum);
        if (metaWarning) {
            warnings.push(metaWarning);
            continue;
        }

        if (opt.key === 'folder' && opt.value !== null) {
            meta.folder = opt.value;
        } else if (opt.key === 'filename' && opt.value !== null) {
            meta.filename = opt.value;
        }
    }
}

/**
 * フィールド行を解析して FormField を返す
 */
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
    const key = tokens[1];

    // フィールドタイプバリデーション
    const typeError = validateFieldType(type, lineNum);
    if (typeError) {
        errors.push(typeError);
        return null;
    }

    // キーバリデーション
    const keyError = validateKey(key, lineNum);
    if (keyError) {
        errors.push(keyError);
        return null;
    }

    // オプション解析
    const optMap: Map<string, string | null> = new Map();
    const optionOrder: string[] = []; // separator / markdownlist の優先順位判定用

    for (let i = 2; i < tokens.length; i++) {
        const opt = parseOptionToken(tokens[i]);
        if (!opt) {
            warnings.push({ message: `Cannot parse option token: "${tokens[i]}"`, line: lineNum });
            continue;
        }
        // 未知オプション警告
        const optWarning = validateOptionName(opt.key, type, lineNum);
        if (optWarning) {
            warnings.push(optWarning);
            continue;
        }
        if (!optMap.has(opt.key)) {
            optMap.set(opt.key, opt.value);
            optionOrder.push(opt.key);
        }
    }

    // 共通フィールドベース構築
    const base = {
        key,
        label:       optMap.has('label')       ? (optMap.get('label') ?? undefined)       : undefined,
        placeholder: optMap.has('placeholder') ? (optMap.get('placeholder') ?? undefined) : undefined,
        description: optMap.has('description') ? (optMap.get('description') ?? undefined) : undefined,
        default:     optMap.has('default')     ? (optMap.get('default') ?? undefined)     : undefined,
        required:    optMap.has('required'),
    };

    // タイプ別フィールド構築
    switch (type) {
        case 'text':
            return { type: 'text', ...base };

        case 'textarea': {
            const rowsStr = optMap.get('rows');
            const rows = rowsStr ? parseInt(rowsStr, 10) : undefined;
            return { type: 'textarea', ...base, rows: isNaN(rows as number) ? undefined : rows };
        }

        case 'number': {
            const minStr = optMap.get('min');
            const maxStr = optMap.get('max');
            const min = minStr !== undefined && minStr !== null ? parseFloat(minStr) : undefined;
            const max = maxStr !== undefined && maxStr !== null ? parseFloat(maxStr) : undefined;
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
            if (listRaw === undefined || listRaw === null) {
                errors.push({ message: `"select" requires the "list" option in field "${key}"`, line: lineNum });
                return null;
            }
            return { type: 'select', ...base, list: parseList(listRaw) };
        }

        case 'multiselect': {
            const listRaw = optMap.get('list');
            if (listRaw === undefined || listRaw === null) {
                errors.push({ message: `"multiselect" requires the "list" option in field "${key}"`, line: lineNum });
                return null;
            }
            const list = parseList(listRaw);

            // separator と markdownlist の同時指定 → 先に出現した方を優先
            const separatorIdx = optionOrder.indexOf('separator');
            const markdownlistIdx = optionOrder.indexOf('markdownlist');
            let separator: string | undefined = undefined;
            let markdownlist: MarkdownListStyle | undefined = undefined;

            if (separatorIdx !== -1 && markdownlistIdx !== -1) {
                warnings.push({
                    message: `Both "separator" and "markdownlist" are set in field "${key}". "${optionOrder[Math.min(separatorIdx, markdownlistIdx)]}" takes priority.`,
                    line: lineNum
                });
                if (separatorIdx < markdownlistIdx) {
                    separator = optMap.get('separator') ?? undefined;
                } else {
                    const ml = optMap.get('markdownlist');
                    if (ml === '-' || ml === '*' || ml === '1.') markdownlist = ml;
                }
            } else {
                if (separatorIdx !== -1) separator = optMap.get('separator') ?? undefined;
                if (markdownlistIdx !== -1) {
                    const ml = optMap.get('markdownlist');
                    if (ml === '-' || ml === '*' || ml === '1.') markdownlist = ml;
                    else if (ml !== undefined) {
                        warnings.push({
                            message: `Invalid markdownlist value "${ml}" in field "${key}". Must be "-", "*", or "1."`,
                            line: lineNum
                        });
                    }
                }
            }

            const msField: MultiselectField = { type: 'multiselect', ...base, list };
            if (separator !== undefined) msField.separator = separator;
            if (markdownlist !== undefined) msField.markdownlist = markdownlist;

            // rows オプション
            const rowsStr = optMap.get('rows');
            if (rowsStr) {
                // MultiselectField に rows はないが仕様上 rows は multiselect にも適用可
                // FieldRenderer 側でキャストして使用する
                (msField as unknown as { rows?: number }).rows = parseInt(rowsStr, 10);
            }

            return msField;
        }

        default:
            errors.push({ message: `Unknown field type: "${type}"`, line: lineNum });
            return null;
    }
}

/**
 * テンプレート文字列全体を解析して ParseResult を返す
 */
export function parseTemplate(templateContent: string): ParseResult {
    const errors: ParseError[] = [];
    const warnings: ParseWarning[] = [];
    const meta: MetaConfig = {};
    const fields: FormField[] = [];

    // formbuilder ブロックを抽出
    const blockMatch = FORMBUILDER_BLOCK_RE.exec(templateContent);
    if (!blockMatch) {
        // ブロックが存在しない場合は空の結果を返す
        return {
            meta,
            fields,
            bodyTemplate: templateContent,
            errors,
            warnings,
        };
    }

    const blockContent = blockMatch[1];
    const bodyTemplate = templateContent.replace(blockMatch[0], '').replace(/^\n/, '');

    // ブロック内を1行ずつ解析
    const lines = blockContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNum = i + 1;

        if (line === '') continue;

        // {{ ... }} のマッチチェック
        // 閉じ括弧の対応確認
        const openCount = (line.match(/\{\{/g) ?? []).length;
        const closeCount = (line.match(/\}\}/g) ?? []).length;
        if (openCount !== closeCount) {
            errors.push({ message: `Unclosed "{{" found on line ${lineNum}`, line: lineNum });
            continue;
        }

        const syntaxMatch = FIELD_SYNTAX_RE.exec(line);
        if (!syntaxMatch) {
            // {{ }} で囲まれていない行は無視（コメント扱い）
            continue;
        }

        const inner = syntaxMatch[1];
        const tokens = splitTokens(inner);

        if (tokens.length === 0 || tokens[0] === '') continue;

        const firstToken = tokens[0];

        if (firstToken === 'meta') {
            parseMetaLine(tokens, meta, warnings, lineNum);
        } else {
            const field = parseFieldLine(tokens, errors, warnings, lineNum);
            if (field) {
                // フィールド整合性バリデーション
                const vr = validateField(field, lineNum);
                errors.push(...vr.errors);
                warnings.push(...vr.warnings);

                if (vr.errors.length === 0) {
                    fields.push(field);
                }
            }
        }
    }

    return { meta, fields, bodyTemplate, errors, warnings };
}
