export type FieldType =
    | 'text' | 'textarea' | 'number' | 'date'
    | 'checkbox' | 'select' | 'multiselect';

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

export type FormField =
    | TextField | TextareaField | NumberField | DateField
    | CheckboxField | SelectField | MultiselectField;

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
