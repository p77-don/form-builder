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
var import_obsidian11 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");

// src/locales.ts
var LOCALE_LABELS = {
  en: "English",
  ja: "\u65E5\u672C\u8A9E"
};
function formatMessage(template, params) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
  });
}
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
  noticeFolderSanitized: 'Form Builder: Some invalid parts of the output folder path (e.g. "..", forbidden characters) were replaced with "_".',
  noticeInvalidNumber: "Form Builder: One or more number fields are invalid. Please check the values and the min/max range.",
  noticeInitError: "Form Builder: Failed to initialize the plugin. Please check the developer console for details.",
  noticeStoreError: "Form Builder: Failed to save your change. Please try again.",
  noticeDuplicateFilename: 'Form Builder: A note with this name already existed, so it was saved as "{name}" instead.',
  noticeFatalHeader: "Form Builder Error:",
  // モーダル共通
  btnClose: "Close",
  btnHelp: "? Help",
  btnSettings: "Open Settings",
  // テンプレート選択
  selectorTitle: "Select Template",
  sortAsc: "\u25B2 A \u2192 Z",
  sortDesc: "\u25BC Z \u2192 A",
  pickerSearchPlaceholder: "Search templates...",
  pickerTabFolder: "\u{1F4C1} Folder",
  pickerTabFavorites: "\u2605 Favorites",
  pickerTabRecent: "\u{1F552} History",
  pickerNoResults: "No matching templates.",
  pickerNoFavorites: "No favorites yet. Tap \u2606 next to a template to add one.",
  pickerNoRecent: "No usage history yet.",
  pickerClearRecent: "Clear History",
  pickerClearRecentConfirm: "Tap again to confirm",
  pickerMissingLabel: "(missing \u2014 tap \u2715 to remove)",
  pickerAriaClearSearch: "Clear search",
  pickerAriaToggleFavorite: "Toggle favorite",
  pickerAriaRemove: "Remove",
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
  folderPickerBtnLabel: "Choose folder",
  folderPickerPlaceholder: "Type to search folders...",
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
    ["rows=[5]", "Visible rows for textarea / multiselect / multilist"],
    ["folder", "text only. Shows a folder-picker button next to the input (flag, no value)"]
  ],
  variableRows: [
    ["$key$", 'User variable \u2014 replaced with the form input value. Surrounded by dollar signs $...$. For multiselect / multilist, values are joined with "," (no space) by default.'],
    ["%timestamp%", "System variable \u2014 save timestamp (e.g. 20260626153000). Surrounded by percent signs %...%."],
    ["%date%", 'System variable \u2014 save date (e.g. 2026-06-26). Evaluated at the moment "Create Note" is pressed.'],
    ["%time%", 'System variable \u2014 save time (e.g. 15:30:00). Evaluated at the moment "Create Note" is pressed.'],
    ["%folder%", "System variable \u2014 the note's final output folder (after meta|folder is resolved). Body text only; cannot be used inside meta|folder or meta|filename."],
    ["%filename%", `System variable \u2014 the note's final file name without the ".md" extension (after meta|filename is resolved and sanitized). Body text only; cannot be used inside meta|folder or meta|filename.`]
  ],
  modifierRows: [
    ["$key:separator[, ]$", "Join values with the specified separator. Any string allowed inside []."],
    ["$key:separator[\u30FB]$", 'Example: joined with "\u30FB"'],
    ["$key:list[- ]$", "Output as a Markdown list. The content of [] is prepended to each line as-is."],
    ["$key:list[  - ]$", "Example: 2-space indented list (useful for Frontmatter aliases / tags)"],
    ["$key:list[* ]$", "Example: unordered list with *"],
    ["$key:list[1. ]$", 'Example: numbered list (auto-numbered only when [] starts with "1.")']
  ],
  // ---------- 構文ジェネレーター（Field Generator） ----------
  genModalTitle: "Syntax Generator",
  genTypeLabel: "Generator Type",
  genTypeField: "Field",
  genTypeMetaFolder: "Meta: Folder",
  genTypeMetaFilename: "Meta: Filename",
  genFieldType: "Field Type",
  genFieldTypeOptions: {
    text: "Text",
    textarea: "Textarea",
    number: "Number",
    date: "Date",
    checkbox: "Checkbox",
    select: "Select",
    multiselect: "Multiselect",
    multilist: "Multilist"
  },
  genFieldTypeHints: {
    text: "Single-line text input.",
    textarea: "Multi-line text input.",
    number: "Numeric input.",
    date: "Date picker.",
    checkbox: "A single on/off toggle.",
    select: "Dropdown \u2014 user picks exactly one option.",
    multiselect: "Checkboxes \u2014 user can pick multiple options.",
    multilist: "Free text, one item per line (no fixed option list)."
  },
  genKey: "Key",
  genKeyHint: 'The internal name used in the syntax and as the $key$ variable. Letters, numbers, "_" and "-" only. Not shown to the user filling in the form.',
  genLabel: "Label",
  genLabelHint: "The text shown above this field on the form. Leave blank to fall back to the key.",
  genDescription: "Description",
  genDescriptionHint: "Short explanatory text shown below the label on the form. Optional.",
  genPlaceholder: "Placeholder",
  genPlaceholderHint: "Faint example text shown inside the empty input box. Optional.",
  genDefault: "Default",
  genDefaultHint: "Value pre-filled when the form opens. Leave blank for no default.",
  genDefaultHintSelect: "The option pre-selected when the form opens. Leave blank to select nothing initially.",
  genDefaultHintMultiselect: 'Options pre-selected when the form opens. For multiple options, separate with ";" (e.g. "a;b"). Leave blank to select nothing initially.',
  genDefaultChecked: "Checked by default",
  genDefaultCheckedHint: "Whether this checkbox starts turned on when the form opens.",
  genRows: "Rows",
  genRowsHint: "How many lines tall the input box is. Leave blank for the default size.",
  genMin: "Min",
  genMinHint: "Smallest number the user is allowed to enter. Optional.",
  genMax: "Max",
  genMaxHint: "Largest number the user is allowed to enter. Optional.",
  genList: "Options",
  genListHint: "Enter one option per line.",
  genRequired: "Required",
  genRequiredHint: "If on, the form cannot be submitted while this field is empty.",
  genFolder: "Folder",
  genFolderHint: "If on, a folder-picker button is shown next to the input. The value is still plain text, so the user can freely edit it (e.g. to type a new subfolder) after choosing.",
  genPreviewTitle: "Preview",
  genVariableTitle: "Generated Variable",
  genForbiddenBracketWarning: 'Values cannot contain "]" \u2014 the generated syntax could not be read back correctly by the template parser. Please remove it.',
  genVarHintDefaultScalar: "Replaced with the value as entered.",
  genVarHintDefaultArray: 'Joins all values with "," (no space).',
  genVarHintList: 'Markdown list, each line prefixed with "- ".',
  genVarHintNumbered: "Numbered list (1. 2. 3. ...).",
  genVarHintSeparator: 'Joins all values with "; ".',
  genMetaFolderLabel: "Folder",
  genMetaFilenameLabel: "File name",
  genMetaFolderHint: 'Where the note is saved. Type a fixed name (e.g. "Notes"), a variable (e.g. "$export$" or "%date%"), or mix both (e.g. "out_%date%").',
  genMetaFilenameHint: 'The file name (without ".md"). Same rules as Folder \u2014 fixed text, a variable, or a mix (e.g. "$title$-%timestamp%").',
  genMetaInsertVariableLabel: "Insert variable:",
  genMetaFolderTip: 'Tip: combining fixed text with a variable (e.g. "out_%date%") keeps notes organized while still being predictable.',
  genMetaFilenameOkTip: "Good \u2014 this file name includes a variable, which helps avoid collisions with existing files.",
  genMetaFilenameNoVariableWarning: "This file name is entirely fixed text. If a note with the same name already exists in the folder, creating a new note will fail. Consider adding %date%, %timestamp%, or a form variable like $title$.",
  genWrapInBlockLabel: "Insert formbuilder code block",
  genWrapInBlockHint: "Wraps the generated syntax in a new ```formbuilder code block. Your cursor is not currently inside one.",
  genCopySyntax: "Copy Syntax",
  genCopyVariable: "Copy Variable",
  genCopyBoth: "Copy Both",
  genInsert: "Insert",
  genCancel: "Cancel",
  genCopiedNotice: "Form Builder: Copied to clipboard.",
  genNoActiveEditor: "Form Builder: No active editor found.",
  genInsertOutsideBlock: "Place the cursor inside a formbuilder code block.",
  genInsertedNotice: "Form Builder: Field inserted.",
  // パーサー / バリデーターのメッセージ
  msgUnknownFieldType: 'Unknown field type: "{type}"',
  msgInvalidKey: 'Invalid key: "{key}". Keys must match [a-zA-Z0-9_-]',
  msgFieldSyntaxTooShort: "Field syntax requires at least type and key",
  msgCannotParseOptionToken: 'Cannot parse option token: "{token}"',
  msgUnknownOption: 'Unknown option "{option}" in field type "{fieldType}".{hint}',
  msgUnknownOptionHint: ' Did you mean "{suggestion}"?',
  msgFieldRequiresList: '"{type}" requires the "list" option in field "{key}"',
  msgMinExceedsMax: '"min" ({min}) must not exceed "max" ({max}) in field "{key}"',
  msgDefaultNotInList: 'Default value "{value}" is not in the list of field "{key}"',
  msgUnknownMetaKey: 'Unknown meta key: "{key}"',
  msgInvalidRows: 'Invalid "rows" value "{value}" in field "{key}"; expected a positive integer (e.g. "5"). Ignoring.',
  msgInvalidNumericOption: 'Invalid "{option}" value "{value}" in field "{key}"; expected a number (e.g. "0", "3.5", "-1"). Ignoring.',
  msgDuplicateMetaKey: '"meta|{metaKey}" is defined more than once (first defined on line {firstLine}). Only one "meta|{metaKey}" is allowed per template.',
  msgFlagOptionHasValue: 'Option "{option}" does not take a value; "{option}=[{value}]" in field "{key}" is treated as just "{option}" (the assigned value is ignored)',
  msgDuplicateOption: 'Option "{option}" is specified more than once in field "{key}"; only the first occurrence is used',
  msgRequiredNoEffectOnCheckbox: '"required" has no effect on "checkbox" fields (a checkbox field always submits true/false) in field "{key}"',
  msgUnclosedBrace: 'Unclosed "{{" found on line {line}',
  msgDuplicateFieldKey: 'Key "{key}" is defined more than once (first defined on line {firstLine}). Each field key must be unique within a template.',
  msgModifierOnlyForArrayFields: 'Form Builder: Modifier ":{modifier}" is only valid for "multilist" or "multiselect" fields. Ignored for field "{key}".',
  msgUnknownModifier: 'Form Builder: Unknown modifier ":{modifier}" on field "{key}". Known modifiers: "separator", "list". Ignored.'
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
  noticeFolderSanitized: 'Form Builder: \u51FA\u529B\u30D5\u30A9\u30EB\u30C0\u306E\u30D1\u30B9\u306B\u4F7F\u7528\u3067\u304D\u306A\u3044\u90E8\u5206\uFF08".." \u3084\u7981\u6B62\u6587\u5B57\u306A\u3069\uFF09\u304C\u542B\u307E\u308C\u3066\u3044\u305F\u305F\u3081 "_" \u306B\u7F6E\u304D\u63DB\u3048\u307E\u3057\u305F\u3002',
  noticeInvalidNumber: "Form Builder: \u6570\u5024\u306E\u5165\u529B\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059\u3002\u5165\u529B\u5185\u5BB9\u3068\u6700\u5C0F\u5024\u30FB\u6700\u5927\u5024\u306E\u7BC4\u56F2\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  noticeInitError: "Form Builder: \u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u958B\u767A\u8005\u30B3\u30F3\u30BD\u30FC\u30EB\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002",
  noticeStoreError: "Form Builder: \u5909\u66F4\u306E\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",
  noticeDuplicateFilename: 'Form Builder: \u540C\u540D\u306E\u30CE\u30FC\u30C8\u304C\u65E2\u306B\u5B58\u5728\u3057\u305F\u305F\u3081\u3001"{name}" \u3068\u3057\u3066\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002',
  noticeFatalHeader: "Form Builder \u30A8\u30E9\u30FC:",
  // モーダル共通
  btnClose: "\u9589\u3058\u308B",
  btnHelp: "? \u30D8\u30EB\u30D7",
  btnSettings: "\u8A2D\u5B9A\u3092\u958B\u304F",
  // テンプレート選択
  selectorTitle: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u9078\u629E",
  sortAsc: "\u25B2 \u6607\u9806",
  sortDesc: "\u25BC \u964D\u9806",
  pickerSearchPlaceholder: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u3092\u691C\u7D22...",
  pickerTabFolder: "\u{1F4C1} \u30D5\u30A9\u30EB\u30C0",
  pickerTabFavorites: "\u2605 \u304A\u6C17\u306B\u5165\u308A",
  pickerTabRecent: "\u{1F552} \u4F7F\u7528\u5C65\u6B74",
  pickerNoResults: "\u4E00\u81F4\u3059\u308B\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
  pickerNoFavorites: "\u304A\u6C17\u306B\u5165\u308A\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u6A2A\u306E \u2606 \u3092\u30BF\u30C3\u30D7\u3059\u308B\u3068\u767B\u9332\u3067\u304D\u307E\u3059\u3002",
  pickerNoRecent: "\u4F7F\u7528\u5C65\u6B74\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002",
  pickerClearRecent: "\u4F7F\u7528\u5C65\u6B74\u3092\u30AF\u30EA\u30A2",
  pickerClearRecentConfirm: "\u3082\u3046\u4E00\u5EA6\u30BF\u30C3\u30D7\u3067\u524A\u9664",
  pickerMissingLabel: "\uFF08\u898B\u3064\u304B\u308A\u307E\u305B\u3093 \u2014 \u2715 \u3067\u524A\u9664\u3067\u304D\u307E\u3059\uFF09",
  pickerAriaClearSearch: "\u691C\u7D22\u6587\u5B57\u5217\u3092\u30AF\u30EA\u30A2",
  pickerAriaToggleFavorite: "\u304A\u6C17\u306B\u5165\u308A\u3092\u5207\u308A\u66FF\u3048",
  pickerAriaRemove: "\u524A\u9664",
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
  folderPickerBtnLabel: "\u30D5\u30A9\u30EB\u30C0\u3092\u9078\u629E",
  folderPickerPlaceholder: "\u30D5\u30A9\u30EB\u30C0\u3092\u691C\u7D22...",
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
    ["rows=[5]", "textarea / multiselect / multilist \u306E\u8868\u793A\u884C\u6570"],
    ["folder", "text \u5C02\u7528\u3002\u5165\u529B\u6B04\u306E\u6A2A\u306B\u30D5\u30A9\u30EB\u30C0\u9078\u629E\u30DC\u30BF\u30F3\u3092\u8868\u793A\u3059\u308B\uFF08\u30D5\u30E9\u30B0\u3001\u5024\u306A\u3057\uFF09"]
  ],
  variableRows: [
    ["$\u30AD\u30FC\u540D$", "\u30E6\u30FC\u30B6\u30FC\u5909\u6570\u3002\u30C9\u30EB\u8A18\u53F7 $...$ \u3067\u56F2\u307F\u307E\u3059\u3002\u30D5\u30A9\u30FC\u30E0\u306E\u5165\u529B\u5024\u306B\u7F6E\u304D\u63DB\u308F\u308A\u307E\u3059\u3002multiselect / multilist \u306F\u30C7\u30D5\u30A9\u30EB\u30C8\u3067\u30AB\u30F3\u30DE\u306E\u307F\u3067\u7D50\u5408\uFF08\u30B9\u30DA\u30FC\u30B9\u306A\u3057\uFF09\u3002"],
    ["%timestamp%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u30D1\u30FC\u30BB\u30F3\u30C8\u8A18\u53F7 %...% \u3067\u56F2\u307F\u307E\u3059\u3002\u4FDD\u5B58\u6642\u523B\uFF08\u4F8B: 20260626153000\uFF09\u3002"],
    ["%date%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u4FDD\u5B58\u65E5\u4ED8\uFF08\u4F8B: 2026-06-26\uFF09\u3002\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u305F\u77AC\u9593\u306B\u8A55\u4FA1\u3055\u308C\u307E\u3059\u3002"],
    ["%time%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u4FDD\u5B58\u6642\u523B\uFF08\u4F8B: 15:30:00\uFF09\u3002\u300C\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u305F\u77AC\u9593\u306B\u8A55\u4FA1\u3055\u308C\u307E\u3059\u3002"],
    ["%folder%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u3053\u306E\u30CE\u30FC\u30C8\u306E\u6700\u7D42\u7684\u306A\u51FA\u529B\u30D5\u30A9\u30EB\u30C0\uFF08meta|folder \u5C55\u958B\u5F8C\u306E\u5024\uFF09\u3002\u672C\u6587\u3067\u306E\u307F\u4F7F\u7528\u53EF\u80FD\u3067\u3001meta|folder\u30FBmeta|filename \u306E\u4E2D\u3067\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002"],
    ["%filename%", "\u30B7\u30B9\u30C6\u30E0\u5909\u6570\u3002\u3053\u306E\u30CE\u30FC\u30C8\u306E\u6700\u7D42\u7684\u306A\u30D5\u30A1\u30A4\u30EB\u540D\uFF08\u62E1\u5F35\u5B50 .md \u3092\u9664\u304F\u3002meta|filename \u5C55\u958B\u30FB\u30B5\u30CB\u30BF\u30A4\u30BA\u5F8C\u306E\u5024\uFF09\u3002\u672C\u6587\u3067\u306E\u307F\u4F7F\u7528\u53EF\u80FD\u3067\u3001meta|folder\u30FBmeta|filename \u306E\u4E2D\u3067\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002"]
  ],
  modifierRows: [
    ["$\u30AD\u30FC\u540D:separator[\u3001]$", "\u6307\u5B9A\u3057\u305F\u533A\u5207\u308A\u6587\u5B57\u3067\u7D50\u5408\u3057\u307E\u3059\u3002[] \u5185\u306E\u6587\u5B57\u5217\u3092\u305D\u306E\u307E\u307E\u4F7F\u7528\u3057\u307E\u3059\u3002"],
    ["$\u30AD\u30FC\u540D:separator[, ]$", "\u4F8B: \u30AB\u30F3\u30DE\uFF0B\u30B9\u30DA\u30FC\u30B9\u3067\u7D50\u5408"],
    ["$\u30AD\u30FC\u540D:list[- ]$", "Markdown \u30EA\u30B9\u30C8\u5F62\u5F0F\u3067\u5C55\u958B\u3057\u307E\u3059\u3002[] \u5185\u306E\u6587\u5B57\u5217\u3092\u305D\u306E\u307E\u307E\u5404\u884C\u306E\u5148\u982D\u306B\u4ED8\u3051\u307E\u3059\u3002"],
    ["$\u30AD\u30FC\u540D:list[  - ]$", "\u4F8B: 2\u30B9\u30DA\u30FC\u30B9\u30A4\u30F3\u30C7\u30F3\u30C8\u4ED8\u304D\u30EA\u30B9\u30C8\uFF08Frontmatter \u306E aliases / tags \u306B\u9069\u3057\u3066\u3044\u307E\u3059\uFF09"],
    ["$\u30AD\u30FC\u540D:list[* ]$", "\u4F8B: * \u8A18\u6CD5\u306E\u30EA\u30B9\u30C8"],
    ["$\u30AD\u30FC\u540D:list[1. ]$", '\u4F8B: \u756A\u53F7\u4ED8\u304D\u30EA\u30B9\u30C8\uFF08[] \u304C "1." \u3067\u59CB\u307E\u308B\u5834\u5408\u306E\u307F\u81EA\u52D5\u63A1\u756A\uFF09']
  ],
  // ---------- 構文ジェネレーター（Field Generator） ----------
  genModalTitle: "\u69CB\u6587\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u30FC",
  genTypeLabel: "\u751F\u6210\u30BF\u30A4\u30D7",
  genTypeField: "\u30D5\u30A3\u30FC\u30EB\u30C9",
  genTypeMetaFolder: "Meta: \u30D5\u30A9\u30EB\u30C0",
  genTypeMetaFilename: "Meta: \u30D5\u30A1\u30A4\u30EB\u540D",
  genFieldType: "\u30D5\u30A3\u30FC\u30EB\u30C9\u30BF\u30A4\u30D7",
  genFieldTypeOptions: {
    text: "\u30C6\u30AD\u30B9\u30C8",
    textarea: "\u30C6\u30AD\u30B9\u30C8\u30A8\u30EA\u30A2",
    number: "\u6570\u5024",
    date: "\u65E5\u4ED8",
    checkbox: "\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9",
    select: "\u5358\u4E00\u9078\u629E",
    multiselect: "\u8907\u6570\u9078\u629E",
    multilist: "\u81EA\u7531\u8A18\u8FF0\u30EA\u30B9\u30C8"
  },
  genFieldTypeHints: {
    text: "1\u884C\u306E\u77ED\u3044\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B\u3059\u308B\u9805\u76EE\u3067\u3059\u3002",
    textarea: "\u8907\u6570\u884C\u306E\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B\u3059\u308B\u9805\u76EE\u3067\u3059\u3002",
    number: "\u6570\u5024\u306E\u307F\u3092\u5165\u529B\u3059\u308B\u9805\u76EE\u3067\u3059\u3002",
    date: "\u65E5\u4ED8\u3092\u9078\u629E\u3059\u308B\u9805\u76EE\u3067\u3059\u3002",
    checkbox: "ON/OFF\u30921\u3064\u3060\u3051\u5207\u308A\u66FF\u3048\u308B\u9805\u76EE\u3067\u3059\u3002",
    select: "\u30D7\u30EB\u30C0\u30A6\u30F3\u304B\u30891\u3064\u3060\u3051\u9078\u3076\u9805\u76EE\u3067\u3059\u3002",
    multiselect: "\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9\u304B\u3089\u8907\u6570\u9078\u3079\u308B\u9805\u76EE\u3067\u3059\u3002",
    multilist: "\u6C7A\u307E\u3063\u305F\u9078\u629E\u80A2\u3092\u6301\u305F\u305A\u3001\u81EA\u7531\u306B\u8907\u6570\u884C\u5165\u529B\u3067\u304D\u308B\u9805\u76EE\u3067\u3059\u3002"
  },
  genKey: "\u30AD\u30FC",
  genKeyHint: '\u69CB\u6587\u304A\u3088\u3073 $\u30AD\u30FC$ \u5909\u6570\u3068\u3057\u3066\u4F7F\u308F\u308C\u308B\u5185\u90E8\u540D\u3067\u3059\u3002\u534A\u89D2\u82F1\u6570\u5B57\u30FB"_"\u30FB"-" \u306E\u307F\u4F7F\u7528\u3067\u304D\u307E\u3059\u3002\u30D5\u30A9\u30FC\u30E0\u4E0A\u306B\u306F\u8868\u793A\u3055\u308C\u307E\u305B\u3093\u3002',
  genLabel: "\u30E9\u30D9\u30EB",
  genLabelHint: "\u30D5\u30A9\u30FC\u30E0\u4E0A\u3067\u3053\u306E\u9805\u76EE\u306E\u898B\u51FA\u3057\u3068\u3057\u3066\u8868\u793A\u3055\u308C\u308B\u6587\u5B57\u5217\u3067\u3059\u3002\u7A7A\u6B04\u306E\u5834\u5408\u306F\u30AD\u30FC\u304C\u305D\u306E\u307E\u307E\u8868\u793A\u3055\u308C\u307E\u3059\u3002",
  genDescription: "\u8AAC\u660E",
  genDescriptionHint: "\u30E9\u30D9\u30EB\u306E\u4E0B\u306B\u8868\u793A\u3055\u308C\u308B\u88DC\u8DB3\u8AAC\u660E\u3067\u3059\u3002\u7701\u7565\u3067\u304D\u307E\u3059\u3002",
  genPlaceholder: "\u30D7\u30EC\u30FC\u30B9\u30DB\u30EB\u30C0\u30FC",
  genPlaceholderHint: "\u672A\u5165\u529B\u6642\u306B\u8584\u3044\u30B0\u30EC\u30FC\u3067\u8868\u793A\u3055\u308C\u308B\u5165\u529B\u4F8B\u3067\u3059\u3002\u7701\u7565\u3067\u304D\u307E\u3059\u3002",
  genDefault: "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024",
  genDefaultHint: "\u30D5\u30A9\u30FC\u30E0\u3092\u958B\u3044\u305F\u3068\u304D\u306B\u6700\u521D\u304B\u3089\u5165\u529B\u3055\u308C\u3066\u3044\u308B\u5024\u3067\u3059\u3002\u7A7A\u6B04\u306A\u3089\u4F55\u3082\u5165\u529B\u3055\u308C\u307E\u305B\u3093\u3002",
  genDefaultHintSelect: "\u30D5\u30A9\u30FC\u30E0\u3092\u958B\u3044\u305F\u3068\u304D\u306B\u6700\u521D\u304B\u3089\u9078\u629E\u3055\u308C\u3066\u3044\u308B\u5024\u3067\u3059\u3002\u7A7A\u6B04\u306A\u3089\u4F55\u3082\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",
  genDefaultHintMultiselect: '\u30D5\u30A9\u30FC\u30E0\u3092\u958B\u3044\u305F\u3068\u304D\u306B\u6700\u521D\u304B\u3089\u9078\u629E\u3055\u308C\u3066\u3044\u308B\u9805\u76EE\u3067\u3059\u3002\u8907\u6570\u6307\u5B9A\u3059\u308B\u5834\u5408\u306F ";" \u3067\u533A\u5207\u3063\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: "a;b"\uFF09\u3002\u7A7A\u6B04\u306A\u3089\u3069\u308C\u3082\u9078\u629E\u3055\u308C\u307E\u305B\u3093\u3002',
  genDefaultChecked: "\u521D\u671F\u72B6\u614B\u3067ON\u306B\u3059\u308B",
  genDefaultCheckedHint: "\u30D5\u30A9\u30FC\u30E0\u3092\u958B\u3044\u305F\u3068\u304D\u306B\u3001\u3053\u306E\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9\u3092\u6700\u521D\u304B\u3089ON\u306B\u3059\u308B\u304B\u3069\u3046\u304B\u3067\u3059\u3002",
  genRows: "\u884C\u6570",
  genRowsHint: "\u5165\u529B\u6B04\u306E\u9AD8\u3055\uFF08\u884C\u6570\uFF09\u3067\u3059\u3002\u7A7A\u6B04\u306E\u5834\u5408\u306F\u6A19\u6E96\u306E\u9AD8\u3055\u306B\u306A\u308A\u307E\u3059\u3002",
  genMin: "\u6700\u5C0F\u5024",
  genMinHint: "\u5165\u529B\u3067\u304D\u308B\u6700\u5C0F\u306E\u6570\u5024\u3067\u3059\u3002\u7701\u7565\u3067\u304D\u307E\u3059\u3002",
  genMax: "\u6700\u5927\u5024",
  genMaxHint: "\u5165\u529B\u3067\u304D\u308B\u6700\u5927\u306E\u6570\u5024\u3067\u3059\u3002\u7701\u7565\u3067\u304D\u307E\u3059\u3002",
  genList: "\u9078\u629E\u80A2",
  genListHint: "1\u884C\u306B\u3064\u304D1\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  genRequired: "\u5FC5\u9808\u9805\u76EE\u306B\u3059\u308B",
  genRequiredHint: "ON\u306B\u3059\u308B\u3068\u3001\u3053\u306E\u9805\u76EE\u304C\u672A\u5165\u529B\u306E\u307E\u307E\u3067\u306F\u30CE\u30FC\u30C8\u3092\u4F5C\u6210\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002",
  genFolder: "\u30D5\u30A9\u30EB\u30C0\u9078\u629E\u30DC\u30BF\u30F3\u3092\u8868\u793A\u3059\u308B",
  genFolderHint: "ON\u306B\u3059\u308B\u3068\u3001\u5165\u529B\u6B04\u306E\u6A2A\u306B Vault \u5185\u306E\u30D5\u30A9\u30EB\u30C0\u3092\u9078\u629E\u3059\u308B\u30DC\u30BF\u30F3\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u5024\u306F\u3042\u304F\u307E\u3067\u901A\u5E38\u306E\u6587\u5B57\u5217\u306E\u305F\u3081\u3001\u9078\u629E\u5F8C\u3082\u81EA\u7531\u306B\u7DE8\u96C6\u3067\u304D\u307E\u3059\uFF08\u4F8B: \u9078\u629E\u5F8C\u306B\u65B0\u3057\u3044\u30B5\u30D6\u30D5\u30A9\u30EB\u30C0\u540D\u3092\u8FFD\u8A18\u3059\u308B\u306A\u3069\uFF09\u3002",
  genPreviewTitle: "\u30D7\u30EC\u30D3\u30E5\u30FC",
  genVariableTitle: "\u5C55\u958B\u7528\u5909\u6570",
  genForbiddenBracketWarning: '\u5024\u306B "]" \u3092\u542B\u3081\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\uFF08\u751F\u6210\u3057\u305F\u69CB\u6587\u304C\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u5074\u3067\u6B63\u3057\u304F\u8AAD\u307F\u8FBC\u3081\u306A\u304F\u306A\u308A\u307E\u3059\uFF09\u3002\u53D6\u308A\u9664\u3044\u3066\u304F\u3060\u3055\u3044\u3002',
  genVarHintDefaultScalar: "\u5165\u529B\u3055\u308C\u305F\u5024\u304C\u305D\u306E\u307E\u307E\u7F6E\u304D\u63DB\u308F\u308A\u307E\u3059\u3002",
  genVarHintDefaultArray: '\u3059\u3079\u3066\u306E\u5024\u3092 "," \uFF08\u533A\u5207\u308A\u6587\u5B57\u306A\u3057\uFF09\u3067\u9023\u7D50\u3057\u307E\u3059\u3002',
  genVarHintList: 'Markdown \u30EA\u30B9\u30C8\u5F62\u5F0F\uFF08\u5404\u884C\u306E\u5148\u982D\u306B "- " \u3092\u4ED8\u3051\u3066\u5C55\u958B\uFF09\u3002',
  genVarHintNumbered: "\u756A\u53F7\u4ED8\u304D\u30EA\u30B9\u30C8\uFF081. 2. 3. \u2026\uFF09\u3068\u3057\u3066\u5C55\u958B\u3002",
  genVarHintSeparator: '\u3059\u3079\u3066\u306E\u5024\u3092 "; " \u3067\u9023\u7D50\u3057\u307E\u3059\u3002',
  genMetaFolderLabel: "\u30D5\u30A9\u30EB\u30C0",
  genMetaFilenameLabel: "\u30D5\u30A1\u30A4\u30EB\u540D",
  genMetaFolderHint: '\u30CE\u30FC\u30C8\u306E\u4FDD\u5B58\u5148\u3067\u3059\u3002\u56FA\u5B9A\u540D\uFF08\u4F8B: "Notes"\uFF09\u3001\u5909\u6570\uFF08\u4F8B: "$export$" \u3084 "%date%"\uFF09\u3001\u307E\u305F\u306F\u305D\u306E\u7D44\u307F\u5408\u308F\u305B\uFF08\u4F8B: "out_%date%"\uFF09\u3092\u5165\u529B\u3067\u304D\u307E\u3059\u3002',
  genMetaFilenameHint: '\u30D5\u30A1\u30A4\u30EB\u540D\uFF08".md" \u306F\u4E0D\u8981\uFF09\u3067\u3059\u3002\u30D5\u30A9\u30EB\u30C0\u3068\u540C\u69D8\u306B\u3001\u56FA\u5B9A\u6587\u5B57\u30FB\u5909\u6570\u30FB\u305D\u306E\u7D44\u307F\u5408\u308F\u305B\uFF08\u4F8B: "$title$-%timestamp%"\uFF09\u3092\u5165\u529B\u3067\u304D\u307E\u3059\u3002',
  genMetaInsertVariableLabel: "\u5909\u6570\u3092\u633F\u5165:",
  genMetaFolderTip: '\u30D2\u30F3\u30C8: \u56FA\u5B9A\u6587\u5B57\u3068\u5909\u6570\u3092\u7D44\u307F\u5408\u308F\u305B\u308B\uFF08\u4F8B: "out_%date%"\uFF09\u3068\u3001\u6574\u7406\u3057\u3084\u3059\u304F\u4E88\u6E2C\u3082\u3057\u3084\u3059\u3044\u30D5\u30A9\u30EB\u30C0\u69CB\u6210\u306B\u306A\u308A\u307E\u3059\u3002',
  genMetaFilenameOkTip: "\u5909\u6570\u304C\u542B\u307E\u308C\u3066\u3044\u308B\u305F\u3081\u3001\u65E2\u5B58\u30D5\u30A1\u30A4\u30EB\u3068\u306E\u91CD\u8907\u304C\u8D77\u304D\u306B\u304F\u304F\u306A\u3063\u3066\u3044\u307E\u3059\u3002",
  genMetaFilenameNoVariableWarning: "\u3053\u306E\u30D5\u30A1\u30A4\u30EB\u540D\u306F\u5B8C\u5168\u306B\u56FA\u5B9A\u6587\u5B57\u3060\u3051\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u540C\u3058\u30D5\u30A9\u30EB\u30C0\u306B\u540C\u540D\u306E\u30D5\u30A1\u30A4\u30EB\u304C\u65E2\u306B\u5B58\u5728\u3059\u308B\u5834\u5408\u3001\u30CE\u30FC\u30C8\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3059\u3002%date% \u3084 %timestamp%\u3001\u307E\u305F\u306F $title$ \u306E\u3088\u3046\u306A\u30D5\u30A9\u30FC\u30E0\u5909\u6570\u3092\u8FFD\u52A0\u3059\u308B\u3053\u3068\u3092\u304A\u3059\u3059\u3081\u3057\u307E\u3059\u3002",
  genWrapInBlockLabel: "formbuilder \u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u3092\u633F\u5165\u3059\u308B",
  genWrapInBlockHint: "\u751F\u6210\u3055\u308C\u308B\u69CB\u6587\u3092\u65B0\u3057\u3044 ```formbuilder \u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u3067\u56F2\u307F\u307E\u3059\u3002\u73FE\u5728\u30AB\u30FC\u30BD\u30EB\u306F\u30D6\u30ED\u30C3\u30AF\u306E\u5916\u306B\u3042\u308A\u307E\u3059\u3002",
  genCopySyntax: "\u69CB\u6587\u3092\u30B3\u30D4\u30FC",
  genCopyVariable: "\u5909\u6570\u3092\u30B3\u30D4\u30FC",
  genCopyBoth: "\u4E21\u65B9\u30B3\u30D4\u30FC",
  genInsert: "\u633F\u5165",
  genCancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
  genCopiedNotice: "Form Builder: \u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u306B\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002",
  genNoActiveEditor: "Form Builder: \u30A2\u30AF\u30C6\u30A3\u30D6\u306A\u30A8\u30C7\u30A3\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
  genInsertOutsideBlock: "formbuilder \u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u306E\u4E2D\u306B\u30AB\u30FC\u30BD\u30EB\u3092\u7F6E\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
  genInsertedNotice: "Form Builder: \u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u633F\u5165\u3057\u307E\u3057\u305F\u3002",
  // パーサー / バリデーターのメッセージ
  msgUnknownFieldType: '\u4E0D\u660E\u306A\u30D5\u30A3\u30FC\u30EB\u30C9\u30BF\u30A4\u30D7\u3067\u3059: "{type}"',
  msgInvalidKey: '\u4E0D\u6B63\u306A\u30AD\u30FC\u3067\u3059: "{key}"\u3002\u30AD\u30FC\u306B\u306F\u534A\u89D2\u82F1\u6570\u5B57\u30FB\u30A2\u30F3\u30C0\u30FC\u30B9\u30B3\u30A2\u30FB\u30CF\u30A4\u30D5\u30F3\u306E\u307F\u4F7F\u7528\u3067\u304D\u307E\u3059\u3002',
  msgFieldSyntaxTooShort: "\u30D5\u30A3\u30FC\u30EB\u30C9\u69CB\u6587\u306B\u306F\u30BF\u30A4\u30D7\u3068\u30AD\u30FC\u306E\u4E21\u65B9\u304C\u5FC5\u8981\u3067\u3059",
  msgCannotParseOptionToken: '\u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u89E3\u91C8\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F: "{token}"',
  msgUnknownOption: '\u4E0D\u660E\u306A\u30AA\u30D7\u30B7\u30E7\u30F3\u3067\u3059: \u30D5\u30A3\u30FC\u30EB\u30C9\u30BF\u30A4\u30D7 "{fieldType}" \u306B "{option}" \u3068\u3044\u3046\u30AA\u30D7\u30B7\u30E7\u30F3\u306F\u3042\u308A\u307E\u305B\u3093\u3002{hint}',
  msgUnknownOptionHint: ' \u3082\u3057\u304B\u3057\u3066 "{suggestion}" \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u304B\uFF1F',
  msgFieldRequiresList: '"{type}" \u306B\u306F "list" \u30AA\u30D7\u30B7\u30E7\u30F3\u304C\u5FC5\u9808\u3067\u3059\uFF08\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}"\uFF09',
  msgMinExceedsMax: '"min"\uFF08{min}\uFF09\u306F "max"\uFF08{max}\uFF09\u3092\u8D85\u3048\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\uFF08\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}"\uFF09',
  msgDefaultNotInList: '\u65E2\u5B9A\u5024 "{value}" \u306F\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}" \u306E list \u306B\u5B58\u5728\u3057\u307E\u305B\u3093',
  msgUnknownMetaKey: '\u4E0D\u660E\u306A meta \u30AD\u30FC\u3067\u3059: "{key}"',
  msgInvalidRows: '"rows" \u306E\u5024 "{value}" \u304C\u4E0D\u6B63\u3067\u3059\uFF08\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}"\uFF09\u30021\u4EE5\u4E0A\u306E\u6574\u6570\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: "5"\uFF09\u3002\u3053\u306E\u6307\u5B9A\u306F\u7121\u8996\u3055\u308C\u307E\u3059\u3002',
  msgInvalidNumericOption: '"{option}" \u306E\u5024 "{value}" \u304C\u4E0D\u6B63\u3067\u3059\uFF08\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}"\uFF09\u3002\u6570\u5024\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: "0"\u3001"3.5"\u3001"-1"\uFF09\u3002\u3053\u306E\u6307\u5B9A\u306F\u7121\u8996\u3055\u308C\u307E\u3059\u3002',
  msgDuplicateMetaKey: '"meta|{metaKey}" \u304C\u8907\u6570\u56DE\u5B9A\u7FA9\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u6700\u521D\u306E\u5B9A\u7FA9\u306F {firstLine} \u884C\u76EE\uFF09\u30021\u3064\u306E\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u306B\u3064\u304D "meta|{metaKey}" \u306F1\u3064\u307E\u3067\u3067\u3059\u3002',
  msgFlagOptionHasValue: '\u30AA\u30D7\u30B7\u30E7\u30F3 "{option}" \u306F\u5024\u3092\u6301\u3061\u307E\u305B\u3093\u3002\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}" \u306E "{option}=[{value}]" \u306F "{option}" \u306E\u307F\u304C\u6307\u5B9A\u3055\u308C\u305F\u3082\u306E\u3068\u3057\u3066\u6271\u308F\u308C\u307E\u3059\uFF08\u4EE3\u5165\u3055\u308C\u305F\u5024\u306F\u7121\u8996\u3055\u308C\u307E\u3059\uFF09',
  msgDuplicateOption: '\u30AA\u30D7\u30B7\u30E7\u30F3 "{option}" \u304C\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}" \u306B\u8907\u6570\u56DE\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u6700\u521D\u306E\u6307\u5B9A\u306E\u307F\u304C\u4F7F\u7528\u3055\u308C\u307E\u3059',
  msgRequiredNoEffectOnCheckbox: '"required" \u306F "checkbox" \u30D5\u30A3\u30FC\u30EB\u30C9\u306B\u306F\u52B9\u679C\u304C\u3042\u308A\u307E\u305B\u3093\uFF08checkbox \u306F\u5E38\u306B true/false \u3092\u9001\u4FE1\u3057\u307E\u3059\uFF09\u3002\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}"',
  msgUnclosedBrace: '{line} \u884C\u76EE\u3067 "{{" \u304C\u9589\u3058\u3089\u308C\u3066\u3044\u307E\u305B\u3093',
  msgDuplicateFieldKey: '\u30AD\u30FC "{key}" \u304C\u8907\u6570\u56DE\u5B9A\u7FA9\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u6700\u521D\u306E\u5B9A\u7FA9\u306F {firstLine} \u884C\u76EE\uFF09\u3002\u30D5\u30A3\u30FC\u30EB\u30C9\u30AD\u30FC\u306F\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u5185\u3067\u4E00\u610F\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002',
  msgModifierOnlyForArrayFields: 'Form Builder: \u30E2\u30C7\u30A3\u30D5\u30A1\u30A4\u30A2 ":{modifier}" \u306F "multilist" \u307E\u305F\u306F "multiselect" \u30D5\u30A3\u30FC\u30EB\u30C9\u3067\u306E\u307F\u6709\u52B9\u3067\u3059\u3002\u30D5\u30A3\u30FC\u30EB\u30C9 "{key}" \u3067\u306F\u7121\u8996\u3055\u308C\u307E\u3059\u3002',
  msgUnknownModifier: 'Form Builder: \u4E0D\u660E\u306A\u30E2\u30C7\u30A3\u30D5\u30A1\u30A4\u30A2\u3067\u3059: \u30D5\u30A3\u30FC\u30EB\u30C9 "{key}" \u306E ":{modifier}"\u3002\u4F7F\u7528\u3067\u304D\u308B\u30E2\u30C7\u30A3\u30D5\u30A1\u30A4\u30A2\u306F "separator" \u3068 "list" \u3067\u3059\u3002\u3053\u306E\u6307\u5B9A\u306F\u7121\u8996\u3055\u308C\u307E\u3059\u3002'
};
var LOCALES = { en, ja };
function getLocale(lang) {
  var _a;
  return (_a = LOCALES[lang]) != null ? _a : LOCALES["en"];
}

// src/settings.ts
var DEFAULT_SETTINGS = {
  templateFolder: "Templates",
  locale: "en",
  favorites: [],
  recentTemplates: [],
  lastTab: "folder"
};
function isValidLocale(value) {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LOCALE_LABELS, value);
}
function isValidTab(value) {
  return value === "folder" || value === "favorites" || value === "recent";
}
function toStringArray(value) {
  if (!Array.isArray(value))
    return [];
  return value.filter((v) => typeof v === "string");
}
function sanitizeSettings(raw) {
  const data = raw !== null && typeof raw === "object" ? raw : {};
  return {
    templateFolder: typeof data.templateFolder === "string" ? data.templateFolder : DEFAULT_SETTINGS.templateFolder,
    locale: isValidLocale(data.locale) ? data.locale : DEFAULT_SETTINGS.locale,
    favorites: toStringArray(data.favorites),
    recentTemplates: toStringArray(data.recentTemplates),
    lastTab: isValidTab(data.lastTab) ? data.lastTab : DEFAULT_SETTINGS.lastTab
  };
}
var FormBuilderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  // v1.13.0+ の宣言的設定 API。getSettingDefinitions() は設定タブが
  // 開かれるたび・update() が呼ばれるたびに再評価されるため、
  // name / desc に現在のロケール（L）の文字列をそのまま使えば
  // 言語切り替え時に全行を再描画できる … はずだったが、実際には
  // update() が既存の行の DOM を可能な限り再利用しようとする挙動があり、
  // 「変更操作を行った行自身（Language 行）」だけ name/desc が
  // 更新されないことを確認した（Obsidian フォーラムにも 1.13 系の
  // 宣言的設定 API で update() 後に行が正しく再構築されない、という
  // 趣旨の不具合報告が複数ある）。
  //
  // 対処として、setControlValue() 側で update() を呼ぶ前に
  // containerEl.empty() を挟み、再利用できる既存行を残さないようにする。
  // これはレガシー版の display()（毎回 containerEl.empty() してから
  // 全行を作り直す）と同じ考え方で、実際にレガシー版では発生しなかった
  // 挙動であることからも有効と判断した。
  getSettingDefinitions() {
    const L = getLocale(this.plugin.settings.locale);
    return [
      {
        name: L.settingFolderName,
        desc: L.settingFolderDesc,
        control: {
          type: "text",
          key: "templateFolder",
          placeholder: L.settingFolderPlaceholder
        }
      },
      {
        name: L.settingLanguageName,
        desc: L.settingLanguageDesc,
        control: {
          type: "dropdown",
          key: "locale",
          defaultValue: DEFAULT_SETTINGS.locale,
          options: LOCALE_LABELS
        }
      }
    ];
  }
  getControlValue(key) {
    if (key === "templateFolder")
      return this.plugin.settings.templateFolder;
    if (key === "locale")
      return this.plugin.settings.locale;
    return void 0;
  }
  async setControlValue(key, value) {
    if (key === "templateFolder") {
      this.plugin.settings.templateFolder = typeof value === "string" ? value.trim() : DEFAULT_SETTINGS.templateFolder;
    } else if (key === "locale") {
      this.plugin.settings.locale = isValidLocale(value) ? value : DEFAULT_SETTINGS.locale;
    } else {
      console.warn(`Form Builder: Unknown setting key "${key}"; ignoring.`);
      return;
    }
    await this.plugin.saveSettings();
    if (key === "locale") {
      this.containerEl.empty();
      this.update();
    }
  }
};

// src/form/FormModal.ts
var import_obsidian7 = require("obsidian");

// src/form/help.ts
var import_obsidian3 = require("obsidian");

// src/ui/MobileModal.ts
var import_obsidian2 = require("obsidian");
var KEYBOARD_PADDING_RATIO = 0.45;
function applyMobileModalBehavior(modal) {
  if (!import_obsidian2.Platform.isMobile)
    return;
  const { containerEl, modalEl, contentEl } = modal;
  containerEl.addClass("fb-modal-container-top");
  modalEl.addEventListener("click", (evt) => {
    const target = evt.target;
    if (target.closest("input, textarea, select, button, a, label"))
      return;
    const active = document.activeElement;
    if (active && contentEl.contains(active) && typeof active.blur === "function") {
      active.blur();
    }
  });
  contentEl.addEventListener("focusin", (evt) => {
    const target = evt.target;
    if (!target.matches("input, textarea, select"))
      return;
    contentEl.style.setProperty("padding-bottom", `${Math.round(window.innerHeight * KEYBOARD_PADDING_RATIO)}px`);
    const scrollToField = () => {
      const active = document.activeElement;
      if (active === target) {
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };
    window.setTimeout(scrollToField, 300);
    window.setTimeout(scrollToField, 450);
  });
  contentEl.addEventListener("focusout", () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (!active || !contentEl.contains(active) || !active.matches("input, textarea, select")) {
        contentEl.style.removeProperty("padding-bottom");
      }
    }, 50);
  });
}

// src/form/help.ts
var HelpModal = class extends import_obsidian3.Modal {
  constructor(app, locale) {
    super(app);
    this.locale = locale;
  }
  onOpen() {
    this.modalEl.addClass("fb-modal-root");
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
    applyMobileModalBehavior(this);
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

// src/form/FolderSuggestModal.ts
var import_obsidian4 = require("obsidian");
var FolderSuggestModal = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, currentValue, placeholder, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.startFolder = this.resolveStartFolder(currentValue);
    this.setPlaceholder(placeholder);
  }
  resolveStartFolder(currentValue) {
    const trimmed = currentValue.trim();
    if (!trimmed)
      return null;
    const folder = this.app.vault.getFolderByPath(trimmed);
    if (!folder || folder.isRoot())
      return null;
    return folder;
  }
  getItems() {
    if (this.startFolder) {
      return this.collectSubtree(this.startFolder);
    }
    return this.app.vault.getAllFolders(false);
  }
  getItemText(folder) {
    return folder.path;
  }
  onChooseItem(folder) {
    this.onChoose(folder);
  }
  /** startFolder 自身と、その配下のフォルダをすべて集める。 */
  collectSubtree(root) {
    const result = [root];
    for (const child of root.children) {
      if (child instanceof import_obsidian4.TFolder) {
        result.push(...this.collectSubtree(child));
      }
    }
    return result;
  }
};

// src/form/FieldRenderer.ts
function renderField(containerEl, field, values, ctx) {
  switch (field.type) {
    case "text":
      renderText(containerEl, field, values, ctx);
      break;
    case "textarea":
      renderTextarea(containerEl, field, values, ctx);
      break;
    case "number":
      renderNumber(containerEl, field, values, ctx);
      break;
    case "date":
      renderDate(containerEl, field, values, ctx);
      break;
    case "checkbox":
      renderCheckbox(containerEl, field, values, ctx);
      break;
    case "select":
      renderSelect(containerEl, field, values, ctx);
      break;
    case "multiselect":
      renderMultiselect(containerEl, field, values, ctx);
      break;
    case "multilist":
      renderList(containerEl, field, values, ctx);
      break;
    default: {
      const _exhaustive = field;
      console.warn("Form Builder: Unknown field type", _exhaustive.type);
    }
  }
}
function createCard(containerEl, field) {
  const card = containerEl.createDiv({ cls: "fb-field" });
  card.dataset.formKey = field.key;
  return card;
}
function fieldBaseId(ctx, field) {
  return `fb-f-${ctx.instanceId}-${field.key}`;
}
function appendLabelRow(card, field, baseId, labelFor) {
  var _a, _b;
  const labelRow = card.createDiv({ cls: "fb-label-row" });
  let legendId;
  if (labelFor) {
    const label = labelRow.createEl("label", { cls: "fb-label", text: (_a = field.label) != null ? _a : field.key });
    label.htmlFor = labelFor;
  } else {
    legendId = `${baseId}-legend`;
    labelRow.createSpan({ cls: "fb-label", text: (_b = field.label) != null ? _b : field.key, attr: { id: legendId } });
  }
  if (field.required) {
    labelRow.createSpan({ cls: "fb-required-mark", text: "*", attr: { "aria-hidden": "true" } });
  }
  let descId;
  if (field.description) {
    descId = `${baseId}-desc`;
    card.createDiv({ cls: "fb-desc", text: field.description, attr: { id: descId } });
  }
  return { descId, legendId };
}
function renderText(containerEl, field, values, ctx) {
  var _a, _b, _c;
  if (field.type !== "text")
    return;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  if (!field.folder) {
    const input2 = card.createEl("input", { cls: "fb-input" });
    input2.type = "text";
    input2.id = baseId;
    input2.value = (_b = field.default) != null ? _b : "";
    if (field.placeholder)
      input2.placeholder = field.placeholder;
    if (descId)
      input2.setAttribute("aria-describedby", descId);
    if (field.required)
      input2.setAttribute("aria-required", "true");
    input2.addEventListener("input", () => values.set(field.key, input2.value));
    return;
  }
  const row = card.createDiv({ cls: "fb-input-row" });
  const input = row.createEl("input", { cls: "fb-input" });
  input.type = "text";
  input.id = baseId;
  input.value = (_c = field.default) != null ? _c : "";
  if (field.placeholder)
    input.placeholder = field.placeholder;
  if (descId)
    input.setAttribute("aria-describedby", descId);
  if (field.required)
    input.setAttribute("aria-required", "true");
  input.addEventListener("input", () => values.set(field.key, input.value));
  const pickBtn = row.createEl("button", { cls: "fb-folder-picker-btn", text: "\u{1F4C1}" });
  pickBtn.type = "button";
  pickBtn.title = ctx.folderPickerBtnLabel;
  pickBtn.setAttribute("aria-label", ctx.folderPickerBtnLabel);
  pickBtn.addEventListener("click", () => {
    new FolderSuggestModal(ctx.app, input.value, ctx.folderPickerPlaceholder, (folder) => {
      input.value = folder.path;
      values.set(field.key, folder.path);
    }).open();
  });
}
function renderTextarea(containerEl, field, values, ctx) {
  var _a, _b;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  const textarea = card.createEl("textarea", { cls: "fb-textarea" });
  textarea.id = baseId;
  textarea.value = (_b = field.default) != null ? _b : "";
  if (field.placeholder)
    textarea.placeholder = field.placeholder;
  if (descId)
    textarea.setAttribute("aria-describedby", descId);
  if (field.required)
    textarea.setAttribute("aria-required", "true");
  const rows = field.rows;
  textarea.rows = rows && rows > 0 ? rows : 5;
  textarea.addEventListener("input", () => values.set(field.key, textarea.value));
}
function renderNumber(containerEl, field, values, ctx) {
  var _a;
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  const input = card.createEl("input", { cls: "fb-input" });
  input.type = "number";
  input.id = baseId;
  const nf = field;
  if (nf.min !== void 0)
    input.min = String(nf.min);
  if (nf.max !== void 0)
    input.max = String(nf.max);
  if (field.placeholder)
    input.placeholder = field.placeholder;
  if (descId)
    input.setAttribute("aria-describedby", descId);
  if (field.required)
    input.setAttribute("aria-required", "true");
  input.value = (_a = field.default) != null ? _a : "";
  values.set(field.key, input.value);
  input.addEventListener("input", () => values.set(field.key, input.value));
}
function renderDate(containerEl, field, values, ctx) {
  var _a;
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  const input = card.createEl("input", { cls: "fb-input" });
  input.type = "date";
  input.id = baseId;
  if (descId)
    input.setAttribute("aria-describedby", descId);
  if (field.required)
    input.setAttribute("aria-required", "true");
  input.value = (_a = field.default) != null ? _a : "";
  values.set(field.key, input.value);
  input.addEventListener("change", () => values.set(field.key, input.value));
}
function renderCheckbox(containerEl, field, values, ctx) {
  const initVal = field.default === "true";
  values.set(field.key, initVal);
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  const wrap = card.createDiv({ cls: "fb-toggle-wrap" });
  const toggleLabel = wrap.createEl("label", { cls: "fb-toggle" });
  const input = toggleLabel.createEl("input");
  input.type = "checkbox";
  input.id = baseId;
  input.checked = initVal;
  if (descId)
    input.setAttribute("aria-describedby", descId);
  toggleLabel.createDiv({ cls: "fb-toggle-track" });
  toggleLabel.createDiv({ cls: "fb-toggle-thumb" });
  input.addEventListener("change", () => values.set(field.key, input.checked));
}
function renderSelect(containerEl, field, values, ctx) {
  var _a;
  const sf = field;
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  const select = card.createEl("select", { cls: "fb-select" });
  select.id = baseId;
  if (descId)
    select.setAttribute("aria-describedby", descId);
  if (field.required)
    select.setAttribute("aria-required", "true");
  const emptyOpt = select.createEl("option");
  emptyOpt.value = "";
  emptyOpt.textContent = "---";
  for (const item of sf.list) {
    const opt = select.createEl("option");
    opt.value = item;
    opt.textContent = item;
  }
  const defaultVal = (_a = field.default) != null ? _a : "";
  select.value = defaultVal && sf.list.includes(defaultVal) ? defaultVal : "";
  values.set(field.key, select.value);
  select.addEventListener("change", () => values.set(field.key, select.value));
}
function renderMultiselect(containerEl, field, values, ctx) {
  var _a;
  if (field.type !== "multiselect")
    return;
  const defaultRaw = (_a = field.default) != null ? _a : "";
  const defaultItems = defaultRaw ? defaultRaw.split(";").map((s) => s.trim()).filter((s) => field.list.includes(s)) : [];
  const selected = new Set(defaultItems);
  values.set(field.key, [...selected]);
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId, legendId } = appendLabelRow(card, field, baseId, null);
  const chipGroup = card.createDiv({ cls: "fb-chip-group" });
  chipGroup.setAttribute("role", "group");
  if (legendId)
    chipGroup.setAttribute("aria-labelledby", legendId);
  if (descId)
    chipGroup.setAttribute("aria-describedby", descId);
  field.list.forEach((item, index) => {
    const chipWrap = chipGroup.createDiv({ cls: "fb-chip" });
    const id = `fb-chip-${ctx.instanceId}-${field.key}-${index}`;
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
  });
}
function renderList(containerEl, field, values, ctx) {
  var _a, _b;
  if (field.type !== "multilist")
    return;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const card = createCard(containerEl, field);
  const baseId = fieldBaseId(ctx, field);
  const { descId } = appendLabelRow(card, field, baseId, baseId);
  let hintDescId;
  if (!field.description) {
    hintDescId = `${baseId}-hint`;
    card.createDiv({ cls: "fb-desc", text: ctx.multilistHint, attr: { id: hintDescId } });
  }
  const textarea = card.createEl("textarea", { cls: "fb-textarea fb-list-input" });
  textarea.id = baseId;
  textarea.value = (_b = field.default) != null ? _b : "";
  if (field.placeholder)
    textarea.placeholder = field.placeholder;
  textarea.rows = field.rows && field.rows > 0 ? field.rows : 4;
  const effectiveDescId = descId != null ? descId : hintDescId;
  if (effectiveDescId)
    textarea.setAttribute("aria-describedby", effectiveDescId);
  if (field.required)
    textarea.setAttribute("aria-required", "true");
  textarea.addEventListener("input", () => values.set(field.key, textarea.value));
}
function validateNumberFields(containerEl, fields, values) {
  const errors = [];
  for (const field of fields) {
    if (field.type !== "number")
      continue;
    const raw = values.get(field.key);
    if (raw === void 0 || raw === "")
      continue;
    if (typeof raw !== "string")
      continue;
    const num = Number(raw);
    let reason = null;
    if (Number.isNaN(num)) {
      reason = "invalid";
    } else if (field.min !== void 0 && num < field.min) {
      reason = "min";
    } else if (field.max !== void 0 && num > field.max) {
      reason = "max";
    }
    if (reason) {
      errors.push({ key: field.key, reason });
      const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
      if (el)
        el.addClass("fb-error");
    }
  }
  return errors;
}
function highlightRequiredErrors(containerEl, fields, values) {
  containerEl.querySelectorAll(".fb-error").forEach((el) => el.removeClass("fb-error"));
  const missing = [];
  for (const field of fields) {
    if (!field.required)
      continue;
    const value = values.get(field.key);
    const isEmpty = field.type === "checkbox" ? false : field.type === "multilist" ? typeof value !== "string" || value.split("\n").map((l) => l.trim()).filter(Boolean).length === 0 : value === void 0 || value === "" || Array.isArray(value) && value.length === 0;
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
var import_obsidian6 = require("obsidian");

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
  const isNumbered = prefix.replace(/^[\s\u3000]+/, "").startsWith("1.");
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
function toStringArray2(value, field) {
  if (field.type === "multiselect") {
    return Array.isArray(value) ? value : [];
  }
  if (field.type === "multilist") {
    const raw = typeof value === "string" ? value : "";
    return raw.split("\n").map((l) => l.trim()).filter((l) => l !== "");
  }
  return [];
}
function resolveUserVariables(template, values, fields, L) {
  const fieldMap = new Map(fields.map((f) => [f.key, f]));
  const warnings = [];
  const result = template.replace(VARIABLE_RE, (match, key, modifier, modValue) => {
    const field = fieldMap.get(key);
    if (!field)
      return match;
    const value = values.get(key);
    if (!modifier) {
      if (isArrayField(field)) {
        return toStringArray2(value, field).join(",");
      }
      return formatScalarValue(value, field);
    }
    if (!isArrayField(field)) {
      const modName = modifier != null ? modifier : "";
      warnings.push({
        key,
        modifier: modName,
        message: formatMessage(L.msgModifierOnlyForArrayFields, { modifier: modName, key })
      });
      return formatScalarValue(value, field);
    }
    const arr = toStringArray2(value, field);
    if (modifier === "separator") {
      return applyModifierSeparator(arr, modValue != null ? modValue : "");
    }
    if (modifier === "list") {
      return applyModifierList(arr, modValue != null ? modValue : "");
    }
    const unknownMod = modifier != null ? modifier : "";
    warnings.push({
      key,
      modifier: unknownMod,
      message: formatMessage(L.msgUnknownModifier, { modifier: unknownMod, key })
    });
    return arr.join(",");
  });
  return { result, warnings };
}
function resolveSystemVariables(template, location) {
  const now = new Date();
  let result = template.split("%timestamp%").join(formatTimestamp(now)).split("%date%").join(formatDate(now)).split("%time%").join(formatTime(now));
  if (location) {
    result = result.split("%folder%").join(location.folder).split("%filename%").join(location.filename);
  }
  return result;
}

// src/ui/ErrorNotice.ts
var import_obsidian5 = require("obsidian");
var NOTICE_DURATION = 8e3;
function showFatalError(errors, header) {
  const messages = errors.map((e) => {
    const lineInfo = e.line ? ` (line ${e.line})` : "";
    return `\u2022 ${e.message}${lineInfo}`;
  }).join("\n");
  new import_obsidian5.Notice(`${header}
${messages}`, NOTICE_DURATION);
}

// src/generator/NoteGenerator.ts
var INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;
var WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
function sanitizeFileName(name, sanitizedNotice) {
  let sanitized = name.replace(INVALID_FILENAME_CHARS, "_");
  sanitized = Array.from(sanitized).filter((ch) => {
    var _a;
    const code = (_a = ch.codePointAt(0)) != null ? _a : 0;
    return code > 31;
  }).join("");
  if (WINDOWS_RESERVED_NAMES.test(sanitized)) {
    sanitized = "_" + sanitized;
  }
  sanitized = sanitized.replace(/[.\s]+$/, "");
  if (!sanitized)
    sanitized = "Untitled";
  if (sanitized !== name) {
    new import_obsidian6.Notice(sanitizedNotice);
  }
  return sanitized;
}
var INVALID_FOLDER_SEGMENT_CHARS = /[\\:*?"<>|]/g;
function sanitizeFolderPath(folderPath, folderSanitizedNotice) {
  if (!folderPath)
    return "";
  const rawSegments = folderPath.replace(/\\/g, "/").split("/");
  const segments = [];
  let changed = false;
  for (const rawSeg of rawSegments) {
    let seg = rawSeg.trim();
    if (seg !== rawSeg)
      changed = true;
    if (seg === "") {
      if (rawSeg !== "")
        changed = true;
      continue;
    }
    if (seg === "." || seg === "..") {
      seg = "_".repeat(seg.length);
      changed = true;
    }
    const noInvalidChars = seg.replace(INVALID_FOLDER_SEGMENT_CHARS, "_");
    if (noInvalidChars !== seg)
      changed = true;
    seg = noInvalidChars;
    const noControl = Array.from(seg).filter((ch) => {
      var _a;
      return ((_a = ch.codePointAt(0)) != null ? _a : 0) > 31;
    }).join("");
    if (noControl !== seg)
      changed = true;
    seg = noControl;
    const trimmedEnd = seg.replace(/[.\s]+$/, "");
    if (trimmedEnd !== seg)
      changed = true;
    seg = trimmedEnd;
    if (seg === "") {
      changed = true;
      continue;
    }
    if (WINDOWS_RESERVED_NAMES.test(seg)) {
      seg = "_" + seg;
      changed = true;
    }
    segments.push(seg);
  }
  const sanitized = segments.join("/");
  if (changed)
    new import_obsidian6.Notice(folderSanitizedNotice);
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
function resolveUniqueFilePath(app, folder, filenameWithExt) {
  const EXT = ".md";
  const base = filenameWithExt.endsWith(EXT) ? filenameWithExt.slice(0, -EXT.length) : filenameWithExt;
  let candidateName = filenameWithExt;
  let counter = 2;
  let renamed = false;
  for (let i = 0; i < 1e3; i++) {
    const path = folder ? (0, import_obsidian6.normalizePath)(`${folder}/${candidateName}`) : (0, import_obsidian6.normalizePath)(candidateName);
    if (!app.vault.getAbstractFileByPath(path)) {
      return { path, finalNameWithExt: candidateName, renamed };
    }
    candidateName = `${base} (${counter})${EXT}`;
    counter++;
    renamed = true;
  }
  const fallbackPath = folder ? (0, import_obsidian6.normalizePath)(`${folder}/${candidateName}`) : (0, import_obsidian6.normalizePath)(candidateName);
  return { path: fallbackPath, finalNameWithExt: candidateName, renamed };
}
async function generateNote(app, bodyTemplate, values, fields, meta, L) {
  var _a, _b;
  const rawFilename = (_a = meta.filename) != null ? _a : "Untitled";
  const { result: filename0 } = resolveUserVariables(rawFilename, values, fields, L);
  let resolvedFilename = resolveSystemVariables(filename0);
  resolvedFilename = sanitizeFileName(resolvedFilename, L.noticeSanitized);
  const rawFolder = (_b = meta.folder) != null ? _b : "";
  const { result: folder0 } = resolveUserVariables(rawFolder, values, fields, L);
  const expandedFolder = resolveSystemVariables(folder0);
  const resolvedFolder = sanitizeFolderPath(expandedFolder, L.noticeFolderSanitized);
  const filenameWithExt = resolvedFilename.endsWith(".md") ? resolvedFilename : `${resolvedFilename}.md`;
  await ensureFolder(app, resolvedFolder);
  const { path: filePath, finalNameWithExt, renamed } = resolveUniqueFilePath(app, resolvedFolder, filenameWithExt);
  const finalNameNoExt = finalNameWithExt.endsWith(".md") ? finalNameWithExt.slice(0, -3) : finalNameWithExt;
  const { result: content0, warnings: bodyWarnings } = resolveUserVariables(bodyTemplate, values, fields, L);
  const content = resolveSystemVariables(content0, { folder: resolvedFolder, filename: finalNameNoExt });
  for (const w of bodyWarnings) {
    new import_obsidian6.Notice(w.message, 6e3);
  }
  if (renamed) {
    new import_obsidian6.Notice(L.noticeDuplicateFilename.replace("{name}", finalNameWithExt), NOTICE_DURATION);
  }
  await app.vault.create(filePath, content);
  const file = app.vault.getFileByPath(filePath);
  if (file)
    await app.workspace.getLeaf().openFile(file);
}

// src/form/FormModal.ts
function openObsidianSettings(app) {
  app.setting.open();
}
var fbModalInstanceCounter = 0;
function generateInstanceId() {
  fbModalInstanceCounter++;
  return `fbm-${Date.now().toString(36)}-${fbModalInstanceCounter}`;
}
var FormModal = class extends import_obsidian7.Modal {
  constructor(app, parseResult, locale) {
    super(app);
    this.values = /* @__PURE__ */ new Map();
    this.instanceId = generateInstanceId();
    // Create Note の連打・多重クリックで generateNote() が並行実行されるのを防ぐフラグ
    // （CodeReview #2）。送信中は送信ボタンを disabled にし、完了後に解除する。
    this.isSubmitting = false;
    this.parseResult = parseResult;
    this.locale = locale;
  }
  onOpen() {
    this.modalEl.addClass("fb-modal-root");
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.formTitle);
    const root = contentEl.createDiv({ cls: "fb-modal" });
    this.renderWarnings(root);
    this.renderFields(root);
    this.renderSubmitButton(root, L.btnCreateNote);
    applyMobileModalBehavior(this);
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
    const ctx = {
      app: this.app,
      multilistHint: L.multilistHint,
      folderPickerBtnLabel: L.folderPickerBtnLabel,
      folderPickerPlaceholder: L.folderPickerPlaceholder,
      instanceId: this.instanceId
    };
    for (const field of this.parseResult.fields) {
      renderField(root, field, this.values, ctx);
    }
  }
  renderSubmitButton(root, label) {
    const wrap = root.createDiv({ cls: "fb-submit-wrap" });
    const btn = wrap.createEl("button", { cls: "fb-submit-btn", text: label });
    this.submitBtnEl = btn;
    btn.addEventListener("click", () => {
      void this.onSubmit();
    });
  }
  async onSubmit() {
    if (this.isSubmitting)
      return;
    const L = getLocale(this.locale);
    const root = this.contentEl.querySelector(".fb-modal");
    const missing = highlightRequiredErrors(root, this.parseResult.fields, this.values);
    const numberErrors = validateNumberFields(root, this.parseResult.fields, this.values);
    if (missing.length > 0)
      new import_obsidian7.Notice(L.noticeRequired);
    if (numberErrors.length > 0)
      new import_obsidian7.Notice(L.noticeInvalidNumber);
    if (missing.length > 0 || numberErrors.length > 0)
      return;
    this.isSubmitting = true;
    if (this.submitBtnEl)
      this.submitBtnEl.disabled = true;
    try {
      await generateNote(
        this.app,
        this.parseResult.bodyTemplate,
        this.values,
        this.parseResult.fields,
        this.parseResult.meta,
        L
      );
      this.close();
    } catch (e) {
      console.error("Form Builder: Failed to create note", e);
      const message = e instanceof Error ? e.message : String(e);
      new import_obsidian7.Notice(`${L.noticeCreateError}
${message}`, NOTICE_DURATION);
    } finally {
      this.isSubmitting = false;
      if (this.submitBtnEl)
        this.submitBtnEl.disabled = false;
    }
  }
};
var NoTemplateModal = class extends import_obsidian7.Modal {
  constructor(app, plugin, locale) {
    super(app);
    this.plugin = plugin;
    this.locale = locale;
  }
  onOpen() {
    this.modalEl.addClass("fb-modal-root");
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
      openObsidianSettings(this.app);
    });
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnClose }).addEventListener("click", () => this.close());
    applyMobileModalBehavior(this);
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/form/TemplatePickerModal.ts
var import_obsidian8 = require("obsidian");

// src/template/TemplateTreeBuilder.ts
function buildTemplateTree(rootPath, files, ascending = true) {
  const rootName = rootPath.split("/").pop() || rootPath;
  const root = { name: rootName, path: rootPath, children: [], files: [] };
  const nodeMap = /* @__PURE__ */ new Map();
  nodeMap.set(rootPath, root);
  function ensureNode(path) {
    const existing = nodeMap.get(path);
    if (existing)
      return existing;
    const lastSlash = path.lastIndexOf("/");
    const parentPath = lastSlash === -1 ? rootPath : path.slice(0, lastSlash);
    const parent = ensureNode(parentPath);
    const name = path.split("/").pop() || path;
    const node = { name, path, children: [], files: [] };
    parent.children.push(node);
    nodeMap.set(path, node);
    return node;
  }
  for (const file of files) {
    const folderPath = file.parent ? file.parent.path : rootPath;
    const node = folderPath === rootPath ? root : ensureNode(folderPath);
    node.files.push(file.path);
  }
  sortNode(root, ascending);
  return root;
}
function sortNode(node, ascending) {
  const dir = ascending ? 1 : -1;
  node.children.sort((a, b) => dir * a.name.localeCompare(b.name));
  node.files.sort((a, b) => dir * a.localeCompare(b));
  for (const child of node.children)
    sortNode(child, ascending);
}

// src/form/TemplatePickerModal.ts
var TemplatePickerModal = class extends import_obsidian8.Modal {
  constructor(app, plugin, allTemplates, templateFolderPath, locale, onSelect) {
    super(app);
    this.searchQuery = "";
    this.ascending = true;
    this.expandedFolders = /* @__PURE__ */ new Set();
    this.resetClearRecentConfirm = () => {
    };
    this.plugin = plugin;
    this.allTemplates = allTemplates;
    this.templateByPath = new Map(allTemplates.map((f) => [f.path, f]));
    this.templateFolderPath = templateFolderPath;
    this.locale = locale;
    this.onSelect = onSelect;
    this.activeTab = plugin.templateStore.getLastTab();
  }
  onOpen() {
    this.modalEl.addClass("fb-modal-root", "fb-picker-modal");
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.selectorTitle);
    const root = contentEl.createDiv({ cls: "fb-modal fb-picker" });
    this.renderSearchBox(root, L);
    this.tabBarEl = root.createDiv({ cls: "fb-tab-bar" });
    this.listContainer = root.createDiv({ cls: "fb-picker-list" });
    this.renderTabBar(L);
    this.renderList(L);
    const btnRow = root.createDiv({ cls: "fb-btn-row" });
    this.renderClearRecentButton(btnRow, L);
    this.renderSortToggle(btnRow, L);
    btnRow.createEl("button", { cls: "fb-btn", text: L.btnHelp }).addEventListener("click", () => new HelpModal(this.app, this.locale).open());
    this.updateActionButtons();
    applyMobileModalBehavior(this);
  }
  onClose() {
    this.contentEl.empty();
  }
  // ------------------------------------------------------------
  // 非同期保存失敗のハンドリング（CodeReview #13）
  // 以前は setLastTab / toggleFavorite / removeFavorite / removeRecent /
  // clearRecent / pushRecent の Promise を `void` で切り捨てる箇所が多く、
  // 失敗時に data.json と画面表示の状態が食い違ったり、無視された rejection が
  // 発生したりしていた。ここでは呼び出し側を async の private メソッドへ集約し、
  // 必ず try/catch で失敗を捕捉する。
  // ------------------------------------------------------------
  /** お気に入り・履歴削除など、ユーザーが明示的に行った操作の保存に失敗した場合に使う。
   *  データの信頼性に直接関わるため、コンソールログに加えて Notice でも知らせる。 */
  notifyStoreError(e) {
    console.error("Form Builder: Failed to save template picker state", e);
    new import_obsidian8.Notice(getLocale(this.locale).noticeStoreError);
  }
  async handleSetLastTab(tab) {
    try {
      await this.plugin.templateStore.setLastTab(tab);
    } catch (e) {
      console.error("Form Builder: Failed to save last tab", e);
    }
  }
  async handleClearRecent(L) {
    try {
      await this.plugin.templateStore.clearRecent();
      this.renderList(L);
    } catch (e) {
      this.notifyStoreError(e);
    }
  }
  async handleToggleFavorite(path, L) {
    try {
      await this.plugin.templateStore.toggleFavorite(path);
      this.renderList(L);
    } catch (e) {
      this.notifyStoreError(e);
    }
  }
  /** グレーアウトした「見つからない」項目を、表示中のタブに応じて実削除する。 */
  async handleRemoveMissingEntry(path, L) {
    try {
      if (this.activeTab === "favorites") {
        await this.plugin.templateStore.removeFavorite(path);
      } else if (this.activeTab === "recent") {
        await this.plugin.templateStore.removeRecent(path);
      }
      this.renderList(L);
    } catch (e) {
      this.notifyStoreError(e);
    }
  }
  // ------------------------------------------------------------
  // 検索ボックス（共通フィルター。入力時のみ「×」でクリアできる）
  // ------------------------------------------------------------
  renderSearchBox(root, L) {
    const wrap = root.createDiv({ cls: "fb-search-wrap" });
    this.searchInputEl = wrap.createEl("input", {
      cls: "fb-input fb-search-input",
      type: "text",
      placeholder: L.pickerSearchPlaceholder
    });
    this.searchInputEl.value = this.searchQuery;
    this.searchInputEl.addEventListener("input", () => {
      this.searchQuery = this.searchInputEl.value;
      this.updateSearchClearVisibility();
      this.renderList(L);
    });
    this.searchClearBtnEl = wrap.createEl("button", { cls: "fb-search-clear", text: "\xD7" });
    this.searchClearBtnEl.setAttribute("aria-label", L.pickerAriaClearSearch);
    this.searchClearBtnEl.addEventListener("click", () => {
      this.searchQuery = "";
      this.searchInputEl.value = "";
      this.updateSearchClearVisibility();
      this.searchInputEl.focus();
      this.renderList(L);
    });
    this.updateSearchClearVisibility();
  }
  updateSearchClearVisibility() {
    this.searchClearBtnEl.toggleClass("fb-search-clear--visible", this.searchQuery.length > 0);
  }
  // ------------------------------------------------------------
  // 昇順／降順トグル・使用履歴クリアボタン（？ヘルプボタンの左隣に常設）
  // ------------------------------------------------------------
  renderSortToggle(container, L) {
    const btn = container.createEl("button", {
      cls: "fb-sort-toggle",
      text: this.ascending ? L.sortAsc : L.sortDesc
    });
    this.sortToggleEl = btn;
    btn.addEventListener("click", () => {
      if (this.activeTab === "recent")
        return;
      this.ascending = !this.ascending;
      btn.textContent = this.ascending ? L.sortAsc : L.sortDesc;
      this.renderList(L);
    });
  }
  /** 使用履歴の全削除ボタン。誤操作防止のため、1回目のタップで確認表示にし、
   *  一定時間内に再度タップした場合のみ実際に削除する。使用履歴タブ以外では非表示にする。 */
  renderClearRecentButton(container, L) {
    const btn = container.createEl("button", { cls: "fb-sort-toggle", text: L.pickerClearRecent });
    this.clearRecentBtnEl = btn;
    let confirming = false;
    let revertTimer;
    const reset = () => {
      confirming = false;
      if (revertTimer !== void 0)
        window.clearTimeout(revertTimer);
      btn.textContent = L.pickerClearRecent;
      btn.removeClass("fb-clear-toggle--confirm");
    };
    this.resetClearRecentConfirm = reset;
    btn.addEventListener("click", () => {
      if (!confirming) {
        confirming = true;
        btn.textContent = L.pickerClearRecentConfirm;
        btn.addClass("fb-clear-toggle--confirm");
        revertTimer = window.setTimeout(reset, 3e3);
        return;
      }
      reset();
      void this.handleClearRecent(L);
    });
  }
  /** タブ切替のたびに呼び出し、昇順・降順ボタンの有効/無効と、
   *  使用履歴クリアボタンの表示/非表示を切り替える。 */
  updateActionButtons() {
    const isRecent = this.activeTab === "recent";
    this.sortToggleEl.disabled = isRecent;
    this.sortToggleEl.toggleClass("fb-sort-toggle--disabled", isRecent);
    this.clearRecentBtnEl.toggleClass("fb-hidden", !isRecent);
    if (!isRecent)
      this.resetClearRecentConfirm();
  }
  // ------------------------------------------------------------
  // タブバー
  // ------------------------------------------------------------
  renderTabBar(L) {
    this.tabBarEl.empty();
    const tabs = [
      { id: "folder", label: L.pickerTabFolder },
      { id: "favorites", label: L.pickerTabFavorites },
      { id: "recent", label: L.pickerTabRecent }
    ];
    for (const tab of tabs) {
      const btn = this.tabBarEl.createEl("button", {
        cls: this.activeTab === tab.id ? "fb-tab fb-tab-active" : "fb-tab",
        text: tab.label
      });
      btn.addEventListener("click", () => {
        if (this.activeTab === tab.id)
          return;
        this.activeTab = tab.id;
        void this.handleSetLastTab(tab.id);
        this.renderTabBar(L);
        this.updateActionButtons();
        this.renderList(L);
      });
    }
  }
  // ------------------------------------------------------------
  // コンテンツ（タブ切替時・検索時・ソート切替時に呼び出される）
  // ------------------------------------------------------------
  renderList(L) {
    this.listContainer.empty();
    switch (this.activeTab) {
      case "folder":
        this.renderFolderTab(L);
        break;
      case "favorites":
        this.renderFavoritesTab(L);
        break;
      case "recent":
        this.renderRecentTab(L);
        break;
    }
  }
  // ---- フォルダタブ ----
  renderFolderTab(L) {
    const dir = this.ascending ? 1 : -1;
    if (this.searchQuery) {
      const filtered = this.filterFiles(this.allTemplates).sort((a, b) => dir * this.displayName(a.path).localeCompare(this.displayName(b.path)));
      if (filtered.length === 0) {
        this.listContainer.createDiv({ cls: "fb-picker-empty", text: L.pickerNoResults });
        return;
      }
      const ul = this.listContainer.createEl("ul", { cls: "fb-template-list" });
      for (const file of filtered)
        this.renderTemplateButton(ul, file, this.displayName(file.path));
      return;
    }
    const tree = buildTemplateTree(this.templateFolderPath, this.allTemplates, this.ascending);
    this.renderFolderNode(this.listContainer, tree, true);
  }
  renderFolderNode(container, node, isRoot) {
    let body;
    if (isRoot) {
      body = container;
    } else {
      const expanded = this.expandedFolders.has(node.path);
      const header = container.createEl("button", { cls: "fb-folder-header" });
      header.type = "button";
      header.setAttribute("aria-expanded", expanded ? "true" : "false");
      header.createSpan({ cls: "fb-folder-icon", text: expanded ? "\u{1F4C2}" : "\u{1F4C1}", attr: { "aria-hidden": "true" } });
      header.createSpan({ cls: "fb-folder-name", text: node.name });
      header.addEventListener("click", () => {
        if (expanded)
          this.expandedFolders.delete(node.path);
        else
          this.expandedFolders.add(node.path);
        this.renderList(getLocale(this.locale));
      });
      if (!expanded)
        return;
      body = container.createDiv({ cls: "fb-folder-body" });
    }
    for (const child of node.children) {
      this.renderFolderNode(body, child, false);
    }
    if (node.files.length > 0) {
      const ul = body.createEl("ul", { cls: "fb-template-list" });
      for (const path of node.files) {
        const file = this.templateByPath.get(path);
        if (file)
          this.renderTemplateButton(ul, file);
      }
    }
  }
  // ---- お気に入りタブ ----
  renderFavoritesTab(L) {
    const entries = this.plugin.templateStore.annotate(this.app, this.plugin.templateStore.getFavorites());
    this.renderEntryList(entries, L, L.pickerNoFavorites, true);
  }
  // ---- 使用履歴タブ（使用順のため並び替え対象外） ----
  renderRecentTab(L) {
    const entries = this.plugin.templateStore.annotate(this.app, this.plugin.templateStore.getRecent());
    this.renderEntryList(entries, L, L.pickerNoRecent, false);
  }
  renderEntryList(entries, L, emptyMessage, sortable) {
    let filtered = this.filterEntries(entries);
    if (sortable) {
      const dir = this.ascending ? 1 : -1;
      filtered = [...filtered].sort((a, b) => dir * this.displayName(a.path).localeCompare(this.displayName(b.path)));
    }
    if (filtered.length === 0) {
      this.listContainer.createDiv({ cls: "fb-picker-empty", text: emptyMessage });
      return;
    }
    const ul = this.listContainer.createEl("ul", { cls: "fb-template-list" });
    for (const entry of filtered)
      this.renderEntryButton(ul, entry, L);
  }
  // ------------------------------------------------------------
  // 検索フィルター（共通）
  // ------------------------------------------------------------
  filterFiles(files) {
    if (!this.searchQuery)
      return files;
    const q = this.searchQuery.toLowerCase();
    return files.filter((f) => f.basename.toLowerCase().includes(q));
  }
  filterEntries(entries) {
    if (!this.searchQuery)
      return entries;
    const q = this.searchQuery.toLowerCase();
    return entries.filter((e) => this.displayName(e.path).toLowerCase().includes(q));
  }
  /** テンプレートフォルダ（templateFolderPath）を基準とした相対パスを表示名として返す（拡張子は除く）。
   *  例: templateFolder が "template" の場合
   *    template/charactor.md            → charactor
   *    template/item/item-a.md          → item/item-a
   *    template/item/case/item-b.md     → item/case/item-b
   *  お気に入り・使用履歴タブはフラット表示のため、この相対パスで区別しやすくする。 */
  displayName(path) {
    const noExt = path.endsWith(".md") ? path.slice(0, -3) : path;
    const root = this.templateFolderPath;
    if (root && noExt.startsWith(`${root}/`)) {
      return noExt.slice(root.length + 1);
    }
    return noExt.split("/").pop() || noExt;
  }
  // ------------------------------------------------------------
  // 1件分の項目描画
  // ------------------------------------------------------------
  /** フォルダタブ用（実体が必ず存在する TFile ベース）。
   *  label 省略時はファイル名のみ（ツリー表示時）、指定時はその文字列を表示する（検索時のフラット表示など）。 */
  renderTemplateButton(ul, file, label) {
    const li = ul.createEl("li");
    const row = li.createDiv({ cls: "fb-template-row" });
    const btn = row.createEl("button", { cls: "fb-template-btn" });
    btn.appendText(label != null ? label : file.basename);
    btn.addEventListener("click", () => this.selectTemplate(file));
    const favBtn = row.createEl("button", {
      cls: "fb-fav-toggle",
      text: this.plugin.templateStore.isFavorite(file.path) ? "\u2605" : "\u2606"
    });
    favBtn.setAttribute("aria-label", getLocale(this.locale).pickerAriaToggleFavorite);
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      void this.handleToggleFavorite(file.path, getLocale(this.locale));
    });
  }
  /** お気に入り／使用履歴タブ用（見つからない場合のグレーアウト表示に対応） */
  renderEntryButton(ul, entry, L) {
    const li = ul.createEl("li");
    const row = li.createDiv({
      cls: entry.isMissing ? "fb-template-row fb-template-missing" : "fb-template-row"
    });
    const btn = row.createEl("button", { cls: "fb-template-btn" });
    btn.appendText(this.displayName(entry.path));
    if (entry.isMissing) {
      btn.createSpan({ cls: "fb-missing-label", text: ` ${L.pickerMissingLabel}` });
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        const file = this.app.vault.getFileByPath(entry.path);
        if (file instanceof import_obsidian8.TFile)
          this.selectTemplate(file);
      });
    }
    const favBtn = row.createEl("button", {
      cls: "fb-fav-toggle",
      text: entry.isMissing ? "\u2715" : this.plugin.templateStore.isFavorite(entry.path) ? "\u2605" : "\u2606"
    });
    favBtn.setAttribute("aria-label", entry.isMissing ? L.pickerAriaRemove : L.pickerAriaToggleFavorite);
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (entry.isMissing) {
        void this.handleRemoveMissingEntry(entry.path, L);
      } else {
        void this.handleToggleFavorite(entry.path, L);
      }
    });
  }
  // ------------------------------------------------------------
  // テンプレート選択 → フォーム生成へ
  // ------------------------------------------------------------
  selectTemplate(file) {
    void this.handleSelectTemplate(file);
  }
  /**
   * テンプレート選択時に呼び出す。
   * `pushRecent()` を呼ぶタイミングは「テンプレート選択時」に統一する
   * （CodeReview #13 で議論、アルさんの判断により確定）。
   * 以前は `TemplateStore.pushRecent()` のコメント上「テンプレート生成成功時に呼ぶ」と
   * 書かれていたが、実装は選択時に呼んでおり契約とコードが一致していなかった。
   * また `pushRecent()` の失敗を `void` で握りつぶしていたため、履歴の保存に失敗しても
   * 利用者に気づく手段がなかった。
   * 履歴の保存に失敗しても、ノート作成というメインの操作自体は継続させる
   * （ここで処理を止めると、履歴保存の失敗のせいでノートを作成できなくなってしまう）。
   */
  async handleSelectTemplate(file) {
    this.close();
    try {
      await this.plugin.templateStore.pushRecent(file.path);
    } catch (e) {
      console.error("Form Builder: Failed to update recent templates", e);
      new import_obsidian8.Notice(getLocale(this.locale).noticeStoreError);
    }
    this.onSelect(file);
  }
};

// src/form/FieldGeneratorModal.ts
var import_obsidian9 = require("obsidian");

// src/generator/FieldSyntaxBuilder.ts
function createEmptyState() {
  return {
    key: "",
    label: "",
    description: "",
    required: false,
    placeholder: "",
    default: "",
    checked: false,
    rows: "",
    min: "",
    max: "",
    listRaw: "",
    folder: false
  };
}
function toSemicolonList(raw) {
  return raw.split("\n").map((s) => s.trim()).filter((s) => s !== "").join(";");
}
function hasPlaceholderOption(type) {
  return type === "text" || type === "textarea" || type === "number" || type === "date" || type === "multilist";
}
function hasRowsOption(type) {
  return type === "textarea" || type === "multiselect" || type === "multilist";
}
function containsForbiddenBracket(value) {
  return value.includes("]");
}
function stateHasForbiddenBracket(type, state) {
  const scalarValues = [state.label, state.description];
  if (hasPlaceholderOption(type))
    scalarValues.push(state.placeholder);
  if (type !== "checkbox" && type !== "multilist") {
    scalarValues.push(state.default);
  }
  if (type === "number") {
    scalarValues.push(state.min, state.max);
  }
  if (scalarValues.some((v) => containsForbiddenBracket(v)))
    return true;
  if (type === "select" || type === "multiselect") {
    const items = state.listRaw.split("\n").map((s) => s.trim()).filter((s) => s !== "");
    if (items.some((item) => containsForbiddenBracket(item)))
      return true;
  }
  return false;
}
function metaValueHasForbiddenBracket(rawValue) {
  return containsForbiddenBracket(rawValue.trim());
}
function buildOptions(type, state) {
  const opts = [];
  if (state.label.trim())
    opts.push({ key: "label", value: state.label.trim() });
  if (state.description.trim())
    opts.push({ key: "description", value: state.description.trim() });
  if (hasPlaceholderOption(type) && state.placeholder.trim()) {
    opts.push({ key: "placeholder", value: state.placeholder.trim() });
  }
  if (type === "checkbox") {
    if (state.checked)
      opts.push({ key: "default", value: "true" });
  } else if (type === "select" || type === "multiselect") {
    const list = toSemicolonList(state.listRaw);
    if (list)
      opts.push({ key: "list", value: list });
    if (state.default.trim())
      opts.push({ key: "default", value: state.default.trim() });
  } else if (type === "multilist") {
  } else {
    if (state.default.trim())
      opts.push({ key: "default", value: state.default.trim() });
  }
  if (hasRowsOption(type) && state.rows.trim()) {
    opts.push({ key: "rows", value: state.rows.trim() });
  }
  if (type === "number") {
    if (state.min.trim())
      opts.push({ key: "min", value: state.min.trim() });
    if (state.max.trim())
      opts.push({ key: "max", value: state.max.trim() });
  }
  if (type === "text" && state.folder)
    opts.push({ key: "folder", value: null });
  if (state.required)
    opts.push({ key: "required", value: null });
  return opts;
}
function buildFieldSyntax(type, state) {
  const key = state.key.trim();
  if (!key)
    return "";
  const opts = buildOptions(type, state);
  const tokens = [
    type,
    key,
    ...opts.map((o) => o.value === null ? o.key : `${o.key}=[${o.value}]`)
  ];
  return `{{${tokens.join("|")}}}`;
}
function buildVariableExamples(type, state, hints) {
  const key = state.key.trim();
  if (!key)
    return [];
  const examples = [
    { code: `$${key}$`, hint: hints.default }
  ];
  if (type === "multiselect" || type === "multilist") {
    examples.push({ code: `$${key}:list[- ]$`, hint: hints.list });
    examples.push({ code: `$${key}:list[1. ]$`, hint: hints.numbered });
    examples.push({ code: `$${key}:separator[; ]$`, hint: hints.separator });
  }
  return examples;
}
function buildVariableClipboardText(type, state, hints) {
  return buildVariableExamples(type, state, hints).map((e) => e.code).join("\n");
}
function buildMetaSyntax(kind, rawValue) {
  const value = rawValue.trim();
  if (!value)
    return "";
  return `{{meta|${kind}=[${value}]}}`;
}
function containsVariableToken(value) {
  return /\$[^$]+\$/.test(value) || /%[^%]+%/.test(value);
}
function wrapInFormbuilderBlock(syntax) {
  if (!syntax)
    return "";
  return "```formbuilder\n" + syntax + "\n```";
}

// src/form/FieldGeneratorModal.ts
var FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "date",
  "checkbox",
  "select",
  "multiselect",
  "multilist"
];
var VALID_KEY = /^[a-zA-Z0-9_-]+$/;
function isCursorInFormbuilderBlock(content, cursorLine) {
  const lines = content.split("\n");
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!inBlock && /^```formbuilder\s*$/.test(trimmed)) {
      inBlock = true;
      continue;
    }
    if (inBlock && /^```\s*$/.test(trimmed)) {
      inBlock = false;
      continue;
    }
    if (inBlock && i === cursorLine)
      return true;
  }
  return false;
}
var FieldGeneratorModal = class extends import_obsidian9.Modal {
  constructor(app, locale) {
    super(app);
    this.mode = "field";
    this.type = "text";
    this.state = createEmptyState();
    this.metaFolderValue = "";
    this.metaFilenameValue = "";
    // カーソルが既存の formbuilder ブロックの中にあるかどうか（モーダルを開いた時点で1回判定する）。
    // ブロックの外側にある場合のみ「formbuilder コードブロックを挿入する」チェックボックスを表示する。
    this.cursorInBlock = false;
    this.wrapInBlock = false;
    this.actionButtons = [];
    this.locale = locale;
  }
  onOpen() {
    this.modalEl.addClass("fb-modal-root");
    this.modalEl.addClass("fb-gen-modal");
    const { contentEl } = this;
    contentEl.empty();
    const L = getLocale(this.locale);
    this.setTitle(L.genModalTitle);
    this.cursorInBlock = this.detectCursorInBlock();
    const root = contentEl.createDiv({ cls: "fb-modal" });
    this.renderModeSelect(root);
    this.bodyEl = root.createDiv({ cls: "fb-gen-settings" });
    this.previewEl = root.createDiv({ cls: "fb-gen-preview" });
    this.sideEl = root.createDiv({ cls: "fb-gen-variables" });
    if (!this.cursorInBlock) {
      this.renderWrapToggle(root);
    }
    this.buttonsRowEl = root.createDiv({ cls: "fb-btn-row" });
    this.renderBody();
    this.renderButtons();
    this.updatePreview();
    applyMobileModalBehavior(this);
  }
  /** アクティブなエディタのカーソルが、既存の formbuilder ブロックの中にあるかどうかを判定する。 */
  detectCursorInBlock() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
    if (!view)
      return false;
    const editor = view.editor;
    return isCursorInFormbuilderBlock(editor.getValue(), editor.getCursor().line);
  }
  renderWrapToggle(root) {
    const L = getLocale(this.locale);
    this.addToggle(root, L.genWrapInBlockLabel, L.genWrapInBlockHint, this.wrapInBlock, (v) => {
      this.wrapInBlock = v;
      this.updatePreview();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
  // ---------------------------------------------------------------
  // Generator Type（Field / Meta: Folder / Meta: Filename）
  // ---------------------------------------------------------------
  renderModeSelect(root) {
    const L = getLocale(this.locale);
    const card = root.createDiv({ cls: "fb-field" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: L.genTypeLabel });
    const select = card.createEl("select", { cls: "fb-select" });
    const options = [
      ["field", L.genTypeField],
      ["meta-folder", L.genTypeMetaFolder],
      ["meta-filename", L.genTypeMetaFilename]
    ];
    for (const [value, label] of options) {
      const opt = select.createEl("option");
      opt.value = value;
      opt.textContent = label;
    }
    select.value = this.mode;
    select.addEventListener("change", () => {
      this.mode = select.value;
      this.renderBody();
      this.renderButtons();
      this.updatePreview();
    });
  }
  // ---------------------------------------------------------------
  // 本体（Field Type + 設定 / Meta 値入力）の出し分け
  // ---------------------------------------------------------------
  renderBody() {
    this.bodyEl.empty();
    if (this.mode === "field") {
      this.renderFieldTypeSelect(this.bodyEl);
      this.renderFieldSettings(this.bodyEl);
    } else {
      const kind = this.mode === "meta-folder" ? "folder" : "filename";
      this.renderMetaInput(this.bodyEl, kind);
    }
  }
  renderFieldTypeSelect(container) {
    var _a, _b;
    const L = getLocale(this.locale);
    const card = container.createDiv({ cls: "fb-field fb-gen-row" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: L.genFieldType });
    card.createDiv({ cls: "fb-desc", text: (_a = L.genFieldTypeHints[this.type]) != null ? _a : "" });
    const select = card.createEl("select", { cls: "fb-select" });
    for (const t of FIELD_TYPES) {
      const opt = select.createEl("option");
      opt.value = t;
      opt.textContent = (_b = L.genFieldTypeOptions[t]) != null ? _b : t;
    }
    select.value = this.type;
    select.addEventListener("change", () => {
      this.type = select.value;
      this.bodyEl.empty();
      this.renderFieldTypeSelect(this.bodyEl);
      this.renderFieldSettings(this.bodyEl);
      this.updatePreview();
    });
  }
  renderFieldSettings(container) {
    const L = getLocale(this.locale);
    this.keyInputEl = this.addTextInput(
      container,
      L.genKey,
      L.genKeyHint,
      this.state.key,
      true,
      (v) => {
        this.state.key = v;
        this.updatePreview();
      }
    );
    this.addTextInput(container, L.genLabel, L.genLabelHint, this.state.label, false, (v) => {
      this.state.label = v;
      this.updatePreview();
    });
    this.addTextInput(container, L.genDescription, L.genDescriptionHint, this.state.description, false, (v) => {
      this.state.description = v;
      this.updatePreview();
    });
    const hasPlaceholder = this.type === "text" || this.type === "textarea" || this.type === "number" || this.type === "date" || this.type === "multilist";
    if (hasPlaceholder) {
      this.addTextInput(container, L.genPlaceholder, L.genPlaceholderHint, this.state.placeholder, false, (v) => {
        this.state.placeholder = v;
        this.updatePreview();
      });
    }
    if (this.type === "checkbox") {
      this.addToggle(container, L.genDefaultChecked, L.genDefaultCheckedHint, this.state.checked, (v) => {
        this.state.checked = v;
        this.updatePreview();
      });
    } else if (this.type === "select") {
      this.addTextarea(container, L.genList, this.state.listRaw, L.genListHint, (v) => {
        this.state.listRaw = v;
        this.updatePreview();
      });
      this.addTextInput(container, L.genDefault, L.genDefaultHintSelect, this.state.default, false, (v) => {
        this.state.default = v;
        this.updatePreview();
      });
    } else if (this.type === "multiselect") {
      this.addTextarea(container, L.genList, this.state.listRaw, L.genListHint, (v) => {
        this.state.listRaw = v;
        this.updatePreview();
      });
      this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
        this.state.rows = v;
        this.updatePreview();
      });
      this.addTextInput(container, L.genDefault, L.genDefaultHintMultiselect, this.state.default, false, (v) => {
        this.state.default = v;
        this.updatePreview();
      });
    } else if (this.type === "multilist") {
      this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
        this.state.rows = v;
        this.updatePreview();
      });
    } else {
      this.addTextInput(container, L.genDefault, L.genDefaultHint, this.state.default, false, (v) => {
        this.state.default = v;
        this.updatePreview();
      });
      if (this.type === "textarea") {
        this.addTextInput(container, L.genRows, L.genRowsHint, this.state.rows, false, (v) => {
          this.state.rows = v;
          this.updatePreview();
        });
      }
      if (this.type === "text") {
        this.addToggle(container, L.genFolder, L.genFolderHint, this.state.folder, (v) => {
          this.state.folder = v;
          this.updatePreview();
        });
      }
    }
    if (this.type === "number") {
      this.addTextInput(container, L.genMin, L.genMinHint, this.state.min, false, (v) => {
        this.state.min = v;
        this.updatePreview();
      });
      this.addTextInput(container, L.genMax, L.genMaxHint, this.state.max, false, (v) => {
        this.state.max = v;
        this.updatePreview();
      });
    }
    if (this.type !== "checkbox") {
      this.addToggle(container, L.genRequired, L.genRequiredHint, this.state.required, (v) => {
        this.state.required = v;
        this.updatePreview();
      });
    }
  }
  // ---------------------------------------------------------------
  // Meta（folder / filename）入力
  // ---------------------------------------------------------------
  renderMetaInput(container, kind) {
    const L = getLocale(this.locale);
    const label = kind === "folder" ? L.genMetaFolderLabel : L.genMetaFilenameLabel;
    const hint = kind === "folder" ? L.genMetaFolderHint : L.genMetaFilenameHint;
    const value = kind === "folder" ? this.metaFolderValue : this.metaFilenameValue;
    const card = container.createDiv({ cls: "fb-field fb-gen-row" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: label });
    card.createDiv({ cls: "fb-desc", text: hint });
    const input = card.createEl("input", { cls: "fb-input" });
    input.type = "text";
    input.value = value;
    input.addEventListener("input", () => {
      if (kind === "folder")
        this.metaFolderValue = input.value;
      else
        this.metaFilenameValue = input.value;
      this.updatePreview();
    });
    const insertRow = card.createDiv({ cls: "fb-gen-var-insert-row" });
    insertRow.createSpan({ cls: "fb-desc", text: L.genMetaInsertVariableLabel });
    const tokens = ["%date%", "%time%", "%timestamp%", "$key$"];
    for (const token of tokens) {
      const btn = insertRow.createEl("button", { cls: "fb-btn fb-btn-chip", text: token });
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        this.insertTokenAtCursor(input, token, kind);
      });
    }
  }
  insertTokenAtCursor(input, token, kind) {
    var _a, _b;
    const start = (_a = input.selectionStart) != null ? _a : input.value.length;
    const end = (_b = input.selectionEnd) != null ? _b : input.value.length;
    const newValue = input.value.slice(0, start) + token + input.value.slice(end);
    input.value = newValue;
    if (kind === "folder")
      this.metaFolderValue = newValue;
    else
      this.metaFilenameValue = newValue;
    const newPos = start + token.length;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    this.updatePreview();
  }
  // ---------------------------------------------------------------
  // 入力ヘルパー（既存 FieldRenderer と同じクラス名を再利用し見た目を統一）
  // ---------------------------------------------------------------
  addTextInput(container, label, hint, value, required, onInput) {
    const card = container.createDiv({ cls: "fb-field fb-gen-row" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: label });
    if (required)
      labelRow.createSpan({ cls: "fb-required-mark", text: "*" });
    if (hint)
      card.createDiv({ cls: "fb-desc", text: hint });
    const input = card.createEl("input", { cls: "fb-input" });
    input.type = "text";
    input.value = value;
    input.addEventListener("input", () => onInput(input.value));
    return input;
  }
  addTextarea(container, label, value, hint, onInput) {
    const card = container.createDiv({ cls: "fb-field fb-gen-row" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: label });
    card.createDiv({ cls: "fb-desc", text: hint });
    const textarea = card.createEl("textarea", { cls: "fb-textarea" });
    textarea.value = value;
    textarea.rows = 4;
    textarea.addEventListener("input", () => onInput(textarea.value));
  }
  addToggle(container, label, hint, checked, onChange) {
    const card = container.createDiv({ cls: "fb-field fb-gen-row" });
    const labelRow = card.createDiv({ cls: "fb-label-row" });
    labelRow.createSpan({ cls: "fb-label", text: label });
    if (hint)
      card.createDiv({ cls: "fb-desc", text: hint });
    const wrap = card.createDiv({ cls: "fb-toggle-wrap" });
    const toggleLabel = wrap.createEl("label", { cls: "fb-toggle" });
    const input = toggleLabel.createEl("input");
    input.type = "checkbox";
    input.checked = checked;
    toggleLabel.createDiv({ cls: "fb-toggle-track" });
    toggleLabel.createDiv({ cls: "fb-toggle-thumb" });
    input.addEventListener("change", () => onChange(input.checked));
  }
  // ---------------------------------------------------------------
  // Preview / 補助パネル（入力のたびにリアルタイム更新）
  // ---------------------------------------------------------------
  currentSyntax() {
    if (this.mode === "field") {
      const key = this.state.key.trim();
      const keyValid = key !== "" && VALID_KEY.test(key);
      return keyValid ? buildFieldSyntax(this.type, this.state) : "";
    }
    const kind = this.mode === "meta-folder" ? "folder" : "filename";
    const value = this.mode === "meta-folder" ? this.metaFolderValue : this.metaFilenameValue;
    return buildMetaSyntax(kind, value);
  }
  /**
   * 実際にコピー・挿入される構文。
   * 「formbuilder コードブロックを挿入する」がオンの場合は ```formbuilder で囲む。
   * このチェックボックスはカーソルがブロック外のときにしか表示されないため、
   * オンになっている時点でラップして問題ない。
   */
  renderedSyntax() {
    const raw = this.currentSyntax();
    if (!raw)
      return "";
    return this.wrapInBlock ? wrapInFormbuilderBlock(raw) : raw;
  }
  updatePreview() {
    const L = getLocale(this.locale);
    let enabled = false;
    let forbiddenBracket = false;
    if (this.mode === "field") {
      const key = this.state.key.trim();
      const keyValid = key !== "" && VALID_KEY.test(key);
      forbiddenBracket = stateHasForbiddenBracket(this.type, this.state);
      enabled = keyValid && !forbiddenBracket;
      if (this.keyInputEl)
        this.keyInputEl.toggleClass("fb-error", key !== "" && !keyValid);
    } else {
      const value = this.mode === "meta-folder" ? this.metaFolderValue : this.metaFilenameValue;
      forbiddenBracket = metaValueHasForbiddenBracket(value);
      enabled = this.currentSyntax() !== "" && !forbiddenBracket;
    }
    const syntax = forbiddenBracket ? "" : this.renderedSyntax();
    this.previewEl.empty();
    this.previewEl.createDiv({ cls: "fb-label", text: L.genPreviewTitle });
    if (forbiddenBracket) {
      const block = this.previewEl.createDiv({ cls: "fb-warning-block" });
      block.createDiv({ cls: "fb-warning", text: `\u26A0 ${L.genForbiddenBracketWarning}` });
    }
    this.previewEl.createEl("pre", { cls: "fb-example-block fb-gen-code" }).createEl("code", { text: syntax || "\u2014" });
    this.renderSidePanel(syntax, enabled);
    for (const btn of this.actionButtons) {
      btn.toggleAttribute("disabled", !enabled);
    }
  }
  variableHints(L) {
    const isArray = this.type === "multiselect" || this.type === "multilist";
    return {
      default: isArray ? L.genVarHintDefaultArray : L.genVarHintDefaultScalar,
      list: L.genVarHintList,
      numbered: L.genVarHintNumbered,
      separator: L.genVarHintSeparator
    };
  }
  renderSidePanel(syntax, enabled) {
    const L = getLocale(this.locale);
    this.sideEl.empty();
    if (this.mode === "field") {
      this.sideEl.createDiv({ cls: "fb-label", text: L.genVariableTitle });
      const examples = enabled ? buildVariableExamples(this.type, this.state, this.variableHints(L)) : [];
      if (examples.length === 0) {
        this.sideEl.createEl("pre", { cls: "fb-example-block fb-gen-code" }).createEl("code", { text: "\u2014" });
      } else {
        for (const ex of examples) {
          const row = this.sideEl.createDiv({ cls: "fb-gen-var-row" });
          row.createEl("code", { cls: "fb-gen-var-code", text: ex.code });
          row.createSpan({ cls: "fb-desc", text: ex.hint });
        }
      }
      return;
    }
    if (this.mode === "meta-folder") {
      this.sideEl.createDiv({ cls: "fb-desc", text: L.genMetaFolderTip });
      return;
    }
    const value = this.metaFilenameValue.trim();
    if (value === "")
      return;
    if (!containsVariableToken(value)) {
      const block = this.sideEl.createDiv({ cls: "fb-warning-block" });
      block.createDiv({ cls: "fb-warning", text: L.genMetaFilenameNoVariableWarning });
    } else {
      this.sideEl.createDiv({ cls: "fb-desc", text: L.genMetaFilenameOkTip });
    }
  }
  // ---------------------------------------------------------------
  // ボタン（モードに応じて Copy Variable / Copy Both の有無を出し分け）
  // ---------------------------------------------------------------
  renderButtons() {
    const L = getLocale(this.locale);
    this.buttonsRowEl.empty();
    this.actionButtons = [];
    const copySyntaxBtn = this.buttonsRowEl.createEl("button", { cls: "fb-btn", text: L.genCopySyntax });
    copySyntaxBtn.addEventListener("click", () => {
      void this.copyToClipboard(this.renderedSyntax(), L);
    });
    this.actionButtons.push(copySyntaxBtn);
    if (this.mode === "field") {
      const copyVarBtn = this.buttonsRowEl.createEl("button", { cls: "fb-btn", text: L.genCopyVariable });
      copyVarBtn.addEventListener("click", () => {
        const variableText = buildVariableClipboardText(this.type, this.state, this.variableHints(L));
        void this.copyToClipboard(variableText, L);
      });
      this.actionButtons.push(copyVarBtn);
      const copyBothBtn = this.buttonsRowEl.createEl("button", { cls: "fb-btn", text: L.genCopyBoth });
      copyBothBtn.addEventListener("click", () => {
        const variableText = buildVariableClipboardText(this.type, this.state, this.variableHints(L));
        void this.copyToClipboard(`${this.renderedSyntax()}
${variableText}`, L);
      });
      this.actionButtons.push(copyBothBtn);
    }
    const insertBtn = this.buttonsRowEl.createEl("button", { cls: "fb-btn fb-btn-accent", text: L.genInsert });
    insertBtn.addEventListener("click", () => this.handleInsert(L));
    this.actionButtons.push(insertBtn);
    const cancelBtn = this.buttonsRowEl.createEl("button", { cls: "fb-btn", text: L.genCancel });
    cancelBtn.addEventListener("click", () => this.close());
  }
  async copyToClipboard(text, L) {
    if (!text)
      return;
    try {
      await navigator.clipboard.writeText(text);
      new import_obsidian9.Notice(L.genCopiedNotice);
    } catch (e) {
      console.error("Form Builder: Failed to copy to clipboard", e);
      new import_obsidian9.Notice(L.noticeCreateError, NOTICE_DURATION);
    }
  }
  handleInsert(L) {
    const raw = this.currentSyntax();
    if (!raw)
      return;
    const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
    if (!view) {
      new import_obsidian9.Notice(L.genNoActiveEditor);
      return;
    }
    const editor = view.editor;
    if (this.wrapInBlock) {
      editor.replaceRange(wrapInFormbuilderBlock(raw), editor.getCursor());
      new import_obsidian9.Notice(L.genInsertedNotice);
      this.close();
      return;
    }
    const cursor = editor.getCursor();
    const content = editor.getValue();
    if (!isCursorInFormbuilderBlock(content, cursor.line)) {
      new import_obsidian9.Notice(L.genInsertOutsideBlock);
      return;
    }
    editor.replaceRange(raw, cursor);
    new import_obsidian9.Notice(L.genInsertedNotice);
    this.close();
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
  text: ["required", "label", "placeholder", "description", "default", "folder"],
  textarea: ["required", "label", "placeholder", "description", "default", "rows"],
  number: ["required", "label", "placeholder", "description", "default", "min", "max"],
  date: ["required", "label", "placeholder", "description", "default"],
  checkbox: ["required", "label", "description", "default"],
  select: ["required", "label", "description", "default", "list"],
  multiselect: ["required", "label", "description", "default", "list", "rows"],
  multilist: ["required", "label", "placeholder", "description", "default", "rows"]
};
var VALID_KEY2 = /^[a-zA-Z0-9_-]+$/;
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
function validateFieldType(type, L, line) {
  if (!KNOWN_FIELD_TYPES.has(type)) {
    return { message: formatMessage(L.msgUnknownFieldType, { type }), line };
  }
  return null;
}
function validateKey(key, L, line) {
  if (!VALID_KEY2.test(key)) {
    return { message: formatMessage(L.msgInvalidKey, { key }), line };
  }
  return null;
}
function validateOptionName(optionName, fieldType, L, line) {
  var _a;
  const known = (_a = KNOWN_FIELD_OPTIONS[fieldType]) != null ? _a : [];
  if (!known.includes(optionName)) {
    const suggestion = suggestOption(optionName, known);
    const hint = suggestion ? formatMessage(L.msgUnknownOptionHint, { suggestion }) : "";
    return {
      message: formatMessage(L.msgUnknownOption, { option: optionName, fieldType, hint }),
      line
    };
  }
  return null;
}
function validateField(field, L, line) {
  const errors = [];
  const warnings = [];
  if (field.type === "select" || field.type === "multiselect") {
    const f = field;
    if (!f.list || f.list.length === 0) {
      errors.push({
        message: formatMessage(L.msgFieldRequiresList, { type: field.type, key: field.key }),
        line
      });
    }
  }
  if (field.type === "number") {
    const { min, max } = field;
    if (min !== void 0 && max !== void 0 && min > max) {
      errors.push({
        message: formatMessage(L.msgMinExceedsMax, { min, max, key: field.key }),
        line
      });
    }
  }
  if (field.type === "multiselect" && field.default && field.list) {
    for (const dv of field.default.split(";").map((s) => s.trim())) {
      if (!field.list.includes(dv)) {
        warnings.push({
          message: formatMessage(L.msgDefaultNotInList, { value: dv, key: field.key }),
          line
        });
      }
    }
  }
  if (field.type === "select" && field.default && field.list) {
    if (field.default !== "" && !field.list.includes(field.default)) {
      warnings.push({
        message: formatMessage(L.msgDefaultNotInList, { value: field.default, key: field.key }),
        line
      });
    }
  }
  return { errors, warnings };
}
var KNOWN_META_KEYS = /* @__PURE__ */ new Set(["folder", "filename"]);
function validateMetaKey(key, L, line) {
  if (!KNOWN_META_KEYS.has(key)) {
    return { message: formatMessage(L.msgUnknownMetaKey, { key }), line };
  }
  return null;
}

// src/parser/TemplateParser.ts
var FORMBUILDER_BLOCK_RE = /^```formbuilder\s*\r?\n([\s\S]*?)\r?\n```/m;
var FIELD_SYNTAX_RE = /^\{\{([\s\S]*?)\}\}$/;
var KV_OPTION_RE = /^([a-zA-Z_-]+)=\[([^\]]*)\]$/;
var FLAG_ONLY_OPTIONS = /* @__PURE__ */ new Set(["required", "folder"]);
function trimSpaces(s) {
  return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}
function parseList(raw) {
  return raw.split(";").map((item) => trimSpaces(item)).filter((item) => item !== "");
}
var ROWS_OPTION_RE = /^[1-9]\d*$/;
var NUMERIC_OPTION_RE = /^-?\d+(\.\d+)?$/;
function parseRows(rawStr, key, lineNum, warnings, L) {
  if (rawStr == null || rawStr === "")
    return void 0;
  if (!ROWS_OPTION_RE.test(rawStr)) {
    warnings.push({
      message: formatMessage(L.msgInvalidRows, { value: rawStr, key }),
      line: lineNum
    });
    return void 0;
  }
  return parseInt(rawStr, 10);
}
function parseNumericOption(rawStr, optionName, key, lineNum, warnings, L) {
  if (rawStr == null || rawStr === "")
    return void 0;
  if (!NUMERIC_OPTION_RE.test(rawStr)) {
    warnings.push({
      message: formatMessage(L.msgInvalidNumericOption, { option: optionName, value: rawStr, key }),
      line: lineNum
    });
    return void 0;
  }
  return Number(rawStr);
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
function parseMetaLine(tokens, meta, metaKeyLines, errors, warnings, lineNum, L) {
  for (let i = 1; i < tokens.length; i++) {
    const opt = parseOptionToken(tokens[i]);
    if (!opt)
      continue;
    const metaWarning = validateMetaKey(opt.key, L, lineNum);
    if (metaWarning) {
      warnings.push(metaWarning);
      continue;
    }
    if (opt.value === null)
      continue;
    const firstLine = metaKeyLines.get(opt.key);
    if (firstLine !== void 0) {
      errors.push({
        message: formatMessage(L.msgDuplicateMetaKey, { metaKey: opt.key, firstLine }),
        line: lineNum
      });
      continue;
    }
    metaKeyLines.set(opt.key, lineNum);
    if (opt.key === "folder")
      meta.folder = opt.value;
    else if (opt.key === "filename")
      meta.filename = opt.value;
  }
}
function parseFieldLine(tokens, errors, warnings, lineNum, L) {
  var _a, _b, _c, _d;
  if (tokens.length < 2) {
    errors.push({ message: L.msgFieldSyntaxTooShort, line: lineNum });
    return null;
  }
  const type = tokens[0];
  const key = tokens[1];
  const typeError = validateFieldType(type, L, lineNum);
  if (typeError) {
    errors.push(typeError);
    return null;
  }
  const keyError = validateKey(key, L, lineNum);
  if (keyError) {
    errors.push(keyError);
    return null;
  }
  const optMap = /* @__PURE__ */ new Map();
  for (let i = 2; i < tokens.length; i++) {
    const opt = parseOptionToken(tokens[i]);
    if (!opt) {
      warnings.push({
        message: formatMessage(L.msgCannotParseOptionToken, { token: tokens[i] }),
        line: lineNum
      });
      continue;
    }
    const optWarning = validateOptionName(opt.key, type, L, lineNum);
    if (optWarning) {
      warnings.push(optWarning);
      continue;
    }
    if (FLAG_ONLY_OPTIONS.has(opt.key) && opt.value !== null) {
      warnings.push({
        message: formatMessage(L.msgFlagOptionHasValue, { option: opt.key, value: opt.value, key }),
        line: lineNum
      });
      opt.value = null;
    }
    if (optMap.has(opt.key)) {
      warnings.push({
        message: formatMessage(L.msgDuplicateOption, { option: opt.key, key }),
        line: lineNum
      });
      continue;
    }
    optMap.set(opt.key, opt.value);
  }
  const base = {
    key,
    label: optMap.has("label") ? (_a = optMap.get("label")) != null ? _a : void 0 : void 0,
    placeholder: optMap.has("placeholder") ? (_b = optMap.get("placeholder")) != null ? _b : void 0 : void 0,
    description: optMap.has("description") ? (_c = optMap.get("description")) != null ? _c : void 0 : void 0,
    default: optMap.has("default") ? (_d = optMap.get("default")) != null ? _d : void 0 : void 0,
    required: optMap.has("required")
  };
  if (type === "checkbox" && base.required) {
    warnings.push({
      message: formatMessage(L.msgRequiredNoEffectOnCheckbox, { key }),
      line: lineNum
    });
  }
  switch (type) {
    case "text":
      return { type: "text", ...base, folder: optMap.has("folder") };
    case "textarea": {
      const rows = parseRows(optMap.get("rows"), key, lineNum, warnings, L);
      return { type: "textarea", ...base, ...rows !== void 0 && { rows } };
    }
    case "number": {
      const min = parseNumericOption(optMap.get("min"), "min", key, lineNum, warnings, L);
      const max = parseNumericOption(optMap.get("max"), "max", key, lineNum, warnings, L);
      return { type: "number", ...base, min, max };
    }
    case "date":
      return { type: "date", ...base };
    case "checkbox":
      return { type: "checkbox", ...base };
    case "select": {
      const listRaw = optMap.get("list");
      if (listRaw == null) {
        errors.push({
          message: formatMessage(L.msgFieldRequiresList, { type: "select", key }),
          line: lineNum
        });
        return null;
      }
      return { type: "select", ...base, list: parseList(listRaw) };
    }
    case "multiselect": {
      const listRaw = optMap.get("list");
      if (listRaw == null) {
        errors.push({
          message: formatMessage(L.msgFieldRequiresList, { type: "multiselect", key }),
          line: lineNum
        });
        return null;
      }
      const list = parseList(listRaw);
      const rows = parseRows(optMap.get("rows"), key, lineNum, warnings, L);
      const msField = { type: "multiselect", ...base, list };
      if (rows !== void 0)
        msField.rows = rows;
      return msField;
    }
    case "multilist": {
      const rows = parseRows(optMap.get("rows"), key, lineNum, warnings, L);
      const lf = { type: "multilist", ...base };
      if (rows !== void 0)
        lf.rows = rows;
      return lf;
    }
    default:
      errors.push({ message: formatMessage(L.msgUnknownFieldType, { type }), line: lineNum });
      return null;
  }
}
function findFormbuilderBlocks(templateContent) {
  const re = new RegExp(FORMBUILDER_BLOCK_RE.source, "gm");
  const matches = [];
  let m;
  while ((m = re.exec(templateContent)) !== null) {
    matches.push(m);
    if (m[0].length === 0)
      re.lastIndex++;
  }
  return matches;
}
function lineNumberAt(templateContent, index) {
  var _a;
  return ((_a = templateContent.slice(0, index).match(/\n/g)) != null ? _a : []).length + 1;
}
function parseTemplate(templateContent, L) {
  var _a, _b;
  const errors = [];
  const warnings = [];
  const meta = {};
  const fields = [];
  const metaKeyLines = /* @__PURE__ */ new Map();
  const fieldKeyLines = /* @__PURE__ */ new Map();
  const blockMatches = findFormbuilderBlocks(templateContent);
  if (blockMatches.length === 0) {
    return { meta, fields, bodyTemplate: templateContent, errors, warnings };
  }
  for (const blockMatch of blockMatches) {
    const blockContent = blockMatch[1];
    const blockStartLine = lineNumberAt(templateContent, blockMatch.index) + 1;
    const lines = blockContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = blockStartLine + i;
      if (line === "")
        continue;
      const openCount = ((_a = line.match(/\{\{/g)) != null ? _a : []).length;
      const closeCount = ((_b = line.match(/\}\}/g)) != null ? _b : []).length;
      if (openCount !== closeCount) {
        errors.push({ message: formatMessage(L.msgUnclosedBrace, { line: lineNum }), line: lineNum });
        continue;
      }
      const syntaxMatch = FIELD_SYNTAX_RE.exec(line);
      if (!syntaxMatch)
        continue;
      const tokens = splitTokens(syntaxMatch[1]);
      if (tokens.length === 0 || tokens[0] === "")
        continue;
      if (tokens[0] === "meta") {
        parseMetaLine(tokens, meta, metaKeyLines, errors, warnings, lineNum, L);
      } else {
        const field = parseFieldLine(tokens, errors, warnings, lineNum, L);
        if (field) {
          const vr = validateField(field, L, lineNum);
          errors.push(...vr.errors);
          warnings.push(...vr.warnings);
          if (vr.errors.length === 0) {
            const firstLine = fieldKeyLines.get(field.key);
            if (firstLine !== void 0) {
              errors.push({
                message: formatMessage(L.msgDuplicateFieldKey, { key: field.key, firstLine }),
                line: lineNum
              });
            } else {
              fieldKeyLines.set(field.key, lineNum);
              fields.push(field);
            }
          }
        }
      }
    }
  }
  let bodyTemplate = templateContent;
  for (let i = blockMatches.length - 1; i >= 0; i--) {
    const blockMatch = blockMatches[i];
    const start = blockMatch.index;
    const end = start + blockMatch[0].length;
    const removeEnd = bodyTemplate[end] === "\n" ? end + 1 : end;
    bodyTemplate = bodyTemplate.slice(0, start) + bodyTemplate.slice(removeEnd);
  }
  bodyTemplate = bodyTemplate.replace(/^\n+/, "");
  return { meta, fields, bodyTemplate, errors, warnings };
}

// src/template/TemplateScanner.ts
var import_obsidian10 = require("obsidian");
async function collectTemplateFiles(vault, folder) {
  const result = [];
  for (const child of folder.children) {
    if (child instanceof import_obsidian10.TFolder) {
      const nested = await collectTemplateFiles(vault, child);
      result.push(...nested);
    } else if (child instanceof import_obsidian10.TFile && child.extension === "md") {
      try {
        const content = await vault.read(child);
        if (FORMBUILDER_BLOCK_RE.test(content)) {
          result.push(child);
        }
      } catch (e) {
      }
    }
  }
  return result;
}

// src/template/TemplateStore.ts
var MAX_RECENT = 20;
var TemplateStore = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  // ------------------------------------------------------------
  // お気に入り
  // ------------------------------------------------------------
  getFavorites() {
    return [...this.plugin.settings.favorites];
  }
  isFavorite(path) {
    return this.plugin.settings.favorites.includes(path);
  }
  async toggleFavorite(path) {
    const favorites = this.plugin.settings.favorites;
    const idx = favorites.indexOf(path);
    if (idx === -1) {
      favorites.push(path);
    } else {
      favorites.splice(idx, 1);
    }
    await this.plugin.saveSettings();
  }
  /** グレーアウトした「見つからない」項目をユーザーが手動で削除する場合に使用する。 */
  async removeFavorite(path) {
    const favorites = this.plugin.settings.favorites;
    const idx = favorites.indexOf(path);
    if (idx !== -1) {
      favorites.splice(idx, 1);
      await this.plugin.saveSettings();
    }
  }
  // ------------------------------------------------------------
  // 最近使った
  // ------------------------------------------------------------
  getRecent() {
    return [...this.plugin.settings.recentTemplates];
  }
  /** テンプレート選択時に呼び出す（CodeReview #13 で契約を明確化。
   *  「テンプレート生成成功時」ではなく「選択時」に統一する）。
   *  重複は先頭へ移動し、最大件数を超えたら古いものを切り詰める。 */
  async pushRecent(path) {
    const recent = this.plugin.settings.recentTemplates;
    const existing = recent.indexOf(path);
    if (existing !== -1)
      recent.splice(existing, 1);
    recent.unshift(path);
    if (recent.length > MAX_RECENT)
      recent.length = MAX_RECENT;
    await this.plugin.saveSettings();
  }
  async removeRecent(path) {
    const recent = this.plugin.settings.recentTemplates;
    const idx = recent.indexOf(path);
    if (idx !== -1) {
      recent.splice(idx, 1);
      await this.plugin.saveSettings();
    }
  }
  /** 使用履歴をすべて削除する。 */
  async clearRecent() {
    if (this.plugin.settings.recentTemplates.length === 0)
      return;
    this.plugin.settings.recentTemplates.length = 0;
    await this.plugin.saveSettings();
  }
  // ------------------------------------------------------------
  // 最後に開いていたタブ
  // ------------------------------------------------------------
  getLastTab() {
    return this.plugin.settings.lastTab;
  }
  async setLastTab(tab) {
    if (this.plugin.settings.lastTab === tab)
      return;
    this.plugin.settings.lastTab = tab;
    await this.plugin.saveSettings();
  }
  // ------------------------------------------------------------
  // リネーム追従（Obsidian 内でのファイル移動・リネームをリアルタイムに反映）
  // ------------------------------------------------------------
  async handleRename(oldPath, newPath) {
    let changed = false;
    const favorites = this.plugin.settings.favorites;
    const favIdx = favorites.indexOf(oldPath);
    if (favIdx !== -1) {
      favorites[favIdx] = newPath;
      changed = true;
    }
    const recent = this.plugin.settings.recentTemplates;
    const recentIdx = recent.indexOf(oldPath);
    if (recentIdx !== -1) {
      recent[recentIdx] = newPath;
      changed = true;
    }
    if (changed)
      await this.plugin.saveSettings();
  }
  // ------------------------------------------------------------
  // 存在チェック（表示用の安全網。PCエクスプローラー等での変更・削除を検知する）
  // ------------------------------------------------------------
  isMissing(app, path) {
    return app.vault.getFileByPath(path) === null;
  }
  annotate(app, paths) {
    return paths.map((path) => ({ path, isMissing: this.isMissing(app, path) }));
  }
};

// src/main.ts
var FormBuilderPlugin = class extends import_obsidian11.Plugin {
  onload() {
    void this.loadSettings().then(() => {
      this.templateStore = new TemplateStore(this);
      this.addSettingTab(new FormBuilderSettingTab(this.app, this));
      this.addCommand({
        id: "create-note-from-template",
        name: "Create Note From Template",
        callback: () => {
          void this.openTemplatePicker();
        }
      });
      this.addCommand({
        id: "insert-field",
        name: "Syntax Generator",
        callback: () => {
          new FieldGeneratorModal(this.app, this.settings.locale).open();
        }
      });
      this.registerEvent(
        this.app.vault.on("rename", (file, oldPath) => {
          if (file instanceof import_obsidian11.TFile && file.extension === "md") {
            void this.templateStore.handleRename(oldPath, file.path);
          }
        })
      );
    }).catch((e) => {
      var _a, _b;
      console.error("Form Builder: Failed to initialize the plugin", e);
      const locale = (_b = (_a = this.settings) == null ? void 0 : _a.locale) != null ? _b : DEFAULT_SETTINGS.locale;
      new import_obsidian11.Notice(getLocale(locale).noticeInitError);
    });
  }
  onunload() {
  }
  async openTemplatePicker() {
    const { templateFolder, locale } = this.settings;
    const folder = this.app.vault.getFolderByPath(templateFolder);
    if (!folder) {
      new NoTemplateModal(this.app, this, locale).open();
      return;
    }
    const templates = await collectTemplateFiles(this.app.vault, folder);
    if (templates.length === 0) {
      new NoTemplateModal(this.app, this, locale).open();
      return;
    }
    if (templates.length === 1) {
      await this.openFormForTemplate(templates[0]);
    } else {
      new TemplatePickerModal(this.app, this, templates, folder.path, locale, (file) => {
        void this.openFormForTemplate(file);
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
      new import_obsidian11.Notice(`${L.noticeReadError}
"${file.path}"`);
      return;
    }
    const parseResult = parseTemplate(content, L);
    if (parseResult.errors.length > 0) {
      showFatalError(parseResult.errors, L.noticeFatalHeader);
      return;
    }
    new FormModal(this.app, parseResult, locale).open();
  }
  async loadSettings() {
    let raw;
    try {
      raw = await this.loadData();
    } catch (e) {
      console.error("Form Builder: Failed to read settings data; falling back to defaults.", e);
      raw = void 0;
    }
    this.settings = sanitizeSettings(raw);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
