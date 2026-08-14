import type { FieldType } from '../model/FieldModel';

/**
 * Field Generator（構文ジェネレーター）が扱うフィールド設定の入力状態。
 * どのプロパティが実際に使われるかは type によって決まる
 * （SyntaxValidator.KNOWN_FIELD_OPTIONS と対応させること）。
 */
export interface FieldGeneratorState {
    key: string;
    label: string;
    description: string;
    required: boolean;
    placeholder: string;
    default: string;
    checked: boolean;   // checkbox 専用（default=[true] の有無に変換される）
    rows: string;        // textarea / multiselect / multilist
    min: string;         // number
    max: string;         // number
    listRaw: string;     // select / multiselect：1行1項目のテキスト
    folder: boolean;     // text 専用（Vault フォルダ選択ボタンの表示有無）
}

export function createEmptyState(): FieldGeneratorState {
    return {
        key: '',
        label: '',
        description: '',
        required: false,
        placeholder: '',
        default: '',
        checked: false,
        rows: '',
        min: '',
        max: '',
        listRaw: '',
        folder: false,
    };
}

/**
 * 1行1項目のテキストを ';' 区切りの1行に変換する。
 * TemplateParser.parseList（';' 区切り → 配列）と対称の変換。
 */
function toSemicolonList(raw: string): string {
    return raw
        .split('\n')
        .map(s => s.trim())
        .filter(s => s !== '')
        .join(';');
}

interface OptionEntry {
    key: string;
    /** null の場合は値を持たないフラグオプション（例: required） */
    value: string | null;
}

function hasPlaceholderOption(type: FieldType): boolean {
    return type === 'text' || type === 'textarea' || type === 'number' || type === 'date' || type === 'multilist';
}

function hasRowsOption(type: FieldType): boolean {
    return type === 'textarea' || type === 'multiselect' || type === 'multilist';
}

/**
 * SyntaxValidator.KNOWN_FIELD_OPTIONS に定義された許可オプションのみを、
 * 定義順に組み立てる。未対応のオプションは生成しない。
 */
function buildOptions(type: FieldType, state: FieldGeneratorState): OptionEntry[] {
    const opts: OptionEntry[] = [];

    if (state.label.trim()) opts.push({ key: 'label', value: state.label.trim() });
    if (state.description.trim()) opts.push({ key: 'description', value: state.description.trim() });

    if (hasPlaceholderOption(type) && state.placeholder.trim()) {
        opts.push({ key: 'placeholder', value: state.placeholder.trim() });
    }

    if (type === 'checkbox') {
        // 未チェックは既定値（default 省略時と同じ false）のため、チェック時のみ出力する。
        if (state.checked) opts.push({ key: 'default', value: 'true' });
    } else if (type === 'select' || type === 'multiselect') {
        const list = toSemicolonList(state.listRaw);
        if (list) opts.push({ key: 'list', value: list });
        if (state.default.trim()) opts.push({ key: 'default', value: state.default.trim() });
    } else if (type === 'multilist') {
        // 独自構文は1行単位で解析されるため、複数行を前提とする multilist の
        // default に改行を含めることができない。中途半端な1行のみの既定値は
        // multilist 本来の用途（複数項目の自由入力）に合わないため出力しない。
        // （UI 側で type を切り替えた際に古い default 値が残っていても、ここで確実に除外する）
    } else {
        if (state.default.trim()) opts.push({ key: 'default', value: state.default.trim() });
    }

    if (hasRowsOption(type) && state.rows.trim()) {
        opts.push({ key: 'rows', value: state.rows.trim() });
    }

    if (type === 'number') {
        if (state.min.trim()) opts.push({ key: 'min', value: state.min.trim() });
        if (state.max.trim()) opts.push({ key: 'max', value: state.max.trim() });
    }

    if (type === 'text' && state.folder) opts.push({ key: 'folder', value: null });

    if (state.required) opts.push({ key: 'required', value: null });

    return opts;
}

/**
 * Form Builder 構文（{{type|key|opt=[value]|...}}）を生成する。
 * key が空文字列の場合は空文字列を返す（呼び出し側で入力必須チェックとして使える）。
 */
export function buildFieldSyntax(type: FieldType, state: FieldGeneratorState): string {
    const key = state.key.trim();
    if (!key) return '';

    const opts = buildOptions(type, state);
    const tokens = [
        type,
        key,
        ...opts.map(o => (o.value === null ? o.key : `${o.key}=[${o.value}]`)),
    ];
    return `{{${tokens.join('|')}}}`;
}

/** 展開用変数（$key$）を生成する。key が空の場合は空文字列を返す。 */
export function buildVariable(state: FieldGeneratorState): string {
    const key = state.key.trim();
    return key ? `$${key}$` : '';
}

export interface VariableExample {
    code: string;
    hint: string;
}

export interface VariableExampleHints {
    default: string;
    list: string;
    numbered: string;
    separator: string;
}

/**
 * フィールドタイプに応じて「そのフィールドで利用可能な展開方法」の一覧を生成する。
 * VariableResolver の対応状況に合わせ、list / separator モディファイアは
 * multiselect / multilist の場合のみ追加する（他タイプで使うと warning になるため）。
 * 例に含める角括弧の中身（"- " や "1. " や ", "）はモディファイアの必須構文であり、
 * 省略するとそのまま置換されず出力されてしまう点に注意。
 */
export function buildVariableExamples(
    type: FieldType,
    state: FieldGeneratorState,
    hints: VariableExampleHints
): VariableExample[] {
    const key = state.key.trim();
    if (!key) return [];

    const examples: VariableExample[] = [
        { code: `$${key}$`, hint: hints.default },
    ];

    if (type === 'multiselect' || type === 'multilist') {
        examples.push({ code: `$${key}:list[- ]$`, hint: hints.list });
        examples.push({ code: `$${key}:list[1. ]$`, hint: hints.numbered });
        examples.push({ code: `$${key}:separator[; ]$`, hint: hints.separator });
    }

    return examples;
}

/**
 * Copy Variable / Copy Both で実際にクリップボードへコピーするテキストを組み立てる。
 * multiselect / multilist は配列変数であり `$key$` 単体では使い方が伝わりにくいため、
 * buildVariableExamples の全パターンを改行区切りでまとめて返す。
 * それ以外の（スカラーな）フィールドタイプでは、従来どおり `$key$` 単体を返す。
 */
export function buildVariableClipboardText(
    type: FieldType,
    state: FieldGeneratorState,
    hints: VariableExampleHints
): string {
    return buildVariableExamples(type, state, hints)
        .map(e => e.code)
        .join('\n');
}

// =====================================================================
// meta（{{meta|folder=[...]}} / {{meta|filename=[...]}}）
// =====================================================================

export type MetaKind = 'folder' | 'filename';

/**
 * meta|folder / meta|filename の構文を生成する。
 * rawValue は「固定文字列」「変数（$key$ / %date% など）」「その組み合わせ」を
 * ユーザーが直接1つのテキストとして入力したものをそのまま使う
 * （既存の meta 構文自体が固定文字と変数の連結を許容する設計のため、
 *   値の組み立て方はテキスト入力＋変数の挿入補助のみで十分カバーできる）。
 */
export function buildMetaSyntax(kind: MetaKind, rawValue: string): string {
    const value = rawValue.trim();
    if (!value) return '';
    return `{{meta|${kind}=[${value}]}}`;
}

/**
 * 値の中に変数らしきトークン（$...$ または %...%）が含まれているかを判定する。
 * meta|filename が完全な固定文字列だけの場合、2回目以降の実行で
 * 「同名ファイルが既に存在する」ために作成に失敗する恐れがあるため、
 * その警告表示の判定に使う。
 */
export function containsVariableToken(value: string): boolean {
    return /\$[^$]+\$/.test(value) || /%[^%]+%/.test(value);
}

/**
 * 生成した構文を ```formbuilder コードブロックで囲む。
 * カーソルが既存の formbuilder ブロックの外側にあるときに、
 * 新規のブロックごと挿入・コピーしたい場合に使用する。
 */
export function wrapInFormbuilderBlock(syntax: string): string {
    if (!syntax) return '';
    return '```formbuilder\n' + syntax + '\n```';
}
