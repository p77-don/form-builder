export type FieldType =
    | 'text' | 'textarea' | 'number' | 'date'
    | 'checkbox' | 'select' | 'multiselect' | 'multilist';

export type MarkdownListStyle = '-' | '*' | '1.';

export interface BaseField {
    type: FieldType;
    key: string;
    label?: string;
    placeholder?: string;
    description?: string;
    default?: string;
    required?: boolean;
}

export interface TextField extends BaseField {
    type: 'text';
}

export interface TextareaField extends BaseField {
    type: 'textarea';
    rows?: number;
}

export interface NumberField extends BaseField {
    type: 'number';
    min?: number;
    max?: number;
}

export interface DateField extends BaseField {
    type: 'date';
}

export interface CheckboxField extends BaseField {
    type: 'checkbox';
}

export interface SelectField extends BaseField {
    type: 'select';
    list: string[];
}

export interface MultiselectField extends BaseField {
    type: 'multiselect';
    list: string[];
    separator?: string;
    markdownlist?: MarkdownListStyle;
}

/**
 * list フィールド
 * textarea に1行1項目で自由入力し、保存時に指定形式で展開する。
 * separator 省略時のデフォルトは "\n"（改行）。
 * markdownlist 指定時は Markdown リスト形式で展開する。
 */
export interface ListField extends BaseField {
    type: 'multilist';
    rows?: number;
    separator?: string;
    markdownlist?: MarkdownListStyle;
}

export type FormField =
    | TextField | TextareaField | NumberField | DateField
    | CheckboxField | SelectField | MultiselectField | ListField;

export interface MetaConfig {
    folder?: string;
    filename?: string;
}

export interface ParseError {
    message: string;
    line?: number;
}

export interface ParseWarning {
    message: string;
    line?: number;
}

export interface ParseResult {
    meta: MetaConfig;
    fields: FormField[];
    bodyTemplate: string;
    errors: ParseError[];
    warnings: ParseWarning[];
}
