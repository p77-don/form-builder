export type FieldType =
    | 'text' | 'textarea' | 'number' | 'date'
    | 'checkbox' | 'select' | 'multiselect' | 'multilist';

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
}

/**
 * multilist フィールド
 * textarea に1行1項目で自由入力する。
 * 展開形式は本文中の変数モディファイア（$key:separator[...]$ / $key:list[...]$）で指定する。
 */
export interface ListField extends BaseField {
    type: 'multilist';
    rows?: number;
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

/**
 * フォーム入力値を保持する Map 型。
 * FormModal・FieldRenderer・NoteGenerator の間で共有される。
 */
export type ValueStore = Map<string, string | string[] | boolean>;
