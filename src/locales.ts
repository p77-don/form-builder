// ============================================================
// locales.ts — Form Builder 多言語メッセージ定義
//
// 新言語を追加する手順:
//   1. SupportedLocale に新しいキーを追加する（例: 'fr'）
//   2. LOCALES オブジェクトに同じキーで Locale を実装する
//   3. LOCALE_LABELS にラベルを追加する
// ============================================================

export type SupportedLocale = 'en' | 'ja';

// ドロップダウンに表示する言語名
export const LOCALE_LABELS: Record<SupportedLocale, string> = {
    en: 'English',
    ja: '日本語',
};

export interface Locale {
    // ----------------------------------------
    // 設定画面
    // ----------------------------------------
    settingHeading:           string;
    settingFolderName:        string;
    settingFolderDesc:        string;
    settingFolderPlaceholder: string;
    settingLanguageName:      string;
    settingLanguageDesc:      string;

    // ----------------------------------------
    // Notice（通知）
    // ----------------------------------------
    noticeReadError:     string;  // テンプレート読み込み失敗
    noticeRequired:      string;  // 必須未入力
    noticeCreateError:   string;  // ノート作成失敗
    noticeSanitized:     string;  // ファイル名文字置換
    noticeFolderSanitized: string;  // フォルダパス文字置換
    noticeInvalidNumber: string;  // number フィールドの型/範囲エラー
    noticeInitError: string;  // プラグイン初期化失敗
    noticeStoreError: string;  // お気に入り・履歴等の保存失敗
    noticeDuplicateFilename: string;  // 同名ファイル存在時の自動リネーム通知（{name} をファイル名に置換）
    noticeFatalHeader:   string;  // 致命的エラーのヘッダー

    // ----------------------------------------
    // モーダル共通
    // ----------------------------------------
    btnClose:    string;
    btnHelp:     string;
    btnSettings: string;

    // ----------------------------------------
    // テンプレート選択モーダル
    // ----------------------------------------
    selectorTitle: string;
    sortAsc:       string;
    sortDesc:      string;
    pickerSearchPlaceholder: string;
    pickerTabFolder:         string;
    pickerTabFavorites:      string;
    pickerTabRecent:         string;
    pickerNoResults:         string;
    pickerNoFavorites:       string;
    pickerNoRecent:          string;
    pickerClearRecent:        string;
    pickerClearRecentConfirm: string;
    pickerMissingLabel:      string;
    pickerAriaClearSearch:    string;  // 検索ボックスの「×」ボタン
    pickerAriaToggleFavorite: string;  // ★/☆ お気に入りトグル
    pickerAriaRemove:         string;  // 見つからない項目の「✕」削除ボタン

    // ----------------------------------------
    // テンプレート未検出モーダル
    // ----------------------------------------
    welcomeTitle:      string;
    noTemplateMessage: string;
    noTemplateSample:  string;

    // ----------------------------------------
    // フォームモーダル
    // ----------------------------------------
    formTitle:     string;
    btnCreateNote: string;

    // ----------------------------------------
    // ヘルプモーダル
    // ----------------------------------------
    helpTitle: string;

    sec1Title:      string;
    sec2Title:      string;
    sec3Title:      string;
    sec4Title:      string;

    sec1Paragraphs: string[];
    sec2Paragraphs: string[];
    sec3Paragraphs: string[];
    sec4Paragraphs: string[];

    sampleCode: string;

    subMeta:      string;
    subFields:    string;
    subOptions:   string;
    subVariables: string;
    subModifiers: string;
    multilistHint: string;
    /** folder オプション付き text フィールドの、選択ボタンの title（ツールチップ） */
    folderPickerBtnLabel: string;
    /** フォルダ選択モーダルの検索ボックス placeholder */
    folderPickerPlaceholder: string;

    metaRows:     [string, string][];
    fieldRows:    [string, string][];
    optionRows:   [string, string][];
    variableRows: [string, string][];
    modifierRows: [string, string][];

    // ----------------------------------------
    // 構文ジェネレーター（Field Generator / FieldGeneratorModal）
    // ----------------------------------------
    genModalTitle: string;

    // Generator Type（Field / Meta: Folder / Meta: Filename の切り替え）
    genTypeLabel:        string;
    genTypeField:        string;
    genTypeMetaFolder:   string;
    genTypeMetaFilename: string;

    genFieldType:  string;
    /** Field Type ドロップダウンの表示名（キーは FieldType の値と一致） */
    genFieldTypeOptions: Record<string, string>;
    /** Field Type ごとの一言説明（キーは FieldType の値と一致。初心者向けヒント表示に使用） */
    genFieldTypeHints: Record<string, string>;

    genKey:            string;
    genKeyHint:         string;
    genLabel:          string;
    genLabelHint:       string;
    genDescription:    string;
    genDescriptionHint: string;
    genPlaceholder:    string;
    genPlaceholderHint: string;
    genDefault:        string;
    genDefaultHint:     string;
    genDefaultHintSelect:      string;
    genDefaultHintMultiselect: string;
    genDefaultChecked: string;
    genDefaultCheckedHint: string;
    genRows:           string;
    genRowsHint:        string;
    genMin:            string;
    genMinHint:         string;
    genMax:            string;
    genMaxHint:         string;
    genList:           string;
    genListHint:       string;
    genRequired:       string;
    genRequiredHint:    string;
    genFolder:         string;
    genFolderHint:      string;

    genPreviewTitle:  string;
    genVariableTitle: string;
    genForbiddenBracketWarning: string;

    genVarHintDefaultScalar: string;
    genVarHintDefaultArray:  string;
    genVarHintList:      string;
    genVarHintNumbered:  string;
    genVarHintSeparator: string;

    // Meta（folder / filename）生成
    genMetaFolderLabel:   string;
    genMetaFilenameLabel: string;
    genMetaFolderHint:    string;
    genMetaFilenameHint:  string;
    genMetaInsertVariableLabel:      string;
    genMetaFolderTip:                string;
    genMetaFilenameOkTip:            string;
    genMetaFilenameNoVariableWarning: string;

    genWrapInBlockLabel: string;
    genWrapInBlockHint:  string;

    genCopySyntax:   string;
    genCopyVariable: string;
    genCopyBoth:     string;
    genInsert:       string;
    genCancel:       string;

    genCopiedNotice:        string;
    genNoActiveEditor:      string;
    genInsertOutsideBlock:  string;
    genInsertedNotice:      string;

    // ----------------------------------------------------------------
    // パーサー / バリデーターのメッセージ（テンプレート解析時のエラー・警告）
    // 以前はここのメッセージ本文がすべて英語固定だったため、
    // 設定言語が日本語でも英語のまま表示されていた。ここから下のキーは
    // すべて formatMessage() で {placeholder} 部分を埋めてから表示する。
    // ----------------------------------------------------------------
    msgUnknownFieldType:        string;  // {type}
    msgInvalidKey:              string;  // {key}
    msgFieldSyntaxTooShort:     string;
    msgCannotParseOptionToken:  string;  // {token}
    msgUnknownOption:           string;  // {option} {fieldType} {hint}
    msgUnknownOptionHint:       string;  // {suggestion}（msgUnknownOption の {hint} に差し込む）
    msgFieldRequiresList:       string;  // {type} {key}
    msgMinExceedsMax:           string;  // {min} {max} {key}
    msgDefaultNotInList:        string;  // {value} {key}
    msgUnknownMetaKey:          string;  // {key}
    msgInvalidRows:             string;  // {value} {key}
    msgInvalidNumericOption:    string;  // {option} {value} {key}
    msgDuplicateMetaKey:        string;  // {metaKey} {firstLine}
    msgFlagOptionHasValue:      string;  // {option} {value} {key}
    msgDuplicateOption:         string;  // {option} {key}
    msgRequiredNoEffectOnCheckbox: string;  // {key}
    msgUnclosedBrace:           string;  // {line}
    msgDuplicateFieldKey:       string;  // {key} {firstLine}
    msgModifierOnlyForArrayFields: string;  // {modifier} {key}
    msgUnknownModifier:         string;  // {modifier} {key}
}

/**
 * ロケール文字列中の `{placeholder}` を params の値で置き換える。
 * パーサー・バリデーターのメッセージのように、フィールドキーや入力値などの
 * 動的な値を含むメッセージを言語ごとにテンプレート化するために使う。
 * 該当する key が params になければプレースホルダーはそのまま残す。
 */
export function formatMessage(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => {
        return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
    });
}

// ============================================================
// English
// ============================================================
const en: Locale = {
    // 設定画面
    settingHeading:           'Form Builder Settings',
    settingFolderName:        'Template folder',
    settingFolderDesc:        'Folder to look for template files. Markdown files in this folder will be treated as templates.',
    settingFolderPlaceholder: 'Templates',
    settingLanguageName:      'Language',
    settingLanguageDesc:      'Language used in the settings, help screen, and all UI messages.',

    // Notice
    noticeReadError:   'Form Builder: Failed to read template file.',
    noticeRequired:    'Form Builder: Please fill in all required fields.',
    noticeCreateError: 'Form Builder: Failed to create note.',
    noticeSanitized:   'Form Builder: Some invalid characters in the file name were replaced with "_".',
    noticeFolderSanitized: 'Form Builder: Some invalid parts of the output folder path (e.g. "..", forbidden characters) were replaced with "_".',
    noticeInvalidNumber: 'Form Builder: One or more number fields are invalid. Please check the values and the min/max range.',
    noticeInitError: 'Form Builder: Failed to initialize the plugin. Please check the developer console for details.',
    noticeStoreError: 'Form Builder: Failed to save your change. Please try again.',
    noticeDuplicateFilename: 'Form Builder: A note with this name already existed, so it was saved as "{name}" instead.',
    noticeFatalHeader: 'Form Builder Error:',

    // モーダル共通
    btnClose:    'Close',
    btnHelp:     '? Help',
    btnSettings: 'Open Settings',

    // テンプレート選択
    selectorTitle: 'Select Template',
    sortAsc:       '▲ A → Z',
    sortDesc:      '▼ Z → A',
    pickerSearchPlaceholder: 'Search templates...',
    pickerTabFolder:         '📁 Folder',
    pickerTabFavorites:      '★ Favorites',
    pickerTabRecent:         '🕒 History',
    pickerNoResults:         'No matching templates.',
    pickerNoFavorites:       'No favorites yet. Tap ☆ next to a template to add one.',
    pickerNoRecent:          'No usage history yet.',
    pickerClearRecent:        'Clear History',
    pickerClearRecentConfirm: 'Tap again to confirm',
    pickerMissingLabel:      '(missing — tap ✕ to remove)',
    pickerAriaClearSearch:    'Clear search',
    pickerAriaToggleFavorite: 'Toggle favorite',
    pickerAriaRemove:         'Remove',

    // テンプレート未検出
    welcomeTitle:      'Welcome to Form Builder',
    noTemplateMessage: 'No templates found. Please create a .md file in your template folder.',
    noTemplateSample:
`\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[Title]|required}}
{{textarea|body|label=[Content]}}
\`\`\`

# $title$

$body$`,

    // フォーム
    formTitle:     'Form Builder',
    btnCreateNote: 'Create Note',

    // ヘルプ
    helpTitle: 'Form Builder — Help',

    sec1Title: '① Template Folder Setup',
    sec2Title: '② How to Write a Template',
    sec3Title: '③ How to Run',
    sec4Title: '④ Creating a Note',

    sec1Paragraphs: [
        'Open Obsidian Settings and go to Form Builder. Enter the folder name where your template files are stored in the "Template folder" field.',
        'The default is "Templates". Any .md file placed in that folder will be recognized as a template.',
    ],
    sec2Paragraphs: [
        'Add a ```formbuilder code block to your template file.',
        'Use meta to specify the output folder and file name, then define fields below it.',
        'User variables use $key$ (dollar signs). System variables use %variable% (percent signs). These are two different notations — the difference is intentional.',
        'Write $key$ in the body text to output a value as-is. For multiselect / multilist fields, you can control the output format with a modifier: $key:separator[,]$ or $key:list[- ]$.',
    ],
    sec3Paragraphs: [
        'Open the Command Palette (Ctrl / Cmd + P) and run "Create Note From Template".',
        'If multiple templates exist, a list will appear — select the one you want to use.',
    ],
    sec4Paragraphs: [
        'Selecting a template opens the input form. Fill in each field.',
        'Fields marked with * are required. If you press "Create Note" with them empty, they will be highlighted.',
        'After filling in the form, press "Create Note" to save the note to the folder specified by meta and open it automatically.',
        'The folder and file name can be fixed in meta, or use $key$ to substitute form input values.',
    ],

    sampleCode:
`---
title: "$title$"
created: "%date%"
tags:
$tags:list[  - ]$
aliases:
$aliases:list[  - ]$
---

\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%timestamp%]}}

{{text|title|label=[Title]|required}}
{{date|date|label=[Date]}}
{{select|category|label=[Category]|list=[Work;Personal;Study;Other]}}
{{select|priority|label=[Priority]|list=[High;Medium;Low]|default=[Medium]}}
{{textarea|summary|label=[Summary]|rows=[4]}}
{{multiselect|tags|label=[Tags]|list=[Important;Review;Draft;Done]}}
{{multilist|aliases|label=[Aliases]}}
{{checkbox|published|label=[Published]}}
\`\`\`

# $title$

**Date:** $date$  **Category:** $category$  **Priority:** $priority$

## Summary
$summary$

**Tags:** $tags:separator[, ]$

## Aliases
$aliases:separator[, ]$`,

    multilistHint: 'Enter one item per line. Blank lines are ignored.',
    folderPickerBtnLabel: 'Choose folder',
    folderPickerPlaceholder: 'Type to search folders...',
    subMeta:      'Meta Options',
    subFields:    'Field Types',
    subOptions:   'Common Options',
    subVariables: 'Variables',
    subModifiers: 'Variable Modifiers (multiselect / multilist only)',

    metaRows: [
        ['meta|folder=[FolderName]',          'Fixed output folder. The note is always saved here.'],
        ['meta|folder=[$export$]',             'Dynamic folder. Use a text field to let the user specify the folder at runtime. Pair with: {{text|export|label=[Output Folder]|default=[Notes]}}'],
        ['meta|filename=[FileName]',           'File name of the note. Variables ($key$, %date%, etc.) are allowed.'],
    ],
    fieldRows: [
        ['text',        'Single-line text input'],
        ['textarea',    'Multi-line text input'],
        ['number',      'Numeric input'],
        ['date',        'Date picker'],
        ['checkbox',    'Toggle (true / false)'],
        ['select',      'Single selection dropdown'],
        ['multiselect', 'Multiple selection checkboxes'],
        ['multilist',   'Free text input, one item per line'],
    ],
    optionRows: [
        ['label=[Display Name]', 'Label shown on the form'],
        ['required',             'Mark field as required'],
        ['placeholder=[...]',    'Placeholder text'],
        ['description=[...]',    'Field description shown below the label'],
        ['default=[Value]',      'Default value'],
        ['list=[A;B;C]',         'Options for select / multiselect (semicolon-separated)'],
        ['min=[0]|max=[100]',    'Min / Max value for number fields'],
        ['rows=[5]',             'Visible rows for textarea / multiselect / multilist'],
        ['folder',               'text only. Shows a folder-picker button next to the input (flag, no value)'],
    ],
    variableRows: [
        ['$key$',       'User variable — replaced with the form input value. Surrounded by dollar signs $...$. For multiselect / multilist, values are joined with "," (no space) by default.'],
        ['%timestamp%', 'System variable — save timestamp (e.g. 20260626153000). Surrounded by percent signs %...%.'],
        ['%date%',      'System variable — save date (e.g. 2026-06-26). Evaluated at the moment "Create Note" is pressed.'],
        ['%time%',      'System variable — save time (e.g. 15:30:00). Evaluated at the moment "Create Note" is pressed.'],
        ['%folder%',    'System variable — the note\'s final output folder (after meta|folder is resolved). Body text only; cannot be used inside meta|folder or meta|filename.'],
        ['%filename%',  'System variable — the note\'s final file name without the ".md" extension (after meta|filename is resolved and sanitized). Body text only; cannot be used inside meta|folder or meta|filename.'],
    ],
    modifierRows: [
        ['$key:separator[, ]$',   'Join values with the specified separator. Any string allowed inside [].'],
        ['$key:separator[・]$',   'Example: joined with "・"'],
        ['$key:list[- ]$',        'Output as a Markdown list. The content of [] is prepended to each line as-is.'],
        ['$key:list[  - ]$',      'Example: 2-space indented list (useful for Frontmatter aliases / tags)'],
        ['$key:list[* ]$',        'Example: unordered list with *'],
        ['$key:list[1. ]$',       'Example: numbered list (auto-numbered only when [] starts with "1.")'],
    ],

    // ---------- 構文ジェネレーター（Field Generator） ----------
    genModalTitle: 'Syntax Generator',

    genTypeLabel:        'Generator Type',
    genTypeField:        'Field',
    genTypeMetaFolder:   'Meta: Folder',
    genTypeMetaFilename: 'Meta: Filename',

    genFieldType:  'Field Type',
    genFieldTypeOptions: {
        text:        'Text',
        textarea:    'Textarea',
        number:      'Number',
        date:        'Date',
        checkbox:    'Checkbox',
        select:      'Select',
        multiselect: 'Multiselect',
        multilist:   'Multilist',
    },
    genFieldTypeHints: {
        text:        'Single-line text input.',
        textarea:    'Multi-line text input.',
        number:      'Numeric input.',
        date:        'Date picker.',
        checkbox:    'A single on/off toggle.',
        select:      'Dropdown — user picks exactly one option.',
        multiselect: 'Checkboxes — user can pick multiple options.',
        multilist:   'Free text, one item per line (no fixed option list).',
    },

    genKey:             'Key',
    genKeyHint:         'The internal name used in the syntax and as the $key$ variable. Letters, numbers, "_" and "-" only. Not shown to the user filling in the form.',
    genLabel:           'Label',
    genLabelHint:       'The text shown above this field on the form. Leave blank to fall back to the key.',
    genDescription:     'Description',
    genDescriptionHint: 'Short explanatory text shown below the label on the form. Optional.',
    genPlaceholder:     'Placeholder',
    genPlaceholderHint: 'Faint example text shown inside the empty input box. Optional.',
    genDefault:         'Default',
    genDefaultHint:     'Value pre-filled when the form opens. Leave blank for no default.',
    genDefaultHintSelect:      'The option pre-selected when the form opens. Leave blank to select nothing initially.',
    genDefaultHintMultiselect: 'Options pre-selected when the form opens. For multiple options, separate with ";" (e.g. "a;b"). Leave blank to select nothing initially.',
    genDefaultChecked:  'Checked by default',
    genDefaultCheckedHint: 'Whether this checkbox starts turned on when the form opens.',
    genRows:            'Rows',
    genRowsHint:        'How many lines tall the input box is. Leave blank for the default size.',
    genMin:             'Min',
    genMinHint:         'Smallest number the user is allowed to enter. Optional.',
    genMax:             'Max',
    genMaxHint:         'Largest number the user is allowed to enter. Optional.',
    genList:            'Options',
    genListHint:        'Enter one option per line.',
    genRequired:        'Required',
    genRequiredHint:    'If on, the form cannot be submitted while this field is empty.',
    genFolder:          'Folder',
    genFolderHint:      'If on, a folder-picker button is shown next to the input. The value is still plain text, so the user can freely edit it (e.g. to type a new subfolder) after choosing.',

    genPreviewTitle:  'Preview',
    genVariableTitle: 'Generated Variable',
    genForbiddenBracketWarning:
        'Values cannot contain "]" — the generated syntax could not be read back correctly by the template parser. Please remove it.',

    genVarHintDefaultScalar: 'Replaced with the value as entered.',
    genVarHintDefaultArray:  'Joins all values with "," (no space).',
    genVarHintList:      'Markdown list, each line prefixed with "- ".',
    genVarHintNumbered:  'Numbered list (1. 2. 3. ...).',
    genVarHintSeparator: 'Joins all values with "; ".',

    genMetaFolderLabel:   'Folder',
    genMetaFilenameLabel: 'File name',
    genMetaFolderHint:
        'Where the note is saved. Type a fixed name (e.g. "Notes"), a variable (e.g. "$export$" or "%date%"), or mix both (e.g. "out_%date%").',
    genMetaFilenameHint:
        'The file name (without ".md"). Same rules as Folder — fixed text, a variable, or a mix (e.g. "$title$-%timestamp%").',
    genMetaInsertVariableLabel: 'Insert variable:',
    genMetaFolderTip:
        'Tip: combining fixed text with a variable (e.g. "out_%date%") keeps notes organized while still being predictable.',
    genMetaFilenameOkTip:
        'Good — this file name includes a variable, which helps avoid collisions with existing files.',
    genMetaFilenameNoVariableWarning:
        'This file name is entirely fixed text. If a note with the same name already exists in the folder, creating a new note will fail. Consider adding %date%, %timestamp%, or a form variable like $title$.',

    genWrapInBlockLabel: 'Insert formbuilder code block',
    genWrapInBlockHint:  'Wraps the generated syntax in a new ```formbuilder code block. Your cursor is not currently inside one.',

    genCopySyntax:   'Copy Syntax',
    genCopyVariable: 'Copy Variable',
    genCopyBoth:     'Copy Both',
    genInsert:       'Insert',
    genCancel:       'Cancel',

    genCopiedNotice:       'Form Builder: Copied to clipboard.',
    genNoActiveEditor:     'Form Builder: No active editor found.',
    genInsertOutsideBlock: 'Place the cursor inside a formbuilder code block.',
    genInsertedNotice:     'Form Builder: Field inserted.',

    // パーサー / バリデーターのメッセージ
    msgUnknownFieldType:       'Unknown field type: "{type}"',
    msgInvalidKey:             'Invalid key: "{key}". Keys must match [a-zA-Z0-9_-]',
    msgFieldSyntaxTooShort:    'Field syntax requires at least type and key',
    msgCannotParseOptionToken: 'Cannot parse option token: "{token}"',
    msgUnknownOption:          'Unknown option "{option}" in field type "{fieldType}".{hint}',
    msgUnknownOptionHint:      ' Did you mean "{suggestion}"?',
    msgFieldRequiresList:      '"{type}" requires the "list" option in field "{key}"',
    msgMinExceedsMax:          '"min" ({min}) must not exceed "max" ({max}) in field "{key}"',
    msgDefaultNotInList:       'Default value "{value}" is not in the list of field "{key}"',
    msgUnknownMetaKey:         'Unknown meta key: "{key}"',
    msgInvalidRows:
        'Invalid "rows" value "{value}" in field "{key}"; expected a positive integer (e.g. "5"). Ignoring.',
    msgInvalidNumericOption:
        'Invalid "{option}" value "{value}" in field "{key}"; expected a number (e.g. "0", "3.5", "-1"). Ignoring.',
    msgDuplicateMetaKey:
        '"meta|{metaKey}" is defined more than once (first defined on line {firstLine}). Only one "meta|{metaKey}" is allowed per template.',
    msgFlagOptionHasValue:
        'Option "{option}" does not take a value; "{option}=[{value}]" in field "{key}" is treated as just "{option}" (the assigned value is ignored)',
    msgDuplicateOption:
        'Option "{option}" is specified more than once in field "{key}"; only the first occurrence is used',
    msgRequiredNoEffectOnCheckbox:
        '"required" has no effect on "checkbox" fields (a checkbox field always submits true/false) in field "{key}"',
    msgUnclosedBrace:     'Unclosed "{{" found on line {line}',
    msgDuplicateFieldKey:
        'Key "{key}" is defined more than once (first defined on line {firstLine}). Each field key must be unique within a template.',
    msgModifierOnlyForArrayFields:
        'Form Builder: Modifier ":{modifier}" is only valid for "multilist" or "multiselect" fields. Ignored for field "{key}".',
    msgUnknownModifier:
        'Form Builder: Unknown modifier ":{modifier}" on field "{key}". Known modifiers: "separator", "list". Ignored.',
};

// ============================================================
// 日本語
// ============================================================
const ja: Locale = {
    // 設定画面
    settingHeading:           'Form Builder 設定',
    settingFolderName:        'テンプレートフォルダ',
    settingFolderDesc:        'テンプレートファイルを置くフォルダを指定します。このフォルダ内の Markdown ファイルがテンプレートとして認識されます。',
    settingFolderPlaceholder: 'Templates',
    settingLanguageName:      '言語',
    settingLanguageDesc:      '設定画面・ヘルプ・すべての UI メッセージに使用する言語です。',

    // Notice
    noticeReadError:   'Form Builder: テンプレートファイルの読み込みに失敗しました。',
    noticeRequired:    'Form Builder: 必須フィールドをすべて入力してください。',
    noticeCreateError: 'Form Builder: ノートの作成に失敗しました。',
    noticeSanitized:   'Form Builder: ファイル名に使用できない文字が含まれていたため "_" に置き換えました。',
    noticeFolderSanitized: 'Form Builder: 出力フォルダのパスに使用できない部分（".." や禁止文字など）が含まれていたため "_" に置き換えました。',
    noticeInvalidNumber: 'Form Builder: 数値の入力に誤りがあります。入力内容と最小値・最大値の範囲を確認してください。',
    noticeInitError: 'Form Builder: プラグインの初期化に失敗しました。開発者コンソールをご確認ください。',
    noticeStoreError: 'Form Builder: 変更の保存に失敗しました。もう一度お試しください。',
    noticeDuplicateFilename: 'Form Builder: 同名のノートが既に存在したため、"{name}" として保存しました。',
    noticeFatalHeader: 'Form Builder エラー:',

    // モーダル共通
    btnClose:    '閉じる',
    btnHelp:     '? ヘルプ',
    btnSettings: '設定を開く',

    // テンプレート選択
    selectorTitle: 'テンプレートを選択',
    sortAsc:       '▲ 昇順',
    sortDesc:      '▼ 降順',
    pickerSearchPlaceholder: 'テンプレートを検索...',
    pickerTabFolder:         '📁 フォルダ',
    pickerTabFavorites:      '★ お気に入り',
    pickerTabRecent:         '🕒 使用履歴',
    pickerNoResults:         '一致するテンプレートがありません。',
    pickerNoFavorites:       'お気に入りはまだありません。テンプレート横の ☆ をタップすると登録できます。',
    pickerNoRecent:          '使用履歴はまだありません。',
    pickerClearRecent:        '使用履歴をクリア',
    pickerClearRecentConfirm: 'もう一度タップで削除',
    pickerMissingLabel:      '（見つかりません — ✕ で削除できます）',
    pickerAriaClearSearch:    '検索文字列をクリア',
    pickerAriaToggleFavorite: 'お気に入りを切り替え',
    pickerAriaRemove:         '削除',

    // テンプレート未検出
    welcomeTitle:      'Form Builder へようこそ',
    noTemplateMessage: 'テンプレートが見つかりませんでした。テンプレートフォルダに .md ファイルを作成してください。',
    noTemplateSample:
`\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[タイトル]|required}}
{{textarea|body|label=[内容]}}
\`\`\`

# $title$

$body$`,

    // フォーム
    formTitle:     'Form Builder',
    btnCreateNote: 'ノートを作成',

    // ヘルプ
    helpTitle: 'Form Builder — ヘルプ',

    sec1Title: '① テンプレートフォルダの設定',
    sec2Title: '② テンプレートの書き方',
    sec3Title: '③ 実行方法',
    sec4Title: '④ ノートの作成',

    sec1Paragraphs: [
        'Obsidian の設定画面を開き、Form Builder の「テンプレートフォルダ」にテンプレートファイルを置くフォルダ名を入力します。',
        'デフォルトは「Templates」です。指定したフォルダに .md ファイルを置くとテンプレートとして認識されます。',
    ],
    sec2Paragraphs: [
        'テンプレートファイルに ```formbuilder コードブロックを記述します。',
        'meta でフォルダ・ファイル名を指定し、その下にフィールドを定義します。',
        'ユーザー変数はドル記号で囲む $キー名$、システム変数はパーセント記号で囲む %変数名% です。囲み方が異なります。',
        '本文に $キー名$ と書くとフォームの入力値がそのまま展開されます。multiselect / multilist フィールドは、モディファイアで展開形式を指定できます: $キー名:separator[,]$ や $キー名:list[- ]$。',
    ],
    sec3Paragraphs: [
        'コマンドパレット（Ctrl / Cmd + P）を開き、「Create Note From Template」を実行します。',
        'テンプレートが複数ある場合は一覧が表示されるので、使用するテンプレートを選んでください。',
    ],
    sec4Paragraphs: [
        'テンプレートを選ぶとフォームが表示されます。各フィールドに入力してください。',
        '* マークの付いたフィールドは必須です。未入力のまま「ノートを作成」を押すとハイライトされます。',
        '入力完了後「ノートを作成」を押すと、meta で指定したフォルダにノートが生成され、自動的に開きます。',
        'フォルダ・ファイル名は meta で固定するか、$キー名$ でフォーム入力値を使うことができます。',
    ],

    sampleCode:
`---
title: "$title$"
created: "%date%"
tags:
$tags:list[  - ]$
aliases:
$aliases:list[  - ]$
---

\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%timestamp%]}}

{{text|title|label=[タイトル]|required}}
{{date|date|label=[日付]}}
{{select|category|label=[カテゴリ]|list=[仕事;個人;学習;その他]}}
{{select|priority|label=[優先度]|list=[高;中;低]|default=[中]}}
{{textarea|summary|label=[概要]|rows=[4]}}
{{multiselect|tags|label=[タグ]|list=[重要;レビュー;下書き;完了]}}
{{multilist|aliases|label=[エイリアス]}}
{{checkbox|published|label=[公開]}}
\`\`\`

# $title$

**日付:** $date$  **カテゴリ:** $category$  **優先度:** $priority$

## 概要
$summary$

**タグ:** $tags:separator[、]$

## エイリアス
$aliases:separator[、]$`,

    multilistHint: '1行につき1項目を入力してください。空行は無視されます。',
    folderPickerBtnLabel: 'フォルダを選択',
    folderPickerPlaceholder: 'フォルダを検索...',
    subMeta:      'meta オプション',
    subFields:    'フィールドタイプ',
    subOptions:   '主なオプション',
    subVariables: '変数',
    subModifiers: '変数モディファイア（multiselect / multilist 専用）',

    metaRows: [
        ['meta|folder=[フォルダ名]',            '固定の保存先フォルダ。常にここに保存されます。'],
        ['meta|folder=[$export$]',              '動的フォルダ。フォームで保存先を入力させる場合はこのように記述します。対になるフィールド例: {{text|export|label=[出力先フォルダ]|default=[Notes]}}'],
        ['meta|filename=[ファイル名]',           'ノートのファイル名。変数（$キー名$・%date% 等）使用可。'],
    ],
    fieldRows: [
        ['text',        '1行テキスト入力'],
        ['textarea',    '複数行テキスト入力'],
        ['number',      '数値入力'],
        ['date',        '日付入力'],
        ['checkbox',    'トグル（true / false）'],
        ['select',      '単一選択ドロップダウン'],
        ['multiselect', '複数選択チェックボックス'],
        ['multilist',   '自由テキスト入力（1行1項目）'],
    ],
    optionRows: [
        ['label=[表示名]',       'フォーム上の表示ラベル'],
        ['required',             '必須入力フラグ'],
        ['placeholder=[...]',    'プレースホルダーテキスト'],
        ['description=[...]',    'ラベル下に表示するフィールド説明'],
        ['default=[既定値]',     'デフォルト値'],
        ['list=[A;B;C]',         '選択肢（セミコロン区切り）'],
        ['min=[0]|max=[100]',    'number フィールドの最小・最大値'],
        ['rows=[5]',             'textarea / multiselect / multilist の表示行数'],
        ['folder',               'text 専用。入力欄の横にフォルダ選択ボタンを表示する（フラグ、値なし）'],
    ],
    variableRows: [
        ['$キー名$',     'ユーザー変数。ドル記号 $...$ で囲みます。フォームの入力値に置き換わります。multiselect / multilist はデフォルトでカンマのみで結合（スペースなし）。'],
        ['%timestamp%', 'システム変数。パーセント記号 %...% で囲みます。保存時刻（例: 20260626153000）。'],
        ['%date%',      'システム変数。保存日付（例: 2026-06-26）。「ノートを作成」ボタンを押した瞬間に評価されます。'],
        ['%time%',      'システム変数。保存時刻（例: 15:30:00）。「ノートを作成」ボタンを押した瞬間に評価されます。'],
        ['%folder%',    'システム変数。このノートの最終的な出力フォルダ（meta|folder 展開後の値）。本文でのみ使用可能で、meta|folder・meta|filename の中では使用できません。'],
        ['%filename%',  'システム変数。このノートの最終的なファイル名（拡張子 .md を除く。meta|filename 展開・サニタイズ後の値）。本文でのみ使用可能で、meta|folder・meta|filename の中では使用できません。'],
    ],
    modifierRows: [
        ['$キー名:separator[、]$',    '指定した区切り文字で結合します。[] 内の文字列をそのまま使用します。'],
        ['$キー名:separator[, ]$',   '例: カンマ＋スペースで結合'],
        ['$キー名:list[- ]$',        'Markdown リスト形式で展開します。[] 内の文字列をそのまま各行の先頭に付けます。'],
        ['$キー名:list[  - ]$',      '例: 2スペースインデント付きリスト（Frontmatter の aliases / tags に適しています）'],
        ['$キー名:list[* ]$',        '例: * 記法のリスト'],
        ['$キー名:list[1. ]$',       '例: 番号付きリスト（[] が "1." で始まる場合のみ自動採番）'],
    ],

    // ---------- 構文ジェネレーター（Field Generator） ----------
    genModalTitle: '構文ジェネレーター',

    genTypeLabel:        '生成タイプ',
    genTypeField:        'フィールド',
    genTypeMetaFolder:   'Meta: フォルダ',
    genTypeMetaFilename: 'Meta: ファイル名',

    genFieldType:  'フィールドタイプ',
    genFieldTypeOptions: {
        text:        'テキスト',
        textarea:    'テキストエリア',
        number:      '数値',
        date:        '日付',
        checkbox:    'チェックボックス',
        select:      '単一選択',
        multiselect: '複数選択',
        multilist:   '自由記述リスト',
    },
    genFieldTypeHints: {
        text:        '1行の短いテキストを入力する項目です。',
        textarea:    '複数行のテキストを入力する項目です。',
        number:      '数値のみを入力する項目です。',
        date:        '日付を選択する項目です。',
        checkbox:    'ON/OFFを1つだけ切り替える項目です。',
        select:      'プルダウンから1つだけ選ぶ項目です。',
        multiselect: 'チェックボックスから複数選べる項目です。',
        multilist:   '決まった選択肢を持たず、自由に複数行入力できる項目です。',
    },

    genKey:             'キー',
    genKeyHint:         '構文および $キー$ 変数として使われる内部名です。半角英数字・"_"・"-" のみ使用できます。フォーム上には表示されません。',
    genLabel:           'ラベル',
    genLabelHint:       'フォーム上でこの項目の見出しとして表示される文字列です。空欄の場合はキーがそのまま表示されます。',
    genDescription:     '説明',
    genDescriptionHint: 'ラベルの下に表示される補足説明です。省略できます。',
    genPlaceholder:     'プレースホルダー',
    genPlaceholderHint: '未入力時に薄いグレーで表示される入力例です。省略できます。',
    genDefault:         'デフォルト値',
    genDefaultHint:     'フォームを開いたときに最初から入力されている値です。空欄なら何も入力されません。',
    genDefaultHintSelect:      'フォームを開いたときに最初から選択されている値です。空欄なら何も選択されていません。',
    genDefaultHintMultiselect: 'フォームを開いたときに最初から選択されている項目です。複数指定する場合は ";" で区切ってください（例: "a;b"）。空欄ならどれも選択されません。',
    genDefaultChecked:  '初期状態でONにする',
    genDefaultCheckedHint: 'フォームを開いたときに、このチェックボックスを最初からONにするかどうかです。',
    genRows:            '行数',
    genRowsHint:        '入力欄の高さ（行数）です。空欄の場合は標準の高さになります。',
    genMin:             '最小値',
    genMinHint:         '入力できる最小の数値です。省略できます。',
    genMax:             '最大値',
    genMaxHint:         '入力できる最大の数値です。省略できます。',
    genList:            '選択肢',
    genListHint:        '1行につき1項目を入力してください。',
    genRequired:        '必須項目にする',
    genRequiredHint:    'ONにすると、この項目が未入力のままではノートを作成できなくなります。',
    genFolder:          'フォルダ選択ボタンを表示する',
    genFolderHint:      'ONにすると、入力欄の横に Vault 内のフォルダを選択するボタンが表示されます。値はあくまで通常の文字列のため、選択後も自由に編集できます（例: 選択後に新しいサブフォルダ名を追記するなど）。',

    genPreviewTitle:  'プレビュー',
    genVariableTitle: '展開用変数',
    genForbiddenBracketWarning:
        '値に "]" を含めることはできません（生成した構文がテンプレート側で正しく読み込めなくなります）。取り除いてください。',

    genVarHintDefaultScalar: '入力された値がそのまま置き換わります。',
    genVarHintDefaultArray:  'すべての値を "," （区切り文字なし）で連結します。',
    genVarHintList:      'Markdown リスト形式（各行の先頭に "- " を付けて展開）。',
    genVarHintNumbered:  '番号付きリスト（1. 2. 3. …）として展開。',
    genVarHintSeparator: 'すべての値を "; " で連結します。',

    genMetaFolderLabel:   'フォルダ',
    genMetaFilenameLabel: 'ファイル名',
    genMetaFolderHint:
        'ノートの保存先です。固定名（例: "Notes"）、変数（例: "$export$" や "%date%"）、またはその組み合わせ（例: "out_%date%"）を入力できます。',
    genMetaFilenameHint:
        'ファイル名（".md" は不要）です。フォルダと同様に、固定文字・変数・その組み合わせ（例: "$title$-%timestamp%"）を入力できます。',
    genMetaInsertVariableLabel: '変数を挿入:',
    genMetaFolderTip:
        'ヒント: 固定文字と変数を組み合わせる（例: "out_%date%"）と、整理しやすく予測もしやすいフォルダ構成になります。',
    genMetaFilenameOkTip:
        '変数が含まれているため、既存ファイルとの重複が起きにくくなっています。',
    genMetaFilenameNoVariableWarning:
        'このファイル名は完全に固定文字だけになっています。同じフォルダに同名のファイルが既に存在する場合、ノートの作成に失敗します。%date% や %timestamp%、または $title$ のようなフォーム変数を追加することをおすすめします。',

    genWrapInBlockLabel: 'formbuilder コードブロックを挿入する',
    genWrapInBlockHint:  '生成される構文を新しい ```formbuilder コードブロックで囲みます。現在カーソルはブロックの外にあります。',

    genCopySyntax:   '構文をコピー',
    genCopyVariable: '変数をコピー',
    genCopyBoth:     '両方コピー',
    genInsert:       '挿入',
    genCancel:       'キャンセル',

    genCopiedNotice:       'Form Builder: クリップボードにコピーしました。',
    genNoActiveEditor:     'Form Builder: アクティブなエディタが見つかりません。',
    genInsertOutsideBlock: 'formbuilder コードブロックの中にカーソルを置いてください。',
    genInsertedNotice:     'Form Builder: フィールドを挿入しました。',

    // パーサー / バリデーターのメッセージ
    msgUnknownFieldType:       '不明なフィールドタイプです: "{type}"',
    msgInvalidKey:             '不正なキーです: "{key}"。キーには半角英数字・アンダースコア・ハイフンのみ使用できます。',
    msgFieldSyntaxTooShort:    'フィールド構文にはタイプとキーの両方が必要です',
    msgCannotParseOptionToken: 'オプションを解釈できませんでした: "{token}"',
    msgUnknownOption:          '不明なオプションです: フィールドタイプ "{fieldType}" に "{option}" というオプションはありません。{hint}',
    msgUnknownOptionHint:      ' もしかして "{suggestion}" ではありませんか？',
    msgFieldRequiresList:      '"{type}" には "list" オプションが必須です（フィールド "{key}"）',
    msgMinExceedsMax:          '"min"（{min}）は "max"（{max}）を超えることはできません（フィールド "{key}"）',
    msgDefaultNotInList:       '既定値 "{value}" はフィールド "{key}" の list に存在しません',
    msgUnknownMetaKey:         '不明な meta キーです: "{key}"',
    msgInvalidRows:
        '"rows" の値 "{value}" が不正です（フィールド "{key}"）。1以上の整数を指定してください（例: "5"）。この指定は無視されます。',
    msgInvalidNumericOption:
        '"{option}" の値 "{value}" が不正です（フィールド "{key}"）。数値を指定してください（例: "0"、"3.5"、"-1"）。この指定は無視されます。',
    msgDuplicateMetaKey:
        '"meta|{metaKey}" が複数回定義されています（最初の定義は {firstLine} 行目）。1つのテンプレートにつき "meta|{metaKey}" は1つまでです。',
    msgFlagOptionHasValue:
        'オプション "{option}" は値を持ちません。フィールド "{key}" の "{option}=[{value}]" は "{option}" のみが指定されたものとして扱われます（代入された値は無視されます）',
    msgDuplicateOption:
        'オプション "{option}" がフィールド "{key}" に複数回指定されています。最初の指定のみが使用されます',
    msgRequiredNoEffectOnCheckbox:
        '"required" は "checkbox" フィールドには効果がありません（checkbox は常に true/false を送信します）。フィールド "{key}"',
    msgUnclosedBrace:     '{line} 行目で "{{" が閉じられていません',
    msgDuplicateFieldKey:
        'キー "{key}" が複数回定義されています（最初の定義は {firstLine} 行目）。フィールドキーはテンプレート内で一意である必要があります。',
    msgModifierOnlyForArrayFields:
        'Form Builder: モディファイア ":{modifier}" は "multilist" または "multiselect" フィールドでのみ有効です。フィールド "{key}" では無視されます。',
    msgUnknownModifier:
        'Form Builder: 不明なモディファイアです: フィールド "{key}" の ":{modifier}"。使用できるモディファイアは "separator" と "list" です。この指定は無視されます。',
};

// ============================================================
// エクスポート
// ============================================================

export const LOCALES: Record<SupportedLocale, Locale> = { en, ja };

export function getLocale(lang: SupportedLocale): Locale {
    return LOCALES[lang] ?? LOCALES['en'];
}
