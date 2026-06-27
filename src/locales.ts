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

    metaRows:     [string, string][];
    fieldRows:    [string, string][];
    optionRows:   [string, string][];
    variableRows: [string, string][];
    modifierRows: [string, string][];
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
    noticeFatalHeader: 'Form Builder Error:',

    // モーダル共通
    btnClose:    'Close',
    btnHelp:     '? Help',
    btnSettings: 'Open Settings',

    // テンプレート選択
    selectorTitle: 'Select Template',
    sortAsc:       '▲ A → Z',
    sortDesc:      '▼ Z → A',

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
    ],
    variableRows: [
        ['$key$',       'User variable — replaced with the form input value. Surrounded by dollar signs $...$. For multiselect / multilist, values are joined with "," (no space) by default.'],
        ['%timestamp%', 'System variable — save timestamp (e.g. 20260626153000). Surrounded by percent signs %...%.'],
        ['%date%',      'System variable — save date (e.g. 2026-06-26). Evaluated at the moment "Create Note" is pressed.'],
        ['%time%',      'System variable — save time (e.g. 15:30:00). Evaluated at the moment "Create Note" is pressed.'],
    ],
    modifierRows: [
        ['$key:separator[, ]$',   'Join values with the specified separator. Any string allowed inside [].'],
        ['$key:separator[・]$',   'Example: joined with "・"'],
        ['$key:list[- ]$',        'Output as a Markdown list. The content of [] is prepended to each line as-is.'],
        ['$key:list[  - ]$',      'Example: 2-space indented list (useful for Frontmatter aliases / tags)'],
        ['$key:list[* ]$',        'Example: unordered list with *'],
        ['$key:list[1. ]$',       'Example: numbered list (auto-numbered only when [] starts with "1.")'],
    ],
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
    noticeFatalHeader: 'Form Builder エラー:',

    // モーダル共通
    btnClose:    '閉じる',
    btnHelp:     '? ヘルプ',
    btnSettings: '設定を開く',

    // テンプレート選択
    selectorTitle: 'テンプレートを選択',
    sortAsc:       '▲ 昇順',
    sortDesc:      '▼ 降順',

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
    ],
    variableRows: [
        ['$キー名$',     'ユーザー変数。ドル記号 $...$ で囲みます。フォームの入力値に置き換わります。multiselect / multilist はデフォルトでカンマのみで結合（スペースなし）。'],
        ['%timestamp%', 'システム変数。パーセント記号 %...% で囲みます。保存時刻（例: 20260626153000）。'],
        ['%date%',      'システム変数。保存日付（例: 2026-06-26）。「ノートを作成」ボタンを押した瞬間に評価されます。'],
        ['%time%',      'システム変数。保存時刻（例: 15:30:00）。「ノートを作成」ボタンを押した瞬間に評価されます。'],
    ],
    modifierRows: [
        ['$キー名:separator[、]$',    '指定した区切り文字で結合します。[] 内の文字列をそのまま使用します。'],
        ['$キー名:separator[, ]$',   '例: カンマ＋スペースで結合'],
        ['$キー名:list[- ]$',        'Markdown リスト形式で展開します。[] 内の文字列をそのまま各行の先頭に付けます。'],
        ['$キー名:list[  - ]$',      '例: 2スペースインデント付きリスト（Frontmatter の aliases / tags に適しています）'],
        ['$キー名:list[* ]$',        '例: * 記法のリスト'],
        ['$キー名:list[1. ]$',       '例: 番号付きリスト（[] が "1." で始まる場合のみ自動採番）'],
    ],
};

// ============================================================
// エクスポート
// ============================================================

export const LOCALES: Record<SupportedLocale, Locale> = { en, ja };

export function getLocale(lang: SupportedLocale): Locale {
    return LOCALES[lang] ?? LOCALES['en'];
}
