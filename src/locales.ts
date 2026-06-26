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

    metaRows:     [string, string][];
    fieldRows:    [string, string][];
    optionRows:   [string, string][];
    variableRows: [string, string][];
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
        'Write $key$ in the body text — it will be replaced with the value entered in the form.',
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
  - "$category$"
---

\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%timestamp%]}}

{{text|title|label=[Title]|required}}
{{date|date|label=[Date]}}
{{select|category|label=[Category]|list=[Work;Personal;Study;Other]}}
{{select|priority|label=[Priority]|list=[High;Medium;Low]|default=[Medium]}}
{{textarea|summary|label=[Summary]|rows=[4]}}
{{multiselect|tags|label=[Tags]|list=[Important;Review;Draft;Done]|separator=[, ]}}
{{checkbox|published|label=[Published]}}
\`\`\`

# $title$

**Date:** $date$  **Category:** $category$  **Priority:** $priority$

## Summary
$summary$

**Tags:** $tags$`,

    subMeta:      'Meta Options',
    subFields:    'Field Types',
    subOptions:   'Common Options',
    subVariables: 'Variables',

    metaRows: [
        ['meta|folder=[FolderName]',  'Output folder for the note'],
        ['meta|filename=[FileName]',  'File name of the note (variables allowed)'],
    ],
    fieldRows: [
        ['text',        'Single-line text input'],
        ['textarea',    'Multi-line text input'],
        ['number',      'Numeric input'],
        ['date',        'Date picker'],
        ['checkbox',    'Toggle (true / false)'],
        ['select',      'Single selection dropdown'],
        ['multiselect', 'Multiple selection checkboxes'],
    ],
    optionRows: [
        ['label=[Display Name]', 'Label shown on the form'],
        ['required',             'Mark field as required'],
        ['placeholder=[...]',    'Placeholder text'],
        ['description=[...]',    'Field description shown below the label'],
        ['default=[Value]',      'Default value'],
        ['list=[A;B;C]',         'Options for select / multiselect (semicolon-separated)'],
        ['separator=[, ]',       'Separator for multiselect output'],
        ['markdownlist=[-]',     'Output multiselect as Markdown list (- / * / 1.)'],
        ['min=[0]|max=[100]',    'Min / Max value for number fields'],
        ['rows=[5]',             'Visible rows for textarea / multiselect'],
    ],
    variableRows: [
        ['$key$',       'Replaced with the form input value for that key'],
        ['%timestamp%', 'Save timestamp (e.g. 20260626153000)'],
        ['%date%',      'Save date (e.g. 2026-06-26)'],
        ['%time%',      'Save time (e.g. 15:30:00)'],
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
        '本文中に $キー名$ と書くと、フォームの入力値に置き換わります。',
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
  - "$category$"
---

\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%timestamp%]}}

{{text|title|label=[タイトル]|required}}
{{date|date|label=[日付]}}
{{select|category|label=[カテゴリ]|list=[仕事;個人;学習;その他]}}
{{select|priority|label=[優先度]|list=[高;中;低]|default=[中]}}
{{textarea|summary|label=[概要]|rows=[4]}}
{{multiselect|tags|label=[タグ]|list=[重要;レビュー;下書き;完了]|separator=[, ]}}
{{checkbox|published|label=[公開]}}
\`\`\`

# $title$

**日付:** $date$  **カテゴリ:** $category$  **優先度:** $priority$

## 概要
$summary$

**タグ:** $tags$`,

    subMeta:      'meta オプション',
    subFields:    'フィールドタイプ',
    subOptions:   '主なオプション',
    subVariables: '変数',

    metaRows: [
        ['meta|folder=[フォルダ名]',   'ノートの保存先フォルダ'],
        ['meta|filename=[ファイル名]', 'ノートのファイル名（変数使用可）'],
    ],
    fieldRows: [
        ['text',        '1行テキスト入力'],
        ['textarea',    '複数行テキスト入力'],
        ['number',      '数値入力'],
        ['date',        '日付入力'],
        ['checkbox',    'トグル（true / false）'],
        ['select',      '単一選択ドロップダウン'],
        ['multiselect', '複数選択チェックボックス'],
    ],
    optionRows: [
        ['label=[表示名]',       'フォーム上の表示ラベル'],
        ['required',             '必須入力フラグ'],
        ['placeholder=[...]',    'プレースホルダーテキスト'],
        ['description=[...]',    'ラベル下に表示するフィールド説明'],
        ['default=[既定値]',     'デフォルト値'],
        ['list=[A;B;C]',         '選択肢（セミコロン区切り）'],
        ['separator=[, ]',       'multiselect の出力区切り文字'],
        ['markdownlist=[-]',     'multiselect をリスト形式で出力（- / * / 1.）'],
        ['min=[0]|max=[100]',    'number フィールドの最小・最大値'],
        ['rows=[5]',             'textarea / multiselect の表示行数'],
    ],
    variableRows: [
        ['$キー名$',     'そのキーのフォーム入力値に置き換わる'],
        ['%timestamp%', '保存時刻（例: 20260626153000）'],
        ['%date%',      '保存日付（例: 2026-06-26）'],
        ['%time%',      '保存時刻（例: 15:30:00）'],
    ],
};

// ============================================================
// エクスポート
// ============================================================

export const LOCALES: Record<SupportedLocale, Locale> = { en, ja };

export function getLocale(lang: SupportedLocale): Locale {
    return LOCALES[lang] ?? LOCALES['en'];
}
