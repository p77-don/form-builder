# Form Builder

An Obsidian plugin that automatically generates input forms from Markdown templates and creates new notes populated with the form data.

---

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Basic Usage](#basic-usage)
4. [Template Structure](#template-structure)
5. [FormBuilder Syntax Reference](#formbuilder-syntax-reference)
   - [Basic Syntax](#basic-syntax)
   - [meta Syntax](#meta-syntax)
   - [Field Syntax](#field-syntax)
   - [Field Types](#field-types)
   - [Options Reference](#options-reference)
   - [Variables](#variables)
   - [Variable Modifiers](#variable-modifiers)
6. [Errors and Warnings](#errors-and-warnings)
7. [Template Examples](#template-examples)
8. [FAQ](#faq)


 日本語版READMEは [こちら](#目次)

---

## Installation

### Install from Community Plugins (Recommended)

1. Open **Settings → Community Plugins** in Obsidian
2. If you haven't already, turn off **Restricted Mode**
3. Click **Browse** and search for `Form Builder`
4. Select **Form Builder** and click **Install**
5. After installation, click **Enable**

### Manual Installation

1. Download the latest `main.js`, `manifest.json`, and `styles.css` from [Releases](https://github.com/p77-don/form-builder/releases)
2. Place all three files in the following folder inside your vault:

```
{vault}/.obsidian/plugins/form-builder/
├── main.js
├── manifest.json
└── styles.css
```

3. Enable **Form Builder** under **Settings → Community Plugins**

---

## Setup

### Template Folder

Go to **Settings → Form Builder → Template folder** and enter the name of the folder where your template files will be stored.

```
Templates
```

The default is `Templates`. Only Markdown files inside this folder that contain a `formbuilder` code block will be recognized as templates.

### Language

Under **Settings → Form Builder → Language**, you can switch the display language for the entire plugin.

| Option | Description |
|---|---|
| English | English (default) |
| 日本語 | Japanese |

Changing this setting instantly updates the settings screen, forms, help text, and all notification messages.

---

## Basic Usage

1. Create a Markdown file containing a `formbuilder` code block in your template folder
2. Open the command palette (`Ctrl` / `Cmd` + `P`) and run **Create Note From Template**
3. If multiple templates exist, select one from the list (ascending/descending sort toggle available)
4. Fill in the form and click **Create Note**
5. A new note is created in the folder specified by `meta` and automatically opened

---

## Template Structure

A template file consists of two areas: the **form definition area** and the **body area**.

````markdown
---
(Frontmatter: subject to variable expansion)
---

```formbuilder
(Form definition)
```

(Body: subject to variable expansion)
````

### Form Definition Area

Written exclusively inside the ` ```formbuilder ` code block.
Contains field definitions and output settings (`meta`).
This block is not included in the generated note — it is automatically removed.

### Body Area

Everything outside the code block is subject to variable expansion:

- Frontmatter
- Regular text, headings, lists, tables, blockquotes, HTML

Write `$keyName$` in the body to substitute it with the corresponding form input value.
For `multiselect` / `multilist` fields, use **variable modifiers** to control the output format. See [Variable Modifiers](#variable-modifiers) for details.

> **Variable delimiter differences:**
> User variables are wrapped in dollar signs (`$...$`), while system variables are wrapped in percent signs (`%...%`). This distinction is intentional.

---

## FormBuilder Syntax Reference

### Basic Syntax

All syntax is wrapped in `{{` and `}}`.

```
{{type|key}}
{{type|key|option=[value]}}
{{type|key|option=[value]|option2=[value2]}}
```

#### Whitespace Handling

Half-width and full-width spaces around `{{`, `}}`, and `|` are ignored.
The following are all treated identically:

```
{{text|name}}
{{ text | name }}
{{ text | name | required }}
```

#### Valid Characters for Keys

```
a-z  A-Z  0-9  _  -
```

The following characters cannot be used in keys: `| { } [ ] $ % space (half-width or full-width)`

Keys are case-sensitive (`name` and `Name` are different keys).

#### Option Value Format

Values must be wrapped in `[]`.

```
label=[Title]
placeholder=[Enter your name]
min=[0]
max=[200]
```

All characters inside `[]` are used as-is, including spaces.

```
placeholder=[ leading space ]
→ value is " leading space "
```

---

### meta Syntax

Defines global settings for the template. These are not displayed in the form — they are referenced when the note is saved.

```
{{meta|key=[value]}}
```

#### meta|folder

Specifies the folder where the note will be saved.

**Fixed folder:**

```
{{meta|folder=[Notes]}}
{{meta|folder=[Projects/2026]}}
```

The note is always saved to the specified folder. If the folder does not exist, it is created automatically (including nested paths). If omitted, the note is saved to the vault root.

**User-specified folder via form input:**

Use `$keyName$` in `folder` and define a corresponding field separately.

```
{{meta|folder=[$export$]}}
{{text|export|label=[Output Folder]|default=[Notes]}}
```

An "Output Folder" input field appears in the form, allowing the user to specify the destination at runtime. It is recommended to set an initial value with `default=[Notes]`.

#### meta|filename

Specifies the filename for the generated note (the `.md` extension is added automatically).

```
{{meta|filename=[my-note]}}
{{meta|filename=[$title$-%timestamp%]}}
{{meta|filename=[Report_%date%]}}
```

- Use `$keyName$` to incorporate form input values
- System variables such as `%timestamp%`, `%date%`, and `%time%` are supported
- System variables are evaluated at the moment the note is saved
- Characters not allowed in filenames (`/ \ : * ? " < > |`) are automatically replaced with `_`
- Windows reserved device names (`CON`, `NUL`, `COM1`, etc.) are prefixed with `_`
- If omitted, the filename defaults to `Untitled.md`

#### Unknown meta Keys

If an undefined key is specified, a warning is shown and the key is ignored. Form generation continues.

---

### Field Syntax

Defines the input fields displayed in the form.

```
{{type|key}}
{{type|key|option=[value]}}
{{type|key|option1=[value1]|option2=[value2]|flag}}
```

**Positional argument order:**

1. `type` (field type) — required
2. `key` (variable name) — required
3. Options follow in any order

---

### Field Types

#### `text` — Single-line Text Input

```
{{text|name}}
{{text|name|label=[Name]|placeholder=[John Doe]|required}}
```

Displays a single-line text input field in the form.

**Available options:** `label` `placeholder` `description` `default` `required`

**Output example:**

```
Template body: Author: $name$
Input value:   John Doe
Output:        Author: John Doe
```

---

#### `textarea` — Multi-line Text Input

```
{{textarea|description}}
{{textarea|description|label=[Description]|rows=[8]|placeholder=[Write details...]}}
```

Displays a multi-line text input field in the form.

**Available options:** `label` `placeholder` `description` `default` `required` `rows`

**Output example:** The entered content is expanded as-is (line breaks are preserved).

---

#### `number` — Number Input

```
{{number|price}}
{{number|price|label=[Price]|min=[0]|max=[999999]|default=[0]}}
```

Displays a numeric input field in the form. Specifying `min` / `max` restricts the acceptable input range.

**Available options:** `label` `placeholder` `description` `default` `required` `min` `max`

**Error condition:** If `min > max`, a fatal error occurs and form generation is aborted.

**Output example:**

```
Template body: Price: $price$
Input value:   1500
Output:        Price: 1500
```

---

#### `date` — Date Input

```
{{date|birthday}}
{{date|birthday|label=[Birthday]|default=[2000-01-01]}}
```

Displays a date picker in the form.

**Available options:** `label` `description` `default` `required`

**Output example:**

```
Template body: Date: $birthday$
Input value:   2000-01-01
Output:        Date: 2000-01-01
```

---

#### `checkbox` — Toggle (Boolean)

```
{{checkbox|published}}
{{checkbox|published|label=[Publish]|default=[true]}}
```

Displays a toggle switch in the form.

**Available options:** `label` `description` `default`

- `default=[true]` sets the initial state to on (enabled)
- `required` has no effect on `checkbox` (the off state is also a valid value)

**Output example:**

```
When on:  true
When off: false
```

---

#### `select` — Single Selection

```
{{select|status|list=[Todo;In Progress;Done]}}
{{select|status|label=[Status]|list=[Todo;In Progress;Done]|default=[Todo]}}
```

Displays a dropdown list in the form.
The `list` option is required — omitting it causes a fatal error.

**Available options:** `label` `description` `default` `required` `list`

**`list` format:**

Separate options with semicolons (`;`). Spaces immediately before or after a semicolon are automatically trimmed; spaces within an option are preserved.

```
list=[Todo;In Progress;Done]
list=[ Todo ; In Progress ; Done ]   → same result (surrounding spaces trimmed)
list=[I am a boy;I am a girl]        → two items: "I am a boy" and "I am a girl"
```

**Note on `default`:** If the `default` value does not exist in `list`, a warning is shown and the field is left with no selection.

**Output example:**

```
Template body: Status: $status$
Selected:      In Progress
Output:        Status: In Progress
```

---

#### `multiselect` — Multiple Selection

```
{{multiselect|tags|list=[Important;Pending;Done]}}
{{multiselect|tags|label=[Tags]|list=[Important;Pending;Done]|default=[Important;Done]}}
```

Displays a checkbox-based multiple selection UI in the form.
The `list` option is required — omitting it causes a fatal error.

**Available options:** `label` `description` `default` `required` `list` `rows`

**Multiple defaults:** Specify multiple default values separated by semicolons.

```
{{multiselect|tags|list=[Important;Pending;Done]|default=[Important;Done]}}
```

**Output format control:**

The output format is specified using **variable modifiers** in the body, not in the field definition.
If no modifier is used (`$tags$`), selected values are joined with commas only (no spaces).

```
$tags$               → Important,Done
$tags:separator[, ]$ → Important, Done
$tags:list[- ]$      → - Important\n- Done
```

See [Variable Modifiers](#variable-modifiers) for details.

---

#### `multilist` — Free-form Multiple Value Input

```
{{multilist|aliases}}
{{multilist|aliases|label=[Aliases]|rows=[5]}}
```

Displays a multi-line text input field where **one item is entered per line**. Empty lines are automatically removed on save.

Unlike `select` and `multiselect`, no predefined options are required — users can enter any values freely. This is ideal for cases like Frontmatter `aliases`, where multiple arbitrary strings need to be registered.

**Available options:** `label` `placeholder` `description` `default` `required` `rows`

**Output format control:**

Like `multiselect`, the output format is specified using **variable modifiers** in the body.
If no modifier is used (`$aliases$`), values are joined with commas only (no spaces).

```
$aliases$               → Tokyo Office,Osaka Office,HQ
$aliases:separator[, ]$ → Tokyo Office, Osaka Office, HQ
$aliases:list[- ]$      → - Tokyo Office\n- Osaka Office\n- HQ
```

See [Variable Modifiers](#variable-modifiers) for details.

---

### Options Reference

| Option | Value Format | Applicable Fields | Description |
|---|---|---|---|
| `label=[text]` | string | all fields | Label displayed in the form. Defaults to the key name if omitted |
| `required` | flag (no value) | all fields | Marks the field as required. Blocks submission and highlights the field if left empty |
| `placeholder=[...]` | string | text / textarea / number / multilist | Hint text shown inside the input field |
| `description=[...]` | string | all fields | Descriptive text displayed below the label |
| `default=[value]` | string | all fields | Initial value when the form is displayed |
| `list=[A;B;C]` | semicolon-delimited string | select / multiselect | List of options (required for these types) |
| `min=[number]` | number | number | Minimum acceptable value |
| `max=[number]` | number | number | Maximum acceptable value |
| `rows=[count]` | integer | textarea / multiselect / multilist | Number of visible rows |

---

### Variables

#### User Variables vs System Variables

Form Builder has two types of variables, distinguished by their **delimiter symbols**.

| Type | Format | Evaluated |
|---|---|---|
| User variable | `$keyName$` (dollar sign) | Form input value |
| System variable | `%variableName%` (percent sign) | At the moment the note is saved |

#### User Variables

Reference form input values. Can be used in the template body, Frontmatter, and in `meta`'s `filename` / `folder`.

```
$keyName$
$title$
$author$
$status$
```

Key names may only contain `[a-zA-Z0-9_-]`. Keys are case-sensitive.

Variables present in the body that have no corresponding field definition (`$undefined_key$`) are output as-is — no error is raised.

**Default expansion for `multiselect` / `multilist`:**

When expanded without a modifier (`$key$`), selected/entered values are joined with commas only (no spaces).

```
Selected values: Important, Done (2 items)
$tags$ → Important,Done
```

To change the output format, use [Variable Modifiers](#variable-modifiers).

#### System Variables

Variables provided by the plugin. All are evaluated **when the note is saved**.

| Variable | Description | Example output |
|---|---|---|
| `%timestamp%` | Save timestamp (yyyyMMddHHmmss) | `20260626153000` |
| `%date%` | Save date | `2026-06-26` |
| `%time%` | Save time | `15:30:00` |

> **Note:** System variables are evaluated at the moment **the Create Note button is clicked**, not when the form is opened.

#### Variable Expansion Scope

| Location | User Variables | System Variables |
|---|---|---|
| Frontmatter | ✅ | ✅ |
| Body (headings, lists, tables, etc.) | ✅ | ✅ |
| `meta\|filename` | ✅ | ✅ |
| `meta\|folder` | ✅ | ✅ |
| Inside `formbuilder` block | ❌ (processed as form definition) | ❌ |

#### Mixing User and System Variables

```
{{meta|filename=[$title$-%timestamp%]}}
```

If `$title$` is set to "Meeting Notes" when saving:

```
Meeting Notes-20260626153000.md
```

---

### Variable Modifiers

`multiselect` / `multilist` fields hold array values. When expanding them in the body, modifiers let you control the output format.

#### Basic Syntax

```
$key$                        No modifier (comma-joined, no spaces)
$key:separator[delimiter]$   Join with a custom delimiter
$key:list[prefix]$           Prefix each item and join with line breaks
```

If a modifier is used on a field type other than `multiselect` / `multilist`, a warning is shown and the modifier is ignored.

#### `separator` Modifier

The string inside `[]` is used as the delimiter exactly as written, including spaces.

```
$tags:separator[,]$      → Important,Pending,Done
$tags:separator[, ]$     → Important, Pending, Done
$tags:separator[ / ]$    → Important / Pending / Done
$tags:separator[ | ]$    → Important | Pending | Done
```

#### `list` Modifier

The string inside `[]` is prepended to each item, and items are joined with line breaks.

```
$tags:list[- ]$       →   - TypeScript
                          - Python
                          - Go

$tags:list[* ]$       →   * TypeScript
                          * Python
```

**Auto-numbering:** Numbers are automatically incremented only when `[]` starts with `1.`.

```
$tags:list[1. ]$      →   1. TypeScript
                          2. Python
                          3. Go

$tags:list[1) ]$      →   1) TypeScript    ← "1)" is not auto-numbered
                          1) Python
```

**Indented lists (for Frontmatter):**

When expanding into Frontmatter `aliases` or `tags`, control indentation by adding spaces in the prefix string.

Template:

```markdown
---
aliases:
$aliases:list[  - ]$
tags:
$tags:list[  - ]$
---
```

Output when "The Pragmatic Programmer / Tatsujin Programmer" is entered for aliases and "Tech Books / References" for tags:

```yaml
---
aliases:
  - The Pragmatic Programmer
  - Tatsujin Programmer
tags:
  - Tech Books
  - References
---
```

The same variable can also be expanded in a different format in the body:

```markdown
Aliases: $aliases:separator[, ]$
```

```
Aliases: The Pragmatic Programmer, Tatsujin Programmer
```

---

## Errors and Warnings

### Fatal Errors (Form generation is aborted)

In these cases, an error notification is shown and the form does not open.

| Condition | Example message |
|---|---|
| Unknown field type | `Unknown field type: "foo"` |
| `select` / `multiselect` missing `list` | `"select" requires the "list" option` |
| `min > max` | `"min" (10) must not exceed "max" (5) in field "count"` |
| Unmatched `{{` / `}}` | `Unclosed "{{" found on line 3` |
| Invalid characters in key | `Invalid key: "$name$". Keys must match [a-zA-Z0-9_-]` |

### Warnings (Form is still displayed)

In these cases, a warning message is shown at the top of the form, but the form remains usable.

| Condition | Behavior |
|---|---|
| Unknown option name (e.g. `requred`) | The option is ignored. If the edit distance is close, a suggestion is shown |
| Undefined meta key | The key is ignored |
| `default` value not in `list` | `default` is ignored; field is shown with no selection |

### Modifier Warnings (Notified on save)

If variable modifiers are used incorrectly, a Notice is shown when the note is saved (the note is still saved).

| Condition | Behavior |
|---|---|
| `:separator` / `:list` used on a non-`multiselect`/`multilist` key | Modifier is ignored; value is expanded as-is |
| Unknown modifier name (e.g. `:markdownlist`) | Modifier is ignored; values are joined with commas |

> **Typo suggestions:** For unknown option names, if the edit distance (Levenshtein distance) from a known option name is 2 or less, a `Did you mean "..."?` suggestion is displayed.

### Submission Validation

If a `required` field is left empty when **Create Note** is clicked, submission is blocked and the relevant field is highlighted in red.

---

## Template Examples

### ① Simple Memo

````markdown
```formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[Title]|required}}
{{select|category|label=[Category]|list=[Work;Personal;Learning;Other]}}
{{textarea|body|label=[Content]|rows=[8]}}
```

# $title$

Category: $category$

$body$
````

---

### ② Book Log (Frontmatter + Modifiers)

````markdown
---
title: "$book_title$"
created: "%date%"
tags:
$tags:list[  - ]$
aliases:
$aliases:list[  - ]$
---

```formbuilder
{{meta|folder=[Books]}}
{{meta|filename=[$book_title$-%timestamp%]}}

{{text|book_title|label=[Title]|required}}
{{text|author|label=[Author]}}
{{text|publisher|label=[Publisher]}}
{{date|read_date|label=[Date Finished]}}
{{select|status|label=[Status]|list=[Want to Read;Reading;Finished;Dropped]|default=[Want to Read]}}
{{select|rating|label=[Rating]|list=[★★★★★;★★★★;★★★;★★;★]}}
{{textarea|summary|label=[Summary]|rows=[4]}}
{{textarea|memo|label=[Notes / Impressions]|rows=[6]}}
{{multiselect|tags|label=[Tags]|list=[Tech;Business;Fiction;Practical;Reference;Re-read]}}
{{multilist|aliases|label=[Alternative / Original Title]}}
{{checkbox|recommended|label=[Recommended]}}
```

# $book_title$

**Author:** $author$　**Publisher:** $publisher$　**Finished:** $read_date$

**Status:** $status$　**Rating:** $rating$

## Summary

$summary$

## Notes / Impressions

$memo$

**Tags:** $tags:separator[, ]$
````

Frontmatter output example (aliases: "The Pragmatic Programmer / Tatsujin Programmer", tags: "Tech / Reference"):

```yaml
---
title: "The Pragmatic Programmer"
created: "2026-06-26"
tags:
  - Tech
  - Reference
aliases:
  - The Pragmatic Programmer
  - Tatsujin Programmer
---
```

The same variable can be expanded in a different format in the body:

```markdown
**Tags:** $tags:separator[, ]$
```

```
Tags: Tech, Reference
```

---

### ③ Meeting Minutes (Auto-generated filename using system variables)

````markdown
---
date: "%date%"
---

```formbuilder
{{meta|folder=[Meetings]}}
{{meta|filename=[Meeting_%date%]}}

{{text|project|label=[Project Name]|required}}
{{date|meeting_date|label=[Meeting Date]}}
{{multilist|attendees|label=[Attendees]}}
{{textarea|agenda|label=[Agenda]|rows=[4]}}
{{textarea|notes|label=[Minutes]|rows=[10]}}
{{textarea|action|label=[Action Items]|rows=[4]}}
```

# $project$ — Meeting Minutes

**Date:** $meeting_date$
**Attendees:** $attendees:separator[, ]$

## Agenda

$agenda$

## Minutes

$notes$

## Action Items

$action$
````

---

## FAQ

**Q. My template does not appear in the list**

Make sure the file contains a `formbuilder` code block. Regular Markdown files without one are not listed. Also verify that the **Template folder** setting points to the correct folder name.

**Q. `$keyName$` is not being replaced**

Check that a field with the matching `key` is defined in the form definition. Keys are case-sensitive (`Title` and `title` are different keys).

**Q. YAML lists in Frontmatter are not expanding correctly**

To output a YAML list (with indentation) from `multiselect` / `multilist`, use a variable modifier:

```markdown
tags:
$tags:list[  - ]$
```

The number of leading spaces inside `[]` controls the indentation width. Use two spaces (`list[  - ]`) to match Obsidian's standard 2-space indentation.

**Q. I want to use a `multiselect` value in different formats in the body and Frontmatter**

The same variable can be expanded multiple times with different modifiers:

```markdown
---
tags:
$tags:list[  - ]$
---

Body: $tags:separator[, ]$
```

**Q. What is the difference between `multiselect` and `multilist`?**

| | `multiselect` | `multilist` |
|---|---|---|
| Options | Must be predefined in the template | Free-form input |
| UI | Checkbox-based | Text area (one item per line) |
| Use case | Choose multiple values from a fixed list | Register multiple arbitrary strings |

Both support the same output modifiers (`:separator` / `:list`).

**Q. What happens if I enter a character that is not allowed in a filename?**

Characters prohibited by the OS (`/ \ : * ? " < > |`) are automatically replaced with `_`, and a notification is shown. Windows reserved device names (`CON`, `NUL`, `COM1`, etc.) are prefixed with `_`.

**Q. Can I specify nested folders in `meta|folder`?**

Yes. Use `/` as a separator, e.g. `Projects/2026/Notes`. Any missing folders in the path are created automatically.

---

## License

MIT

---
---

# Form Builder（日本語）

Markdown テンプレートから入力フォームを自動生成し、フォームへの入力内容を反映した新しいノートを作成する Obsidian プラグインです。

---

## 目次

1. [インストール](#インストール)
2. [セットアップ](#セットアップ)
3. [基本的な使い方](#基本的な使い方)
4. [テンプレートの構造](#テンプレートの構造)
5. [FormBuilder 構文リファレンス](#formbuilder-構文リファレンス)
   - [基本書式](#基本書式)
   - [meta 構文](#meta-構文)
   - [フィールド構文](#フィールド構文)
   - [フィールドタイプ一覧](#フィールドタイプ一覧)
   - [オプション一覧](#オプション一覧)
   - [変数](#変数)
   - [変数モディファイア](#変数モディファイア)
6. [エラーと警告](#エラーと警告)
7. [テンプレート例](#テンプレート例)
8. [FAQ](#faq-1)

---

## インストール

### コミュニティプラグインからインストール（推奨）

1. Obsidian の **設定 → コミュニティプラグイン** を開く
2. **「制限モードをオフにする」** をオフにしていない場合は、オフにする
3. **「閲覧」** をクリックし、検索欄に `Form Builder` と入力する
4. **Form Builder** を選択し **「インストール」** をクリックする
5. インストール完了後、**「有効化」** をクリックする

### 手動インストール

1. [Releases](https://github.com/p77-don/form-builder/releases) から最新バージョンの `main.js`・`manifest.json`・`styles.css` をダウンロードする
2. Vault 内の以下のフォルダに3ファイルを配置する

```
{vault}/.obsidian/plugins/form-builder/
├── main.js
├── manifest.json
└── styles.css
```

3. Obsidian の **設定 → コミュニティプラグイン** で **Form Builder** を有効化する

---

## セットアップ

### テンプレートフォルダの設定

**設定 → Form Builder → Template folder** にテンプレートファイルを置くフォルダ名を入力します。

```
Templates
```

デフォルトは `Templates` です。このフォルダ内に配置された Markdown ファイルのうち、`formbuilder` コードブロックを含むものだけがテンプレートとして認識されます。

### 言語の設定

**設定 → Form Builder → Language** でプラグイン全体の表示言語を切り替えられます。

| 選択肢 | 説明 |
|---|---|
| English | 英語（デフォルト） |
| 日本語 | 日本語 |

設定を変更すると設定画面・フォーム・ヘルプ・すべての通知メッセージが即座に切り替わります。

---

## 基本的な使い方

1. テンプレートフォルダに `formbuilder` コードブロックを含む Markdown ファイルを作成する
2. コマンドパレット（`Ctrl` / `Cmd` + `P`）を開き、**Create Note From Template** を実行する
3. テンプレートが複数ある場合は一覧から選択する（昇順 / 降順の切り替えボタンあり）
4. 表示されたフォームに入力し、**Create Note** を押す
5. `meta` で指定したフォルダに新しいノートが生成され、自動的に開く

---

## テンプレートの構造

テンプレートファイルは **フォーム定義領域** と **本文領域** の 2 つで構成されます。

````markdown
---
（Frontmatter：変数展開の対象）
---

```formbuilder
（フォーム定義）
```

（本文：変数展開の対象）
````

### フォーム定義領域

` ```formbuilder ` コードブロック内にのみ記述します。
フィールドの定義と出力先の設定（meta）を記述します。
このブロックは生成されたノートには含まれません（自動削除されます）。

### 本文領域

コードブロック外のすべての領域が変数展開の対象になります。

- Frontmatter
- 通常テキスト・見出し・リスト・テーブル・引用・HTML

本文中に `$キー名$` と書くと、フォームの入力値に置き換わります。
`multiselect` / `multilist` フィールドは、**変数モディファイア**で展開形式を指定できます。詳しくは[変数モディファイア](#変数モディファイア)を参照してください。

> **変数の囲みの違い：**
> ユーザー変数はドル記号 `$...$` で、システム変数はパーセント記号 `%...%` で囲みます。これは意図的な仕様です。

---

## FormBuilder 構文リファレンス

### 基本書式

すべての構文は `{{` と `}}` で囲みます。

```
{{type|key}}
{{type|key|option=[value]}}
{{type|key|option=[value]|option2=[value2]}}
```

#### スペースの扱い

`{{`・`}}`・`|` の前後に記述した半角・全角スペースは無視されます。
以下はすべて同一として扱われます。

```
{{text|name}}
{{ text | name }}
{{ text | name | required }}
```

#### キー（key）の使用可能文字

```
a-z  A-Z  0-9  _  -
```

以下の文字はキーに使用できません：`| { } [ ] $ % スペース（半角・全角）`

大文字・小文字は区別されます（`name` と `Name` は別のキーです）。

#### オプション値の書式

値は必ず `[]` で囲みます。

```
label=[タイトル]
placeholder=[名前を入力してください]
min=[0]
max=[200]
```

`[]` 内の文字はすべてそのまま値として使用されます（スペースを含む）。

```
placeholder=[ 先頭にスペースがある ]
→ 値は「 先頭にスペースがある 」
```

---

### meta 構文

テンプレート全体の設定を記述します。フォームには表示されず、ノート保存時に参照される設定値です。

```
{{meta|key=[value]}}
```

#### meta|folder

ノートの保存先フォルダを指定します。

**フォルダを固定する場合：**

```
{{meta|folder=[Notes]}}
{{meta|folder=[Projects/2026]}}
```

指定したフォルダに常に保存されます。存在しない場合は自動的に作成されます（多階層も対応）。省略した場合は Vault のルートに保存されます。

**フォームで保存先を入力させる場合：**

`folder` に `$キー名$` を使い、対応するフィールドを別途定義します。

```
{{meta|folder=[$export$]}}
{{text|export|label=[出力先フォルダ]|default=[Notes]}}
```

フォームに「出力先フォルダ」の入力欄が表示され、ユーザーが実行時に指定できます。`default=[Notes]` で初期値を設定しておくことを推奨します。

#### meta|filename

生成するノートのファイル名を指定します（拡張子 `.md` は自動付与されます）。

```
{{meta|filename=[my-note]}}
{{meta|filename=[$title$-%timestamp%]}}
{{meta|filename=[Report_%date%]}}
```

- `$キー名$` でフォーム入力値を使用できます
- `%timestamp%`・`%date%`・`%time%` などのシステム変数を使用できます
- システム変数はノート保存時に評価されます
- ファイル名に使えない文字（`/ \ : * ? " < > |`）は自動的に `_` に置き換えられます
- Windows の予約デバイス名（`CON`・`NUL`・`COM1` 等）は先頭に `_` が付与されます
- 省略した場合は `Untitled.md` になります

#### 不明な meta キー

定義されていないキーを記述した場合、警告を表示してそのキーを無視します（フォーム生成は継続します）。

---

### フィールド構文

フォームに表示される入力フィールドを定義します。

```
{{type|key}}
{{type|key|option=[value]}}
{{type|key|option1=[value1]|option2=[value2]|flag}}
```

**位置引数の順序：**

1. `type`（フィールドタイプ）— 必須
2. `key`（変数名）— 必須
3. 以降はオプション（順序不問）

---

### フィールドタイプ一覧

#### `text` — 1行テキスト入力

```
{{text|name}}
{{text|name|label=[名前]|placeholder=[山田 太郎]|required}}
```

フォーム上に1行のテキスト入力欄を表示します。

**使用可能なオプション：** `label` `placeholder` `description` `default` `required`

**出力例：**

```
テンプレート本文: 著者: $name$
入力値: 山田 太郎
出力:   著者: 山田 太郎
```

---

#### `textarea` — 複数行テキスト入力

```
{{textarea|description}}
{{textarea|description|label=[説明]|rows=[8]|placeholder=[詳細を記述...]}}
```

フォーム上に複数行のテキスト入力欄を表示します。

**使用可能なオプション：** `label` `placeholder` `description` `default` `required` `rows`

**出力例：** 入力した内容がそのまま展開されます（改行も保持されます）。

---

#### `number` — 数値入力

```
{{number|price}}
{{number|price|label=[価格]|min=[0]|max=[999999]|default=[0]}}
```

フォーム上に数値入力欄を表示します。`min` / `max` を指定すると入力範囲を制限できます。

**使用可能なオプション：** `label` `placeholder` `description` `default` `required` `min` `max`

**エラー条件：** `min > max` の場合、致命的エラーとしてフォーム生成を中止します。

**出力例：**

```
テンプレート本文: 価格: $price$ 円
入力値: 1500
出力:   価格: 1500 円
```

---

#### `date` — 日付入力

```
{{date|birthday}}
{{date|birthday|label=[誕生日]|default=[2000-01-01]}}
```

フォーム上に日付ピッカーを表示します。

**使用可能なオプション：** `label` `description` `default` `required`

**出力例：**

```
テンプレート本文: 日付: $birthday$
入力値: 2000-01-01
出力:   日付: 2000-01-01
```

---

#### `checkbox` — トグル（真偽値）

```
{{checkbox|published}}
{{checkbox|published|label=[公開する]|default=[true]}}
```

フォーム上にトグルスイッチを表示します。

**使用可能なオプション：** `label` `description` `default`

- `default=[true]` でデフォルトをオン（有効）にできます
- `required` は `checkbox` には効果がありません（オフ状態も有効な値であるため）

**出力例：**

```
オン時の出力:  true
オフ時の出力:  false
```

---

#### `select` — 単一選択

```
{{select|status|list=[未着手;進行中;完了]}}
{{select|status|label=[ステータス]|list=[未着手;進行中;完了]|default=[未着手]}}
```

フォーム上にドロップダウンリストを表示します。
`list` オプションは必須です。省略すると致命的エラーになります。

**使用可能なオプション：** `label` `description` `default` `required` `list`

**`list` の書式：**

選択肢をセミコロン（`;`）で区切ります。セミコロンの直前・直後のスペースは自動的に除去されます。項目内部のスペースはそのまま保持されます。

```
list=[未着手;進行中;完了]
list=[ 未着手 ; 進行中 ; 完了 ]     → 同じ結果（前後のスペースを除去）
list=[I am a boy;I am a girl]       → 「I am a boy」「I am a girl」の2項目
```

**`default` の注意：** `default` に指定した値が `list` に存在しない場合、警告を表示して空選択状態にします。

**出力例：**

```
テンプレート本文: ステータス: $status$
選択値: 進行中
出力:   ステータス: 進行中
```

---

#### `multiselect` — 複数選択

```
{{multiselect|tags|list=[重要;確認待ち;完了]}}
{{multiselect|tags|label=[タグ]|list=[重要;確認待ち;完了]|default=[重要;完了]}}
```

フォーム上にチェックボックス形式の複数選択 UI を表示します。
`list` オプションは必須です。省略すると致命的エラーになります。

**使用可能なオプション：** `label` `description` `default` `required` `list` `rows`

**`default` で複数選択：** セミコロン区切りで複数のデフォルト値を指定できます。

```
{{multiselect|tags|list=[重要;確認待ち;完了]|default=[重要;完了]}}
```

**出力形式の制御：**

出力形式はフィールド定義ではなく、本文中の**変数モディファイア**で指定します。
モディファイアを省略した場合（`$tags$`）、選択値はカンマのみで結合されます（スペースなし）。

```
$tags$               → 重要,完了
$tags:separator[, ]$ → 重要, 完了
$tags:list[- ]$      → - 重要\n- 完了
```

詳しくは[変数モディファイア](#変数モディファイア)を参照してください。

---

#### `multilist` — 自由記述・複数値入力

```
{{multilist|aliases}}
{{multilist|aliases|label=[エイリアス]|rows=[5]}}
```

フォーム上に複数行テキスト入力欄を表示します。**1行に1項目**を入力します。空行は保存時に自動的に除去されます。

`select` や `multiselect` と異なり、選択肢を事前に定義せず、ユーザーが自由に値を入力できます。Frontmatter の `aliases` のように任意の文字列を複数登録したい場合に適しています。

**使用可能なオプション：** `label` `placeholder` `description` `default` `required` `rows`

**出力形式の制御：**

`multiselect` と同様に、出力形式は本文中の**変数モディファイア**で指定します。
モディファイアを省略した場合（`$aliases$`）、入力値はカンマのみで結合されます（スペースなし）。

```
$aliases$               → 東京オフィス,Tokyo Office,本社
$aliases:separator[, ]$ → 東京オフィス, Tokyo Office, 本社
$aliases:list[- ]$      → - 東京オフィス\n- Tokyo Office\n- 本社
```

詳しくは[変数モディファイア](#変数モディファイア)を参照してください。

---

### オプション一覧

| オプション | 値の形式 | 適用フィールド | 説明 |
|---|---|---|---|
| `label=[表示名]` | 文字列 | 全フィールド | フォーム上のラベル。省略時はキー名をそのまま使用 |
| `required` | フラグ（値なし） | 全フィールド | 必須入力。未入力での送信をブロックし、フィールドをハイライト |
| `placeholder=[...]` | 文字列 | text / textarea / number / multilist | 入力欄に表示するヒントテキスト |
| `description=[...]` | 文字列 | 全フィールド | ラベルの下に表示する説明文 |
| `default=[値]` | 文字列 | 全フィールド | フォーム表示時の初期値 |
| `list=[A;B;C]` | セミコロン区切り文字列 | select / multiselect | 選択肢の一覧（これらのタイプでは必須） |
| `min=[数値]` | 数値 | number | 入力可能な最小値 |
| `max=[数値]` | 数値 | number | 入力可能な最大値 |
| `rows=[行数]` | 整数 | textarea / multiselect / multilist | 表示行数 |

---

### 変数

#### ユーザー変数とシステム変数の違い

Form Builder には2種類の変数があり、**囲む記号が異なります**。

| 種別 | 書式 | タイミング |
|---|---|---|
| ユーザー変数 | `$キー名$`（ドル記号） | フォームの入力値 |
| システム変数 | `%変数名%`（パーセント記号） | ノート保存時に評価 |

#### ユーザー変数

フォームへの入力値を参照します。テンプレート本文・Frontmatter・meta の `filename` / `folder` に記述できます。

```
$キー名$
$title$
$author$
$status$
```

キー名は `[a-zA-Z0-9_-]` の文字のみ使用できます。大文字・小文字は区別されます。

本文中に存在するが対応するフィールドが定義されていない変数（`$undefined_key$`）は、そのまま出力されます（エラーにはなりません）。

**`multiselect` / `multilist` のデフォルト展開：**

モディファイアなしで展開した場合（`$key$`）、選択・入力された値をカンマのみで結合します（スペースなし）。

```
選択値: 重要, 完了（2項目）
$tags$ → 重要,完了
```

出力形式を変えたい場合は[変数モディファイア](#変数モディファイア)を使用してください。

#### システム変数

プラグインが提供する変数です。すべて**ノート保存時**に評価されます。

| 変数 | 説明 | 出力例 |
|---|---|---|
| `%timestamp%` | 保存時刻（yyyyMMddHHmmss 形式） | `20260626153000` |
| `%date%` | 保存日付 | `2026-06-26` |
| `%time%` | 保存時刻 | `15:30:00` |

> **注意：** システム変数はフォームを開いた時刻ではなく、**Create Note ボタンを押した瞬間**の時刻で評価されます。

#### 変数の展開スコープ

| 場所 | ユーザー変数 | システム変数 |
|---|---|---|
| Frontmatter | ✅ | ✅ |
| 本文（見出し・リスト・テーブル等） | ✅ | ✅ |
| `meta\|filename` | ✅ | ✅ |
| `meta\|folder` | ✅ | ✅ |
| `formbuilder` ブロック内 | ❌（フォーム定義として処理） | ❌ |

#### 変数とシステム変数の混在例

```
{{meta|filename=[$title$-%timestamp%]}}
```

`$title$` に「Meeting Notes」を入力して保存した場合：

```
Meeting Notes-20260626153000.md
```

---

### 変数モディファイア

`multiselect` / `multilist` フィールドは複数の値を持つ配列変数です。本文中で展開する際に、モディファイアで出力形式を指定できます。

#### 基本書式

```
$key$                      モディファイアなし（カンマのみ結合）
$key:separator[区切り文字]$  区切り文字で結合
$key:list[行頭文字列]$       各行に行頭文字列を付けて改行で結合
```

モディファイアを `multiselect` / `multilist` 以外のフィールドに使用した場合、警告を表示してモディファイアを無視します。

#### `separator` モディファイア

`[]` 内の文字列をそのまま区切り文字として使用します。スペースも含めてそのまま使われます。

```
$tags:separator[,]$      → 重要,確認待ち,完了
$tags:separator[, ]$     → 重要, 確認待ち, 完了
$tags:separator[ / ]$    → 重要 / 確認待ち / 完了
$tags:separator[・]$     → 重要・確認待ち・完了
$tags:separator[ | ]$    → 重要 | 確認待ち | 完了
```

#### `list` モディファイア

`[]` 内の文字列をそのまま各行の先頭に付けて、改行で結合します。

```
$tags:list[- ]$       →   - TypeScript
                          - Python
                          - Go

$tags:list[* ]$       →   * TypeScript
                          * Python

$tags:list[ ・ ]$     →    ・ TypeScript
                           ・ Python
```

**自動採番：** `[]` 内が `1.` で始まる場合のみ番号を自動採番します。

```
$tags:list[1. ]$      →   1. TypeScript
                          2. Python
                          3. Go

$tags:list[1) ]$      →   1) TypeScript    ← "1." 以外は採番しない
                          1) Python
```

**インデント付きリスト（Frontmatter 向け）：**

Frontmatter の `aliases` や `tags` に展開する場合、行頭文字列にスペースを付けることでインデントを制御できます。

テンプレート：

```markdown
---
aliases:
$aliases:list[  - ]$
tags:
$tags:list[  - ]$
---
```

入力値「The Pragmatic Programmer / 達人プログラマー」「技術書 / 参考文献」の場合の出力：

```yaml
---
aliases:
  - The Pragmatic Programmer
  - 達人プログラマー
tags:
  - 技術書
  - 参考文献
---
```

同じ変数を本文で別形式に展開することも可能です。

```markdown
別名: $aliases:separator[、]$
```

```
別名: The Pragmatic Programmer、達人プログラマー
```

---

## エラーと警告

### 致命的エラー（フォーム生成を中止）

以下の場合、エラー通知を表示してフォームを開きません。

| 条件 | メッセージ例 |
|---|---|
| 未知のフィールドタイプ | `Unknown field type: "foo"` |
| `select` / `multiselect` に `list` がない | `"select" requires the "list" option` |
| `min > max` | `"min" (10) must not exceed "max" (5) in field "count"` |
| `{{` と `}}` の対応が取れない | `Unclosed "{{" found on line 3` |
| キーに使用不可文字が含まれる | `Invalid key: "$name$". Keys must match [a-zA-Z0-9_-]` |

### 警告（フォームは表示される）

以下の場合、フォーム上部に警告メッセージを表示しますが、フォームは引き続き使用できます。

| 条件 | 挙動 |
|---|---|
| 未知のオプション名（例: `requred`） | 該当オプションを無視。編集距離が近い場合は候補を表示 |
| 未定義の meta キー | 該当キーを無視 |
| `default` 値が `list` に存在しない | `default` を無視し、空選択状態にする |

### モディファイア警告（保存時の通知）

変数モディファイアの使い方に問題がある場合、ノート保存時に Notice で通知されます（保存自体は実行されます）。

| 条件 | 挙動 |
|---|---|
| `multiselect` / `multilist` 以外のキーに `:separator` / `:list` を使用 | モディファイアを無視してそのまま展開 |
| 未知のモディファイア名（例: `:markdownlist`） | モディファイアを無視してカンマ結合で展開 |

> **タイポ候補表示：** 未知のオプション名については、既知オプション名との編集距離（レーベンシュタイン距離）が 2 以内であれば `Did you mean "..."?` の候補を表示します。

### 送信時バリデーション

`required` を指定したフィールドが未入力のまま **Create Note** を押した場合、送信をブロックして該当フィールドを赤くハイライトします。

---

## テンプレート例

### ① シンプルなメモ

````markdown
```formbuilder
{{meta|folder=[Notes]}}
{{meta|filename=[$title$-%date%]}}

{{text|title|label=[タイトル]|required}}
{{select|category|label=[カテゴリ]|list=[仕事;個人;学習;その他]}}
{{textarea|body|label=[内容]|rows=[8]}}
```

# $title$

カテゴリ: $category$

$body$
````

---

### ② 読書記録（Frontmatter + モディファイア）

````markdown
---
title: "$book_title$"
created: "%date%"
tags:
$tags:list[  - ]$
aliases:
$aliases:list[  - ]$
---

```formbuilder
{{meta|folder=[Books]}}
{{meta|filename=[$book_title$-%timestamp%]}}

{{text|book_title|label=[書名]|required}}
{{text|author|label=[著者]}}
{{text|publisher|label=[出版社]}}
{{date|read_date|label=[読了日]}}
{{select|status|label=[ステータス]|list=[読みたい;読書中;読了;中断]|default=[読みたい]}}
{{select|rating|label=[評価]|list=[★★★★★;★★★★;★★★;★★;★]}}
{{textarea|summary|label=[概要・あらすじ]|rows=[4]}}
{{textarea|memo|label=[感想・メモ]|rows=[6]}}
{{multiselect|tags|label=[タグ]|list=[技術書;ビジネス;小説;実用;参考文献;再読したい]}}
{{multilist|aliases|label=[別題・原題]}}
{{checkbox|recommended|label=[おすすめ]}}
```

# $book_title$

**著者:** $author$　**出版社:** $publisher$　**読了日:** $read_date$

**ステータス:** $status$　**評価:** $rating$

## 概要

$summary$

## 感想・メモ

$memo$

**タグ:** $tags:separator[、]$
````

Frontmatter への展開例（aliases に「The Pragmatic Programmer / 達人プログラマー」、tags に「技術書 / 参考文献」を入力した場合）：

```yaml
---
title: "達人プログラマー"
created: "2026-06-26"
tags:
  - 技術書
  - 参考文献
aliases:
  - The Pragmatic Programmer
  - 達人プログラマー
---
```

同じ変数を本文で別形式に展開することも可能です。

```markdown
**タグ:** $tags:separator[、]$
```

```
タグ: 技術書、参考文献
```

---

### ③ 議事録（システム変数でファイル名を自動生成）

````markdown
---
date: "%date%"
---

```formbuilder
{{meta|folder=[Meetings]}}
{{meta|filename=[Meeting_%date%]}}

{{text|project|label=[プロジェクト名]|required}}
{{date|meeting_date|label=[開催日]}}
{{multilist|attendees|label=[参加者]}}
{{textarea|agenda|label=[議題]|rows=[4]}}
{{textarea|notes|label=[議事内容]|rows=[10]}}
{{textarea|action|label=[アクションアイテム]|rows=[4]}}
```

# $project$ — 議事録

**開催日:** $meeting_date$
**参加者:** $attendees:separator[、]$

## 議題

$agenda$

## 議事内容

$notes$

## アクションアイテム

$action$
````

---

## FAQ

**Q. テンプレートがリストに表示されない**

`formbuilder` コードブロックが含まれているか確認してください。コードブロックのない通常の Markdown ファイルはリストに表示されません。また、設定の **Template folder** が正しいフォルダ名になっているか確認してください。

**Q. `$キー名$` が置換されずそのまま残る**

フォームのフィールド定義に対応するキー（`key`）が存在するか確認してください。キー名の大文字・小文字は区別されます（`Title` と `title` は別のキーです）。

**Q. Frontmatter の YAML リストが正しく展開されない**

`multiselect` / `multilist` で YAML リスト形式（インデント付き）を出力するには、変数モディファイアを使用します。

```markdown
tags:
$tags:list[  - ]$
```

`[]` 内の先頭スペースの数がインデント幅になります。Obsidian 標準の2スペースに合わせるには `list[  - ]`（スペース2つ）と記述してください。

**Q. `multiselect` の値を本文とFrontmatterで別々の形式で使いたい**

同じ変数を異なるモディファイアで複数回展開できます。

```markdown
---
tags:
$tags:list[  - ]$
---

本文内: $tags:separator[、]$
```

**Q. `multiselect` と `multilist` の違いは？**

| | `multiselect` | `multilist` |
|---|---|---|
| 選択肢 | テンプレートで事前定義が必要 | 自由入力 |
| UI | チェックボックス式 | テキストエリア（1行1項目） |
| 用途 | 決まった選択肢から複数選ぶ | 任意の文字列を複数登録する |

どちらも出力形式はモディファイア（`:separator` / `:list`）で指定します。

**Q. ファイル名に使えない文字を入力したらどうなる？**

OS の禁止文字（`/ \ : * ? " < > |`）は自動的に `_` に置き換えられ、通知メッセージが表示されます。また、Windows の予約デバイス名（`CON`・`NUL`・`COM1` 等）は先頭に `_` が付与されます。

**Q. 多階層のフォルダを `meta|folder` で指定できる？**

はい。`Projects/2026/Notes` のように `/` で区切って指定できます。存在しない階層は自動的に作成されます。

---

## ライセンス

MIT
