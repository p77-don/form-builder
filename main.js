var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FormBuilderPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");

// src/locales.ts
var LOCALE_LABELS = {
  en: "English",
  ja: "\u65E5\u672C\u8A9E"
};
var en = {
  // 設定画面
  settingHeading: "Form Builder Settings",
  settingFolderName: "Template folder",
  settingFolderDesc: "Folder to look for template files. Markdown files in this folder will be treated as templates.",
  settingFolderPlaceholder: "Templates",
  settingLanguageName: "Language",
  settingLanguageDesc: "Language used in the settings, help screen, and all UI messages.",
  // Notice
  noticeReadError: "Form Builder: Failed to read template file.",
  noticeRequired: "Form Builder: Please fill in all required fields.",
  noticeCreateError: "Form Builder: Failed to create note.",
  noticeSanitized: 'Form Builder: Some invalid characters in the file name were replaced with "_".',
  noticeFatalHeader: "Form Builder Error:",
  // モーダル共通
  btnClose: "Close",
  btnHelp: "? Help",
  btnSettings: "Open Settings",
  // テンプレート選択
  selectorTitle: "Select Template",
  sortAsc: "\u25B2 A \u2192 Z",
  sortDesc: "\u25BC Z \u2192 A",
  // テンプレート未検出
  welcomeTitle: "Welcome to Form Builder",
  noTemplateMessage: "No templates found. Please create a .md file in your template folder.",
  noTemplateSample: `\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[Title]|required}}
{{textarea|body|label=[Content]}}
\`\`\`

# $title$

$body$`,
  // フォーム
  formTitle: "Form Builder",
  btnCreateNote: "Create Note",
  // ヘルプ
  helpTitle: "Form Builder \u2014 Help",
  sec1Title: "\u2460 Template Folder Setup",
  sec2Title: "\u2461 How to Write a Template",
  sec3Title: "\u2462 How to Run",
  sec4Title: "\u2463 Creating a Note",
  sec1Paragraphs: [
    'Open Obsidian Settings and go to Form Builder. Enter the folder name where your template files are stored in the "Template folder" field.',
    'The default is "Templates". Any .md file placed in that folder will be recognized as a template.'
  ],
  sec2Paragraphs: [
    "Add a ```formbuilder code block to your template file.",
    "Use meta to specify the output folder and file name, then define fields below it.",
    "User variables use $key$ (dollar signs). System variables use %variable% (percent signs). These are two different notations \u2014 the difference is intentional.",
    "Write $key$ in the body text to output a value as-is. For multiselect / multilist fields, you can control the output format with a modifier: $key:separator[,]$ or $key:list[- ]$."
  ],
  sec3Paragraphs: [
    'Open the Command Palette (Ctrl / Cmd + P) and run "Create Note From Template".',
    "If multiple templates exist, a list will appear \u2014 select the one you want to use."
  ],
  sec4Paragraphs: [
    "Selecting a template opens the input form. Fill in each field.",
    'Fields marked with * are required. If you press "Create Note" with them empty, they will be highlighted.',
    'After filling in the form, press "Create Note" to save the note to the folder specified by meta and open it automatically.',
    "The folder and file name can be fixed in meta, or use $key$ to substitute form input values."
  ],
  sampleCode: `---
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
  multilistHint: "Enter one item per line. Blank lines are ignored.",
  subMeta: "Meta Options",
  subFields: "Field Types",
  subOptions: "Common Options",
  subVariables: "Variables",
  subModifiers: "Variable Modifiers (multiselect / multilist only)",
  metaRows: [
    ["meta|folder=[FolderName]", "Fixed output folder. The note is always saved here."],
    ["meta|folder=[$export$]", "Dynamic folder. Use a text field to let the user specify the folder at runtime. Pair with: {{text|export|label=[Output Folder]|default=[Notes]}}"],
    ["meta|filename=[FileName]", "File name of the note. Variables ($key$, %date%, etc.) are allowed."]
  ],
  fieldRows: [
    ["text", "Single-line text input"],
    ["textarea", "Multi-line text input"],
    ["number", "Numeric input"],
    ["date", "Date picker"],
    ["checkbox", "Toggle (true / false)"],
    ["select", "Single selection dropdown"],
    ["multiselect", "Multiple selection checkboxes"],
    ["multilist", "Free text input, one item per line"]
  ],
  optionRows: [
    ["label=[Display Name]", "Label shown on the form"],
    ["required", "Mark field as required"],
    ["placeholder=[...]", "Placeholder text"],
    ["description=[...]", "Field description shown below the label"],
    ["default=[Value]", "Default value"],
    ["list=[A;B;C]", "Options for select / multiselect (semicolon-separated)"],
    ["min=[0]|max=[100]", "Min / Max value for number fields"],
    ["rows=[5]", "Visible rows for textarea / multiselect / multilist"]
  ],
  variableRows: [
    ["$key$", 'User variable \u2014 replaced with the form input value. Surrounded by dollar signs $...$. For multiselect / multilist, values are joined with "," (no space) by default.'],
    ["%timestamp%", "System variable \u2014 save timestamp (e.g. 20260626153000). Surrounded by percent signs %...%."],
    ["%date%", 'System variable \u2014 save date (e.g. 2026-06-26). Evaluated at the moment "Create Note" is pressed.'],
    ["%time%", 'System variable \u2014 save time (e.g. 15:30:00). Evaluated at the moment "Create Note" is pressed.']
  ],
  modifierRows: [
    ["$key:separator[, ]$", "Join values with the specified separator. Any string allowed inside []."],
    ["$key:separator[\u30FB]$", 'Example: joined with "\u30FB"'],
    ["$key:list[- ]$", "Output as a Markdown list. The content of [] is prepended to each line as-is."],
    ["$key:list[  - ]$", "Example: 2-space indented list (useful for Frontmatter aliases / tags)"],
    ["$key:list[* ]$", "Example: unordered list with *"],
    ["$key:list[1. ]$", 'Example: numbered list (auto-numbered only when [] starts with "1.")']
  ]
};
var ja = {
  // 設定画面
  settingHeading: "Form Builder \u8A2D\u5B9A",
  settingFolderName: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A9\u30EB\u30C0",
  settingFolderDesc: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u3092\u7F6E\u304F\u30D5\u30A9\u30EB\u30C0\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002\u3053\u306E\u30D5\u30A9\u30EB\u30C0\u5185\u306E Markdown \u30D5\u30A1\u30A4\u30EB\u304C\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3068\u3057\u3066\u8A8D\u8B58\u3055\u308C\u307E\u3059\u3002",
  settingFolderPlaceholder: "Templates",
  settingLanguageName: "\u8A00\u8A9E",
  settingLanguageDesc: "\u8A2D\u5B9A\u753B\u9762\u30FB\u30D8\u30EB\u30D7\u30FB\u3059\u3079\u3066\u306E UI \u30E1\u30C3\u30BB\u30FC\u30B8\u306B\u4F7F\u7528\u3059\u308B\u8A00\u8A9E\u3067\u3059\u3002",
  // Notice
  noticeReadError: "Form Builder: \u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
  noticeRequired: "Form Builder: \u5FC5\u9808\u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u3059\u3079\u3066\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  noticeCreateError: "Form Builder: \u30CE\u30FC\u30C8\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
  noticeSanitized: 'Form Builder: \u30D5\u30A1\u30A4\u30EB\u540D\u306B\u4F7F\u7528\u3067\u304D\u306A\u3044\u6587\u5B57\u304C\u542B\u307E\u308C\u3066\u3044\u305F\u305F\u3081 "_" \u306B\u7F6E\u304D\u63DB\u3048\u307E\u3057\u305F\u3002',
  noticeFatalHeader: "Form Builder \u30A8\u30E9\u30FC:",
  // モーダル共通
  btnClose: "\u9589\u3058\u308B",
  btnHelp: "? \u30D8\u30EB\u30D7",
  btnSettings: "\u8A2D\u5B9A\u3092\u958B\u304F",
  // テンプレート選択
  selectorTitle: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9078\u629E",
  sortAsc: "\u25B2 \u6607\u9806",
  sortDesc: "\u25BC \u964D\u9806",
  // テンプレート未検出
  welcomeTitle: "Form Builder \u3078\u3088\u3046\u3053\u305D",
  noTemplateMessage: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A9\u30EB\u30C0\u306B .md \u30D5\u30A1\u30A4\u30EB\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  noTemplateSample: `\`\`\`formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[\u30BF\u30A4\u30C8\u30EB]|required}}
{{textarea|body|label=[\u5185\u5BB9]}}
\`\`\`

# $title$

$body$`,
  // フォーム
  formTitle: "Form Builder",
  btnCreateNote: "\u30CE\u30FC\u30C8\u3092\u4F5C\u6210",
  // ヘルプ
  helpTitle: "Form Builder \u2014 \u30D8\u30EB\u30D7",
  sec1Title: "\u2460 \u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A9\u30EB\u30C0\u306E\u8A2D\u5B9A",
  sec2Title: "\u2461 \u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u306E\u66F8\u304D\u65B9",
  sec3Title: "\u2462 \u5B9F\u884C\u65B9\u6CD5",
  sec4Title: "\u2463 \u30CE\u30FC\u30C8\u306E\u4F5C\u6210",
  sec1Paragraphs: [
    "Obsidian \u306E\u8A2D\u5B9A\u753B\u9762\u3092\u958B\u304D\u3001Form Builder \u306E\u300C\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A9\u30EB\u30C0\u300D\u306B\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u3092\u7F6E\u304F\u30D5\u30A9\u30EB\u30C0\u540D\u3092\u5165\u529B\u3057\u307E\u3059\u3002",
    "\u30C7\u30D5\u30A9\u30EB\u30C8\u306F\u300CTemplates\u300D\u3067\u3059\u3002\u6307\u5B9A\u3057\u305F\u30D5\u30A9\u30EB\u30C0\u306B .md \u30D5\u30A1\u30A4\u30EB\u3092\u7F6E\u304F\u3068\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3068\u3057\u3066\u8A8D\u8B58\u3055\u308C\u307E\u3059\u3002"
  ],
  sec2Paragraphs: [
    "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u306B ```formbuilder \u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u3092\u8A18\u8FF0\u3057\u307E\u3059\u3002",
    "meta \u3067\u30D5\u30A9\u30EB\u30C0\u30FB\u30D5\u30A1\u30A4\u30EB\u540D\u3092\u6307\u5B9A\u3057\u3001\u305D\u306E\u4E0B\u306B\u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u5B9A\u7FA9\u3057\u307E\u3059\u3002",
    "\u30E6\u30FC\u30B6\u30FC\u5909\u6570\u306F\u30C9\u30EB\u8A18\u53F7\u3067\u56F2\u3080 $\u30AD\u30FC\u540D$\u3001\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u306F\u30D1\u30FC\u30BB\u30F3\u30C8\u8A18\u53F7\u3067\u56F2\u3080 %\u5909\u6570\u540D% \u3067\u3059\u3002\u56F2\u307F\u65B9\u304C\u7570\u306A\u308A\u307E\u3059\u3002",
    "\u672C\u6587\u306B $\u30AD\u30FC\u540D$ \u3068\u66F8\u304F\u3068\u30D5\u30A9\u30FC\u30E0\u306E\u5165\u529B\u5024\u304C\u305D\u306E\u307E\u307E\u5C55\u958B\u3055\u308C\u307E\u3059\u3002multiselect / multilist \u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u3001\u30E2\u30C7\u30A3\u30D5\u30A1\u30A4\u30A2\u3067\u5C55\u958B\u5F62\u5F0F\u3092\u6307\u5B9A\u3067\u304D\u307E\u3059: $\u30AD\u30FC\u540D:separator[,]$ \u3084 $\u30AD\u30FC\u540D:list[- ]$\u3002"
  ],
  sec3Paragraphs: [
    "\u30B3\u30DE\u30F3\u30C9\u30D1\u30EC\u30C3\u30C8\uFF08Ctrl / Cmd + P\uFF09\u3092\u958B\u304D\u3001\u300CCreate Note From Template\u300D\u3092\u5B9F\u884C\u3057\u307E\u3059\u3002",
    "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304C\u8907\u6570\u3042\u308B\u5834\u5408\u306F\u4E00\u89A7\u304C\u8868\u793A\u3055\u308C\u308B\u306E\u3067\u3001\u4F7F\u7528\u3059\u308B\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002"
  ],
  sec4Paragraphs: [
    "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9078\u3076\u3068\u30D5\u30A9\u30FC\u30E0\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u5404\u30D5\u30A3\u30FC\u30EB\u30C9\u306B\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    "* \u30DE\u30FC\u30AF\u306E\u4ED8\u3044\u305F\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u5FC5\u9808\u3067\u3059\u3002\u672A\u5165\u529B\u306E\u307E\u307E\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u3092\u62BC\u3059\u3068\u30CF\u30A4\u30E9\u30A4\u30C8\u3055\u308C\u307E\u3059\u3002",
    "\u5165\u529B\u5B8C\u4E86\u5F8C\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u3092\u62BC\u3059\u3068\u3001meta \u3067\u6307\u5B9A\u3057\u305F\u30D5\u30A9\u30EB\u30C0\u306B\u30CE\u30FC\u30C8\u304C\u751F\u6210\u3055\u308C\u3001\u81EA\u52D5\u7684\u306B\u958B\u304D\u307E\u3059\u3002",
    "\u30D5\u30A9\u30EB\u30C0\u30FB\u30D5\u30A1\u30A4\u30EB\u540D\u306F meta \u3067\u56FA\u5B9A\u3059\u308B\u304B\u3001$\u30AD\u30FC\u540D$ \u3067\u30D5\u30A9\u30FC\u30E0\u5165\u529B\u5024\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
  ],
  sampleCode: `---
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

{{text|title|label=[\u30BF\u30A4\u30C8\u30EB]|required}}
{{date|date|label=[\u65E5\u4ED8]}}
{{select|category|label=[\u30AB\u30C6\u30B4\u30EA]|list=[\u4ED5\u4E8B;\u500B\u4EBA;\u5B66\u7FD2;\u305D\u306E\u4ED6]}}
{{select|priority|label=[\u512A\u5148\u5EA6]|list=[\u9AD8;\u4E2D;\u4F4E]|default=[\u4E2D]}}
{{textarea|summary|label=[\u6982\u8981]|rows=[4]}}
{{multiselect|tags|label=[\u30BF\u30B0]|list=[\u91CD\u8981;\u30EC\u30D3\u30E5\u30FC;\u4E0B\u66F8\u304D;\u5B8C\u4E86]}}
{{multilist|aliases|label=[\u30A8\u30A4\u30EA\u30A2\u30B9]}}
{{checkbox|published|label=[\u516C\u958B]}}
\`\`\`

# $title$

**\u65E5\u4ED8:** $date$  **\u30AB\u30C6\u30B4\u30EA:** $category$  **\u512A\u5148\u5EA6:** $priority$

## \u6982\u8981
$summary$

**\u30BF\u30B0:** $tags:separator[\u3001]$

## \u30A8\u30A4\u30EA\u30A2\u30B9
$aliases:separator[\u3001]$`,
  multilistHint: "1\u884C\u306B\u3064\u304D1\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u7A7A\u884C\u306F\u7121\u8996\u3055\u308C\u307E\u3059\u3002",
  subMeta: "meta \u30AA\u30D7\u30B7\u30E7\u30F3",
  subFields: "\u30D5\u30A3\u30FC\u30EB\u30C9\u30BF\u30A4\u30D7",
  subOptions: "\u4E3B\u306A\u30AA\u30D7\u30B7\u30E7\u30F3",
  subVariables: "\u5909\u6570",
  subModifiers: "\u5909\u6570\u30E2\u30C7\u30A3\u30D5\u30A1\u30A4\u30A2\uFF08multiselect / multilist \u5C02\u7528\uFF09",
  metaRows: [
    ["meta|folder=[\u30D5\u30A9\u30EB\u30C0\u540D]", "\u56FA\u5B9A\u306E\u4FDD\u5B58\u5148\u30D5\u30A9\u30EB\u30C0\u3002\u5E38\u306B\u3053\u3053\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002"],
    ["meta|folder=[$export$]", "\u52D5\u7684\u30D5\u30A9\u30EB\u30C0\u3002\u30D5\u30A9\u30FC\u30E0\u3067\u4FDD\u5B58\u5148\u3092\u5165\u529B\u3055\u305B\u308B\u5834\u5408\u306F\u3053\u306E\u3088\u3046\u306B\u8A18\u8FF0\u3057\u307E\u3059\u3002\u5BFE\u306B\u306A\u308B\u30D5\u30A3\u30FC\u30EB\u30C9\u4F8B: {{text|export|label=[\u51FA\u529B\u5148\u30D5\u30A9\u30EB\u30C0]|default=[Notes]}}"],
    ["meta|filename=[\u30D5\u30A1\u30A4\u30EB\u540D]", "\u30CE\u30FC\u30C8\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u3002\u5909\u6570\uFF08$\u30AD\u30FC\u540D$\u30FB%date% \u7B49\uFF09\u4F7F\u7528\u53EF\u3002"]
  ],
  fieldRows: [
    ["text", "1\u884C\u30C6\u30AD\u30B9\u30C8\u5165\u529B"],
    ["textarea", "\u8907\u6570\u884C\u30C6\u30AD\u30B9\u30C8\u5165\u529B"],
    ["number", "\u6570\u5024\u5165\u529B"],
    ["date", "\u65E5\u4ED8\u5165\u529B"],
    ["checkbox", "\u30C8\u30B0\u30EB\uFF08true / false\uFF09"],
    ["select", "\u5358\u4E00\u9078\u629E\u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3"],
    ["multiselect", "\u8907\u6570\u9078\u629E\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9"],
    ["multilist", "\u81EA\u7531\u30C6\u30AD\u30B9\u30C8\u5165\u529B\uFF081\u884C1\u9805\u76EE\uFF09"]
  ],
  optionRows: [
    ["label=[\u8868\u793A\u540D]", "\u30D5\u30A9\u30FC\u30E0\u4E0A\u306E\u8868\u793A\u30E9\u30D9\u30EB"],
    ["required", "\u5FC5\u9808\u5165\u529B\u30D5\u30E9\u30B0"],
    ["placeholder=[...]", "\u30D7\u30EC\u30FC\u30B9\u30DB\u30EB\u30C0\u30FC\u30C6\u30AD\u30B9\u30C8"],
    ["description=[...]", "\u30E9\u30D9\u30EB\u4E0B\u306B\u8868\u793A\u3059\u308B\u30D5\u30A3\u30FC\u30EB\u30C9\u8AAC\u660E"],
    ["default=[\u65E2\u5B9A\u5024]", "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024"],
    ["list=[A;B;C]", "\u9078\u629E\u80A2\uFF08\u30BB\u30DF\u30B3\u30ED\u30F3\u533A\u5207\u308A\uFF09"],
    ["min=[0]|max=[100]", "number \u30D5\u30A3\u30FC\u30EB\u30C9\u306E\u6700\u5C0F\u30FB\u6700\u5927\u5024"],
    ["rows=[5]", "textarea / multiselect / multilist \u306E\u8868\u793A\u884C\u6570"]
  ],
  variableRows: [
    ["$\u30AD\u30FC\u540D$", "\u30E6\u30FC\u30B6\u30FC\u5909\u6570\u3002\u30C9\u30EB\u8A18\u53F7 $...$ \u3067\u56F2\u307F\u307E\u3059\u3002\u30D5\u30A9\u30FC\u30E0\u306E\u5165\u529B\u5024\u306B\u7F6E\u304D\u63DB\u308F\u308A\u307E\u3059\u3002multiselect / multilist \u306F\u30C7\u30D5\u30A9\u30EB\u30C8\u3067\u30AB\u30F3\u30DE\u306E\u307F\u3067\u7D50\u5408\uFF08\u30B9\u30DA\u30FC\u30B9\u306A\u3057\uFF09\u3002"],
    ["%timestamp%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u30D1\u30FC\u30BB\u30F3\u30C8\u8A18\u53F7 %...% \u3067\u56F2\u307F\u307E\u3059\u3002\u4FDD\u5B58\u6642\u523B\uFF08\u4F8B: 20260626153000\uFF09\u3002"],
    ["%date%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u4FDD\u5B58\u65E5\u4ED8\uFF08\u4F8B: 2026-06-26\uFF09\u3002\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u305F\u77AC\u9593\u306B\u8A55\u4FA1\u3055\u308C\u307E\u3059\u3002"],
    ["%time%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u4FDD\u5B58\u6642\u523B\uFF08\u4F8B: 15:30:00\uFF09\u3002\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u305F\u77AC\u9593\u306B\u8A55\u4FA1\u3055\u308C\u307E\u3059\u3002"]
  ],
  modifierRows: [
    ["$\u30AD\u30FC\u540D:separator[\u3001]$", "\u6307\u5B9A\u3057\u305F\u533A\u5207\u308A\u6587\u5B57\u3067\u7D50\u5408\u3057\u307E\u3059\u3002[] \u5185\u306E\u6587\u5B57\u5217\u3092\u305D\u306E\u307E\u307E\u4F7F\u7528\u3057\u307E\u3059\u3002"],
    ["$\u30AD\u30FC\u540D:separator[, ]$", "\u4F8B: \u30AB\u30F3\u30DE\uFF0B\u30B9\u30DA\u30FC\u30B9\u3067\u7D50\u5408"],
    ["$\u30AD\u30FC\u540D:list[- ]$", "Markdown \u30EA\u30B9\u30C8\u5F62\u5F0F\u3067\u5C55\u958B\u3057\u307E\u3059\u3002[] \u5185\u306E\u6587\u5B57\u5217\u3092\u305D\u306E\u307E\u307E\u5404\u884C\u306E\u5148\u982D\u306B\u4ED8\u3051\u307E\u3059\u3002"],
    ["$\u30AD\u30FC\u540D:list[  - ]$", "\u4F8B: 2\u30B9\u30DA\u30FC\u30B9\u30A4\u30F3\u30C7\u30F3\u30C8\u4ED8\u304D\u30EA\u30B9\u30C8\uFF08Frontmatter \u306E aliases / tags \u306B\u9069\u3057\u3066\u3044\u307E\u3059\uFF09"],
    ["$\u30AD\u30FC\u540D:list[* ]$", "\u4F8B: * \u8A18\u6CD5\u306E\u30EA\u30B9\u30C8"],
    ["$\u30AD\u30FC\u540D:list[1. ]$", '\u4F8B: \u756A\u53F7\u4ED8\u304D\u30EA\u30B9\u30C8\uFF08[] \u304C "1." \u3067\u59CB\u307E\u308B\u5834\u5408\u306E\u307F\u81EA\u52D5\u63A1\u756A\uFF09']
  ]
};
var LOCALES = { en, ja };
function getLocale(lang) {
  var _a;
  return (_a = LOCALES[lang]) != null ? _a : LOCALES["en"];
}

// src/settings.ts
var DEFAULT_SETTINGS = {
  templateFolder: "Templates",
  locale: "en"
};
var FormBuilderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const L = getLocale(this.plugin.settings.locale);
    new import_obsidian.Setting(containerEl).setHeading().setName(L.settingHeading);
    new import_obsidian.Setting(containerEl).setName(L.settingFolderName).setDesc(L.settingFolderDesc).addText((text) => text.setPlaceholder(L.settingFolderPlaceholder).setValue(this.plugin.settings.templateFolder).onChange(async (value) => {
      this.plugin.settings.templateFolder = value.trim();
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(L.settingLanguageName).setDesc(L.settingLanguageDesc).addDropdown((drop) => {
      for (const [key, label] of Object.entries(LOCALE_LABELS)) {
        drop.addOption(key, label);
      }
      drop.setValue(this.plugin.settings.locale);
      drop.onChange(async (value) => {
        this.plugin.settings.locale = value;
        await this.plugin.saveSettings();
        this.display();
      });
    });
  }
};

// src/form/FormModal.ts
var import_obsidian4 = require("obsidian");

// src/form/help.ts
var import_obsidian2 = require("obsidian");
var HelpModal = class extends import_obsidian2.Modal {
  constructor(app, locale) {
    super(app);
    this.locale = locale;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.helpTitle);
    const root = contentEl.createDiv({ cls: "fb-modal fb-help" });
    this.section(root, L.sec1Title, L.sec1Paragraphs);
    this.section(root, L.sec2Title, L.sec2Paragraphs);
    this.codeBlock(root, L.sampleCode);
    this.subSection(root, L.subMeta);
    this.table(root, L.metaRows);
    this.subSection(root, L.subFields);
    this.table(root, L.fieldRows);
    this.subSection(root, L.subOptions);
    this.table(root, L.optionRows);
    this.subSection(root, L.subVariables);
    this.table(root, L.variableRows);
    this.subSection(root, L.subModifiers);
    this.table(root, L.modifierRows);
    this.section(root, L.sec3Title, L.sec3Paragraphs);
    this.section(root, L.sec4Title, L.sec4Paragraphs);
    const btnRow = root.createDiv({ cls: "fb-btn-row" });
    btnRow.createEl("button", { cls: "fb-btn fb-btn-accent", text: L.btnClose }).addEventListener("click", () => this.close());
  }
  onClose() {
    this.contentEl.empty();
  }
  section(root, title, paragraphs) {
    const sec = root.createDiv({ cls: "fb-help-section" });
    sec.createDiv({ cls: "fb-help-section-title", text: title });
    for (const p of paragraphs) {
      sec.createDiv({ cls: "fb-help-para", text: p });
    }
  }
  subSection(root, title) {
    root.createDiv({ cls: "fb-help-sub-title", text: title });
  }
  codeBlock(root, text) {
    root.createEl("pre", { cls: "fb-example-block" }).createEl("code", { text });
  }
  table(root, rows) {
    const tbody = root.createEl("table", { cls: "fb-help-table" }).createEl("tbody");
    for (const [key, desc] of rows) {
      const tr = tbody.createEl("tr");
      tr.createEl("td", { cls: "fb-help-td-key" }).createEl("code", { text: key });
      tr.createEl("td", { cls: "fb-help-td-desc", text: desc });
    }
  }
};

// src/form/FieldRenderer.ts
function renderField(containerEl, field, values, multilistHint) {
  switch (field.type) {
    case "text":
      renderText(containerEl, field, values);
      break;
    case "textarea":
      renderTextarea(containerEl, field, values);
      break;
    case "number":
      renderNumber(containerEl, field, values);
      break;
    case "date":
      renderDate(containerEl, field, values);
      break;
    case "checkbox":
      renderCheckbox(containerEl, field, values);
      break;
    case "select":
      renderSelect(containerEl, field, values);
      break;
    case "multiselect":
      renderMultiselect(containerEl, field, values);
      break;
    case "multilist":
      renderList(containerEl, field, values, multilistHint);
      break;
  }
}
function createCard(containerEl, field) {
  const card = containerEl.createDiv({ cls: "fb-field" });
  card.dataset.formKey = field.key;
  return card;
}
function appendLabelRow(card, field) {
  var _a;
  const labelRow = card.createDiv({ cls: "fb-label-row" });
  labelRow.createSpan({ cls: "fb-label", text: (_a = field.label) != null ? _a : field.key });
  if (field.required) {
    labelRow.createSpan({ cls: "fb-required-mark", text: "*" });
  }
  if (field.description) {
    card.createDiv({ cls: "fb-desc", text: field.description });
  }
}
function renderText(containerEl, field, values) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const input = card.createEl("input", { cls: "fb-input" });
  input.type = "text";
  input.value = (_b = field.default) != null ? _b : "";
  if (field.placeholder)
    input.placeholder = field.placeholder;
  input.addEventListener("input", () => values.set(field.key, input.value));
}
function renderTextarea(containerEl, field, values) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const textarea = card.createEl("textarea", { cls: "fb-textarea" });
  textarea.value = (_b = field.default) != null ? _b : "";
  if (field.placeholder)
    textarea.placeholder = field.placeholder;
  const rows = field.rows;
  textarea.rows = rows && rows > 0 ? rows : 5;
  textarea.addEventListener("input", () => values.set(field.key, textarea.value));
}
function renderNumber(containerEl, field, values) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const input = card.createEl("input", { cls: "fb-input" });
  input.type = "number";
  const nf = field;
  if (nf.min !== void 0)
    input.min = String(nf.min);
  if (nf.max !== void 0)
    input.max = String(nf.max);
  if (field.placeholder)
    input.placeholder = field.placeholder;
  input.value = (_b = field.default) != null ? _b : "";
  input.addEventListener("input", () => values.set(field.key, input.value));
}
function renderDate(containerEl, field, values) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const input = card.createEl("input", { cls: "fb-input" });
  input.type = "date";
  input.value = (_b = field.default) != null ? _b : "";
  input.addEventListener("change", () => values.set(field.key, input.value));
}
function renderCheckbox(containerEl, field, values) {
  const initVal = field.default === "true";
  values.set(field.key, initVal);
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const wrap = card.createDiv({ cls: "fb-toggle-wrap" });
  const toggleLabel = wrap.createEl("label", { cls: "fb-toggle" });
  const input = toggleLabel.createEl("input");
  input.type = "checkbox";
  input.checked = initVal;
  toggleLabel.createDiv({ cls: "fb-toggle-track" });
  toggleLabel.createDiv({ cls: "fb-toggle-thumb" });
  input.addEventListener("change", () => values.set(field.key, input.checked));
}
function renderSelect(containerEl, field, values) {
  var _a, _b;
  const sf = field;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const select = card.createEl("select", { cls: "fb-select" });
  const emptyOpt = select.createEl("option");
  emptyOpt.value = "";
  emptyOpt.textContent = "---";
  for (const item of sf.list) {
    const opt = select.createEl("option");
    opt.value = item;
    opt.textContent = item;
  }
  const defaultVal = (_b = field.default) != null ? _b : "";
  select.value = defaultVal && sf.list.includes(defaultVal) ? defaultVal : "";
  select.addEventListener("change", () => values.set(field.key, select.value));
}
function renderMultiselect(containerEl, field, values) {
  var _a;
  const defaultRaw = (_a = field.default) != null ? _a : "";
  const defaultItems = defaultRaw ? defaultRaw.split(";").map((s) => s.trim()).filter((s) => field.list.includes(s)) : [];
  const selected = new Set(defaultItems);
  values.set(field.key, [...selected]);
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  const chipGroup = card.createDiv({ cls: "fb-chip-group" });
  for (const item of field.list) {
    const chipWrap = chipGroup.createDiv({ cls: "fb-chip" });
    const id = `fb-chip-${field.key}-${item}`;
    const checkbox = chipWrap.createEl("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.checked = selected.has(item);
    const label = chipWrap.createEl("label", { cls: "fb-chip-label" });
    label.htmlFor = id;
    label.textContent = item;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked)
        selected.add(item);
      else
        selected.delete(item);
      values.set(field.key, [...selected]);
    });
  }
}
function renderList(containerEl, field, values, multilistHint) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  appendLabelRow(card, field);
  if (!field.description) {
    card.createDiv({ cls: "fb-desc", text: multilistHint });
  }
  const textarea = card.createEl("textarea", { cls: "fb-textarea fb-list-input" });
  textarea.value = (_b = field.default) != null ? _b : "";
  if (field.placeholder)
    textarea.placeholder = field.placeholder;
  textarea.rows = field.rows && field.rows > 0 ? field.rows : 4;
  textarea.addEventListener("input", () => values.set(field.key, textarea.value));
}
function highlightRequiredErrors(containerEl, fields, values) {
  containerEl.querySelectorAll(".fb-error").forEach((el) => el.removeClass("fb-error"));
  const missing = [];
  for (const field of fields) {
    if (!field.required)
      continue;
    const value = values.get(field.key);
    const isEmpty = field.type === "multilist" ? typeof value !== "string" || value.split("\n").map((l) => l.trim()).filter(Boolean).length === 0 : value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || value === false;
    if (isEmpty) {
      missing.push(field.key);
      const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
      if (el)
        el.addClass("fb-error");
    }
  }
  return missing;
}

// src/generator/NoteGenerator.ts
var import_obsidian3 = require("obsidian");

// src/generator/VariableResolver.ts
function pad2(n) {
  return String(n).padStart(2, "0");
}
function pad4(n) {
  return String(n).padStart(4, "0");
}
function formatTimestamp(d) {
  return `${pad4(d.getFullYear())}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
}
function formatDate(d) {
  return `${pad4(d.getFullYear())}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function formatTime(d) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
function applyModifierSeparator(values, sep) {
  return values.join(sep);
}
function applyModifierList(values, prefix) {
  const isNumbered = prefix.trimStart().startsWith("1.");
  if (isNumbered) {
    const indentEnd = prefix.indexOf("1.");
    const indent = prefix.slice(0, indentEnd);
    const suffix = prefix.slice(indentEnd + 2);
    return values.map((v, i) => `${indent}${i + 1}.${suffix}${v}`).join("\n");
  }
  return values.map((v) => `${prefix}${v}`).join("\n");
}
var VARIABLE_RE = /\$([a-zA-Z0-9_-]+)(?::([a-zA-Z]+)\[([^\]]*)\])?\$/g;
function isArrayField(field) {
  return field.type === "multiselect" || field.type === "multilist";
}
function formatScalarValue(value, field) {
  if (value === void 0 || value === null)
    return "";
  if (field.type === "checkbox") {
    return value === true || value === "true" ? "true" : "false";
  }
  if (Array.isArray(value))
    return value.join(",");
  return String(value);
}
function toStringArray(value, field) {
  if (field.type === "multiselect") {
    return Array.isArray(value) ? value : [];
  }
  if (field.type === "multilist") {
    const raw = typeof value === "string" ? value : "";
    return raw.split("\n").map((l) => l.trim()).filter((l) => l !== "");
  }
  return [];
}
function resolveUserVariables(template, values, fields) {
  const fieldMap = new Map(fields.map((f) => [f.key, f]));
  const warnings = [];
  const result = template.replace(VARIABLE_RE, (match, key, modifier, modValue) => {
    const field = fieldMap.get(key);
    if (!field)
      return match;
    const value = values.get(key);
    if (!modifier) {
      if (isArrayField(field)) {
        return toStringArray(value, field).join(",");
      }
      return formatScalarValue(value, field);
    }
    if (!isArrayField(field)) {
      warnings.push({
        key,
        modifier,
        message: `Modifier ":${modifier}" is only valid for "multilist" or "multiselect" fields. Ignored for field "${key}".`
      });
      return formatScalarValue(value, field);
    }
    const arr = toStringArray(value, field);
    if (modifier === "separator") {
      return applyModifierSeparator(arr, modValue);
    }
    if (modifier === "list") {
      return applyModifierList(arr, modValue);
    }
    warnings.push({
      key,
      modifier,
      message: `Unknown modifier ":${modifier}" on field "${key}". Known modifiers: "separator", "list". Ignored.`
    });
    return arr.join(",");
  });
  return { result, warnings };
}
function resolveSystemVariables(template) {
  const now = new Date();
  return template.split("%timestamp%").join(formatTimestamp(now)).split("%date%").join(formatDate(now)).split("%time%").join(formatTime(now));
}

// src/generator/NoteGenerator.ts
var INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;
var WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
function sanitizeFileName(name, sanitizedNotice) {
  let sanitized = name.replace(INVALID_FILENAME_CHARS, "_");
  if (WINDOWS_RESERVED_NAMES.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  sanitized = sanitized.replace(/[.\s]+$/, "");
  if (!sanitized)
    sanitized = "Untitled";
  if (sanitized !== name) {
    new import_obsidian3.Notice(sanitizedNotice);
  }
  return sanitized;
}
async function ensureFolder(app, folderPath) {
  if (!folderPath)
    return;
  const parts = folderPath.replace(/\\/g, "/").split("/").filter((p) => p !== "");
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getFolderByPath(current)) {
      await app.vault.createFolder(current);
    }
  }
}
async function generateNote(app, bodyTemplate, values, fields, meta, sanitizedNotice) {
  var _a, _b;
  const { result: content0, warnings: bodyWarnings } = resolveUserVariables(bodyTemplate, values, fields);
  let content = resolveSystemVariables(content0);
  for (const w of bodyWarnings) {
    new import_obsidian3.Notice(`Form Builder: ${w.message}`, 6e3);
  }
  const rawFilename = (_a = meta.filename) != null ? _a : "Untitled";
  const { result: filename0 } = resolveUserVariables(rawFilename, values, fields);
  let resolvedFilename = resolveSystemVariables(filename0);
  resolvedFilename = sanitizeFileName(resolvedFilename, sanitizedNotice);
  if (!resolvedFilename.endsWith(".md"))
    resolvedFilename += ".md";
  const rawFolder = (_b = meta.folder) != null ? _b : "";
  const { result: folder0 } = resolveUserVariables(rawFolder, values, fields);
  const resolvedFolder = resolveSystemVariables(folder0);
  await ensureFolder(app, resolvedFolder);
  const filePath = resolvedFolder ? (0, import_obsidian3.normalizePath)(`${resolvedFolder}/${resolvedFilename}`) : (0, import_obsidian3.normalizePath)(resolvedFilename);
  await app.vault.create(filePath, content);
  const file = app.vault.getFileByPath(filePath);
  if (file)
    await app.workspace.getLeaf().openFile(file);
}

// src/form/FormModal.ts
var FormModal = class extends import_obsidian4.Modal {
  constructor(app, parseResult, locale) {
    super(app);
    this.values = /* @__PURE__ */ new Map();
    this.parseResult = parseResult;
    this.locale = locale;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.formTitle);
    const root = contentEl.createDiv({ cls: "fb-modal" });
    this.renderWarnings(root);
    this.renderFields(root);
    this.renderSubmitButton(root, L.btnCreateNote);
  }
  onClose() {
    this.contentEl.empty();
  }
  renderWarnings(root) {
    if (this.parseResult.warnings.length === 0)
      return;
    const block = root.createDiv({ cls: "fb-warning-block" });
    for (const w of this.parseResult.warnings) {
      block.createDiv({ cls: "fb-warning", text: `\u26A0 ${w.message}` });
    }
  }
  renderFields(root) {
    const L = getLocale(this.locale);
    for (const field of this.parseResult.fields) {
      renderField(root, field, this.values, L.multilistHint);
    }
  }
  renderSubmitButton(root, label) {
    const wrap = root.createDiv({ cls: "fb-submit-wrap" });
    const btn = wrap.createEl("button", { cls: "fb-submit-btn", text: label });
    btn.addEventListener("click", () => this.onSubmit());
  }
  async onSubmit() {
    const L = getLocale(this.locale);
    const root = this.contentEl.querySelector(".fb-modal");
    const missing = highlightRequiredErrors(root, this.parseResult.fields, this.values);
    if (missing.length > 0) {
      new import_obsidian4.Notice(L.noticeRequired);
      return;
    }
    try {
      await generateNote(
        this.app,
        this.parseResult.bodyTemplate,
        this.values,
        this.parseResult.fields,
        this.parseResult.meta,
        L.noticeSanitized
      );
      this.close();
    } catch (e) {
      console.error("Form Builder: Failed to create note", e);
      const message = e instanceof Error ? e.message : String(e);
      new import_obsidian4.Notice(`${L.noticeCreateError}
${message}`, 8e3);
    }
  }
};
var TemplateSelectorModal = class extends import_obsidian4.Modal {
  // 起動時は昇順
  constructor(app, templates, locale, onSelect) {
    super(app);
    this.ascending = true;
    this.templates = templates;
    this.locale = locale;
    this.onSelect = onSelect;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.selectorTitle);
    const root = contentEl.createDiv({ cls: "fb-modal" });
    const sortRow = root.createDiv({ cls: "fb-sort-row" });
    const sortBtn = sortRow.createEl("button", {
      cls: "fb-btn fb-sort-btn",
      text: L.sortAsc
    });
    const listWrap = root.createDiv();
    const renderList2 = () => {
      listWrap.empty();
      const sorted = [...this.templates].sort(
        (a, b) => this.ascending ? a.basename.localeCompare(b.basename) : b.basename.localeCompare(a.basename)
      );
      const ul = listWrap.createEl("ul", { cls: "fb-template-list" });
      for (const file of sorted) {
        const btn = ul.createEl("li").createEl("button", {
          cls: "fb-template-btn"
        });
        btn.appendText(file.basename);
        btn.addEventListener("click", () => {
          this.close();
          this.onSelect(file);
        });
      }
    };
    sortBtn.addEventListener("click", () => {
      this.ascending = !this.ascending;
      sortBtn.textContent = this.ascending ? L.sortAsc : L.sortDesc;
      sortBtn.toggleClass("fb-sort-btn--desc", !this.ascending);
      renderList2();
    });
    renderList2();
    const btnRow = root.createDiv({ cls: "fb-btn-row" });
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnHelp }).addEventListener("click", () => new HelpModal(this.app, this.locale).open());
  }
  onClose() {
    this.contentEl.empty();
  }
};
var NoTemplateModal = class extends import_obsidian4.Modal {
  constructor(app, plugin, locale) {
    super(app);
    this.plugin = plugin;
    this.locale = locale;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.welcomeTitle);
    const root = contentEl.createDiv({ cls: "fb-modal" });
    root.createDiv({ cls: "fb-no-template-msg", text: L.noTemplateMessage });
    root.createEl("pre", { cls: "fb-example-block" }).createEl("code", { text: L.noTemplateSample });
    const btnRow = root.createDiv({ cls: "fb-btn-row" });
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnHelp }).addEventListener("click", () => new HelpModal(this.app, this.locale).open());
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnSettings }).addEventListener("click", () => {
      this.close();
      this.app.setting.open();
    });
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnClose }).addEventListener("click", () => this.close());
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/parser/SyntaxValidator.ts
var KNOWN_FIELD_TYPES = /* @__PURE__ */ new Set([
  "text",
  "textarea",
  "number",
  "date",
  "checkbox",
  "select",
  "multiselect",
  "multilist"
]);
var KNOWN_FIELD_OPTIONS = {
  text: ["required", "label", "placeholder", "description", "default"],
  textarea: ["required", "label", "placeholder", "description", "default", "rows"],
  number: ["required", "label", "placeholder", "description", "default", "min", "max"],
  date: ["required", "label", "placeholder", "description", "default"],
  checkbox: ["required", "label", "description", "default"],
  select: ["required", "label", "description", "default", "list"],
  multiselect: ["required", "label", "description", "default", "list", "rows"],
  multilist: ["required", "label", "placeholder", "description", "default", "rows"]
};
var VALID_KEY = /^[a-zA-Z0-9_-]+$/;
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from(
    { length: m + 1 },
    (_, i) => Array.from({ length: n + 1 }, (_2, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
function suggestOption(unknown, known) {
  let best = null;
  let bestDist = Infinity;
  for (const k of known) {
    const d = levenshtein(unknown, k);
    if (d < bestDist) {
      bestDist = d;
      best = k;
    }
  }
  return bestDist <= 2 ? best : null;
}
function validateFieldType(type, line) {
  if (!KNOWN_FIELD_TYPES.has(type)) {
    return { message: `Unknown field type: "${type}"`, line };
  }
  return null;
}
function validateKey(key, line) {
  if (!VALID_KEY.test(key)) {
    return { message: `Invalid key: "${key}". Keys must match [a-zA-Z0-9_-]`, line };
  }
  return null;
}
function validateOptionName(optionName, fieldType, line) {
  var _a;
  const known = (_a = KNOWN_FIELD_OPTIONS[fieldType]) != null ? _a : [];
  if (!known.includes(optionName)) {
    const suggestion = suggestOption(optionName, known);
    const hint = suggestion ? ` Did you mean "${suggestion}"?` : "";
    return {
      message: `Unknown option "${optionName}" in field type "${fieldType}".${hint}`,
      line
    };
  }
  return null;
}
function validateField(field, line) {
  const errors = [];
  const warnings = [];
  if (field.type === "select" || field.type === "multiselect") {
    const f = field;
    if (!f.list || f.list.length === 0) {
      errors.push({ message: `"${field.type}" requires the "list" option`, line });
    }
  }
  if (field.type === "number") {
    const { min, max } = field;
    if (min !== void 0 && max !== void 0 && min > max) {
      errors.push({
        message: `"min" (${min}) must not exceed "max" (${max}) in field "${field.key}"`,
        line
      });
    }
  }
  if (field.type === "multiselect" && field.default && field.list) {
    for (const dv of field.default.split(";").map((s) => s.trim())) {
      if (!field.list.includes(dv)) {
        warnings.push({
          message: `Default value "${dv}" is not in the list of field "${field.key}"`,
          line
        });
      }
    }
  }
  if (field.type === "select" && field.default && field.list) {
    if (field.default !== "" && !field.list.includes(field.default)) {
      warnings.push({
        message: `Default value "${field.default}" is not in the list of field "${field.key}"`,
        line
      });
    }
  }
  return { errors, warnings };
}
var KNOWN_META_KEYS = /* @__PURE__ */ new Set(["folder", "filename"]);
function validateMetaKey(key, line) {
  if (!KNOWN_META_KEYS.has(key)) {
    return { message: `Unknown meta key: "${key}"`, line };
  }
  return null;
}

// src/parser/TemplateParser.ts
var FORMBUILDER_BLOCK_RE = /^```formbuilder\s*\r?\n([\s\S]*?)\r?\n```/m;
var FIELD_SYNTAX_RE = /^\{\{([\s\S]*?)\}\}$/;
var KV_OPTION_RE = /^([a-zA-Z_-]+)=\[([^\]]*)\]$/;
function trimSpaces(s) {
  return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}
function parseList(raw) {
  return raw.split(";").map((item) => trimSpaces(item)).filter((item) => item !== "");
}
function splitTokens(inner) {
  const tokens = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === "[") {
      depth++;
      current += ch;
    } else if (ch === "]") {
      depth--;
      current += ch;
    } else if (ch === "|" && depth === 0) {
      tokens.push(trimSpaces(current));
      current = "";
    } else {
      current += ch;
    }
  }
  tokens.push(trimSpaces(current));
  return tokens;
}
function parseOptionToken(token) {
  const kvMatch = KV_OPTION_RE.exec(token);
  if (kvMatch)
    return { key: kvMatch[1], value: kvMatch[2] };
  if (/^[a-zA-Z_-]+$/.test(token))
    return { key: token, value: null };
  return null;
}
function parseMetaLine(tokens, meta, warnings, lineNum) {
  for (let i = 1; i < tokens.length; i++) {
    const opt = parseOptionToken(tokens[i]);
    if (!opt)
      continue;
    const metaWarning = validateMetaKey(opt.key, lineNum);
    if (metaWarning) {
      warnings.push(metaWarning);
      continue;
    }
    if (opt.key === "folder" && opt.value !== null)
      meta.folder = opt.value;
    else if (opt.key === "filename" && opt.value !== null)
      meta.filename = opt.value;
  }
}
function parseFieldLine(tokens, errors, warnings, lineNum) {
  var _a, _b, _c, _d;
  if (tokens.length < 2) {
    errors.push({ message: "Field syntax requires at least type and key", line: lineNum });
    return null;
  }
  const type = tokens[0];
  const key = tokens[1];
  const typeError = validateFieldType(type, lineNum);
  if (typeError) {
    errors.push(typeError);
    return null;
  }
  const keyError = validateKey(key, lineNum);
  if (keyError) {
    errors.push(keyError);
    return null;
  }
  const optMap = /* @__PURE__ */ new Map();
  for (let i = 2; i < tokens.length; i++) {
    const opt = parseOptionToken(tokens[i]);
    if (!opt) {
      warnings.push({ message: `Cannot parse option token: "${tokens[i]}"`, line: lineNum });
      continue;
    }
    const optWarning = validateOptionName(opt.key, type, lineNum);
    if (optWarning) {
      warnings.push(optWarning);
      continue;
    }
    if (!optMap.has(opt.key)) {
      optMap.set(opt.key, opt.value);
    }
  }
  const base = {
    key,
    label: optMap.has("label") ? (_a = optMap.get("label")) != null ? _a : void 0 : void 0,
    placeholder: optMap.has("placeholder") ? (_b = optMap.get("placeholder")) != null ? _b : void 0 : void 0,
    description: optMap.has("description") ? (_c = optMap.get("description")) != null ? _c : void 0 : void 0,
    default: optMap.has("default") ? (_d = optMap.get("default")) != null ? _d : void 0 : void 0,
    required: optMap.has("required")
  };
  switch (type) {
    case "text":
      return { type: "text", ...base };
    case "textarea": {
      const rowsStr = optMap.get("rows");
      const rows = rowsStr ? parseInt(rowsStr, 10) : void 0;
      return { type: "textarea", ...base, rows: isNaN(rows) ? void 0 : rows };
    }
    case "number": {
      const minStr = optMap.get("min");
      const maxStr = optMap.get("max");
      const min = minStr != null ? parseFloat(minStr) : void 0;
      const max = maxStr != null ? parseFloat(maxStr) : void 0;
      return {
        type: "number",
        ...base,
        min: min !== void 0 && !isNaN(min) ? min : void 0,
        max: max !== void 0 && !isNaN(max) ? max : void 0
      };
    }
    case "date":
      return { type: "date", ...base };
    case "checkbox":
      return { type: "checkbox", ...base };
    case "select": {
      const listRaw = optMap.get("list");
      if (listRaw == null) {
        errors.push({ message: `"select" requires the "list" option in field "${key}"`, line: lineNum });
        return null;
      }
      return { type: "select", ...base, list: parseList(listRaw) };
    }
    case "multiselect": {
      const listRaw = optMap.get("list");
      if (listRaw == null) {
        errors.push({ message: `"multiselect" requires the "list" option in field "${key}"`, line: lineNum });
        return null;
      }
      const list = parseList(listRaw);
      const rowsStr = optMap.get("rows");
      const msField = { type: "multiselect", ...base, list };
      if (rowsStr)
        msField.rows = parseInt(rowsStr, 10);
      return msField;
    }
    case "multilist": {
      const rowsStr = optMap.get("rows");
      const rows = rowsStr ? parseInt(rowsStr, 10) : void 0;
      const lf = { type: "multilist", ...base };
      if (rows !== void 0 && !isNaN(rows))
        lf.rows = rows;
      return lf;
    }
    default:
      errors.push({ message: `Unknown field type: "${type}"`, line: lineNum });
      return null;
  }
}
function parseTemplate(templateContent) {
  var _a, _b;
  const errors = [];
  const warnings = [];
  const meta = {};
  const fields = [];
  const blockMatch = FORMBUILDER_BLOCK_RE.exec(templateContent);
  if (!blockMatch) {
    return { meta, fields, bodyTemplate: templateContent, errors, warnings };
  }
  const blockContent = blockMatch[1];
  const bodyTemplate = templateContent.replace(blockMatch[0], "").replace(/^\n/, "");
  const lines = blockContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    if (line === "")
      continue;
    const openCount = ((_a = line.match(/\{\{/g)) != null ? _a : []).length;
    const closeCount = ((_b = line.match(/\}\}/g)) != null ? _b : []).length;
    if (openCount !== closeCount) {
      errors.push({ message: `Unclosed "{{" found on line ${lineNum}`, line: lineNum });
      continue;
    }
    const syntaxMatch = FIELD_SYNTAX_RE.exec(line);
    if (!syntaxMatch)
      continue;
    const tokens = splitTokens(syntaxMatch[1]);
    if (tokens.length === 0 || tokens[0] === "")
      continue;
    if (tokens[0] === "meta") {
      parseMetaLine(tokens, meta, warnings, lineNum);
    } else {
      const field = parseFieldLine(tokens, errors, warnings, lineNum);
      if (field) {
        const vr = validateField(field, lineNum);
        errors.push(...vr.errors);
        warnings.push(...vr.warnings);
        if (vr.errors.length === 0)
          fields.push(field);
      }
    }
  }
  return { meta, fields, bodyTemplate, errors, warnings };
}

// src/ui/ErrorNotice.ts
var import_obsidian5 = require("obsidian");
function showFatalError(errors, header) {
  const messages = errors.map((e) => {
    const lineInfo = e.line ? ` (line ${e.line})` : "";
    return `\u2022 ${e.message}${lineInfo}`;
  }).join("\n");
  new import_obsidian5.Notice(`${header}
${messages}`, 8e3);
}

// src/main.ts
var FORMBUILDER_BLOCK_RE2 = /^```formbuilder\s*$/m;
var FormBuilderPlugin = class extends import_obsidian6.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new FormBuilderSettingTab(this.app, this));
    this.addCommand({
      id: "create-note-from-template",
      name: "Create Note From Template",
      callback: () => this.openTemplatePicker()
    });
  }
  async onunload() {
  }
  async openTemplatePicker() {
    const { templateFolder, locale } = this.settings;
    const allFiles = this.app.vault.getMarkdownFiles().filter(
      (f) => f.path.startsWith(templateFolder + "/") || f.path.startsWith(templateFolder + "\\")
    );
    const templates = [];
    for (const file of allFiles) {
      try {
        const content = await this.app.vault.read(file);
        if (FORMBUILDER_BLOCK_RE2.test(content))
          templates.push(file);
      } catch (e) {
      }
    }
    if (templates.length === 0) {
      new NoTemplateModal(this.app, this, locale).open();
      return;
    }
    if (templates.length === 1) {
      await this.openFormForTemplate(templates[0]);
    } else {
      new TemplateSelectorModal(this.app, templates, locale, async (file) => {
        await this.openFormForTemplate(file);
      }).open();
    }
  }
  async openFormForTemplate(file) {
    const { locale } = this.settings;
    const L = getLocale(locale);
    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new import_obsidian6.Notice(`${L.noticeReadError}
"${file.path}"`);
      return;
    }
    const parseResult = parseTemplate(content);
    if (parseResult.errors.length > 0) {
      showFatalError(parseResult.errors, L.noticeFatalHeader);
      return;
    }
    new FormModal(this.app, parseResult, locale).open();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
