# Form Builder

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
8. [FAQ](#faq)

---

## インストール

ビルド済みファイルを Obsidian のプラグインフォルダに配置します。

```
{vault}/.obsidian/plugins/form-builder/
├── main.js
├── manifest.json
└── styles.css
```

配置後、Obsidian の **設定 → コミュニティプラグイン** で **Form Builder** を有効化してください。

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
（Frontmatter：オプション）
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
label=[キャラクター名]
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
{{number|age}}
{{number|age|label=[年齢]|min=[0]|max=[120]|default=[20]}}
```

フォーム上に数値入力欄を表示します。`min` / `max` を指定すると入力範囲を制限できます。

**使用可能なオプション：** `label` `placeholder` `description` `default` `required` `min` `max`

**エラー条件：** `min > max` の場合、致命的エラーとしてフォーム生成を中止します。

**出力例：**

```
テンプレート本文: 年齢: $age$ 歳
入力値: 25
出力:   年齢: 25 歳
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

**使用可能なオプション：** `label` `description` `default` `required`

- `default=[true]` でデフォルトをオン（有効）にできます
- `required` を指定した場合、トグルがオフ（false）だと送信をブロックします

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
$character_name$
$age$
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
$skills:list[- ]$     →   - 剣術
                          - 魔法
                          - 弓術

$skills:list[* ]$     →   * 剣術
                          * 魔法

$skills:list[ ・ ]$   →    ・ 剣術
                           ・ 魔法
```

**自動採番：** `[]` 内が `1.` で始まる場合のみ番号を自動採番します。

```
$skills:list[1. ]$    →   1. 剣術
                          2. 魔法
                          3. 弓術

$skills:list[1) ]$    →   1) 剣術    ← "1." 以外は採番しない
                          1) 魔法
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

入力値「alice / アリス」「fantasy / character」の場合の出力：

```yaml
---
aliases:
  - alice
  - アリス
tags:
  - fantasy
  - character
---
```

同じ変数を本文で別形式に展開することも可能です。

```markdown
別名: $aliases:separator[、]$
```

```
別名: alice、アリス
```

---

## エラーと警告

### 致命的エラー（フォーム生成を中止）

以下の場合、エラー通知を表示してフォームを開きません。

| 条件 | メッセージ例 |
|---|---|
| 未知のフィールドタイプ | `Unknown field type: "foo"` |
| `select` / `multiselect` に `list` がない | `"select" requires the "list" option` |
| `min > max` | `"min" (10) must not exceed "max" (5) in field "age"` |
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

### ② キャラクターシート（Frontmatter + モディファイア）

````markdown
---
title: "$character_name$"
created: "%date%"
tags:
$tags:list[  - ]$
aliases:
$aliases:list[  - ]$
---

```formbuilder
{{meta|folder=[Characters]}}
{{meta|filename=[$character_name$-%timestamp%]}}

{{text|character_name|label=[キャラクター名]|required}}
{{text|race|label=[種族]}}
{{number|age|label=[年齢]|min=[0]|max=[999]}}
{{select|gender|label=[性別]|list=[男性;女性;その他]}}
{{textarea|profile|label=[プロフィール]|rows=[6]}}
{{multiselect|skills|label=[スキル]|list=[剣術;魔法;弓術;回避;回復;索敵]}}
{{multiselect|tags|label=[タグ]|list=[主人公;敵;NPC;死亡]}}
{{multilist|aliases|label=[別名・エイリアス]}}
{{checkbox|active|label=[アクティブ]|default=[true]}}
```

# $character_name$

| 項目 | 値 |
|---|---|
| 種族 | $race$ |
| 年齢 | $age$ |
| 性別 | $gender$ |

## プロフィール

$profile$

## スキル

$skills:list[- ]$

関連タグ: $tags:separator[、]$

作成日: %date%
````

Frontmatter への展開例（aliases に「alice / アリス」、tags に「主人公 / NPC」を入力した場合）：

```yaml
---
title: "アリス"
created: "2026-06-26"
tags:
  - 主人公
  - NPC
aliases:
  - alice
  - アリス
---
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
