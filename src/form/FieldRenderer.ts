import type { App } from 'obsidian';
import type { FormField, ValueStore } from '../model/FieldModel';
import { FolderSuggestModal } from './FolderSuggestModal';

/** renderField / renderText が folder ピッカーを描画するために必要な文言・依存先。 */
export interface FieldRenderContext {
    app: App;
    multilistHint: string;
    folderPickerBtnLabel: string;
    folderPickerPlaceholder: string;
    /**
     * フォームモーダルごとに一意な文字列（FormModal が生成して渡す）。
     * multiselect のチェックボックス ID が、list 内の重複値や同時に開いた
     * 複数モーダル間で衝突しないようにするために使う（CodeReview #9）。
     */
    instanceId: string;
}

export function renderField(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    switch (field.type) {
        case 'text':        renderText(containerEl, field, values, ctx); break;
        case 'textarea':    renderTextarea(containerEl, field, values, ctx); break;
        case 'number':      renderNumber(containerEl, field, values, ctx); break;
        case 'date':        renderDate(containerEl, field, values, ctx); break;
        case 'checkbox':    renderCheckbox(containerEl, field, values, ctx); break;
        case 'select':      renderSelect(containerEl, field, values, ctx); break;
        case 'multiselect': renderMultiselect(containerEl, field, values, ctx); break;
        case 'multilist':   renderList(containerEl, field, values, ctx); break;
        default: {
            // TypeScript の網羅性チェック: FieldType に新しい型を追加した際にコンパイルエラーで検出する
            const _exhaustive: never = field;
            console.warn('Form Builder: Unknown field type', (_exhaustive as FormField).type);
        }
    }
}

// ---------- 共通ヘルパー ----------

function createCard(containerEl: HTMLElement, field: FormField): HTMLElement {
    const card = containerEl.createDiv({ cls: 'fb-field' });
    card.dataset.formKey = field.key;
    return card;
}

/**
 * フィールドの入力要素に付与する一意な ID のベース部分を作る。
 * モーダルごとに一意な instanceId と field.key を組み合わせることで、
 * 同一モーダル内での重複はもちろん、同じフォームを複数開いた場合の
 * DOM 全体での ID 衝突も避ける（CodeReview #9 の instanceId の仕組みを流用）。
 */
function fieldBaseId(ctx: FieldRenderContext, field: FormField): string {
    return `fb-f-${ctx.instanceId}-${field.key}`;
}

/**
 * フィールドの見出し・説明文を描画する（CodeReview #10）。
 *
 * 以前は見出しが `<span>` で、`input` / `textarea` / `select` とプログラム上
 * 関連付けられておらず、説明文にも `aria-describedby` がなかったため、
 * スクリーンリーダーでは各フィールドの目的が十分に伝わらなかった。
 *
 * - `labelFor` に対象の入力要素の id を渡すと、見出しを `<label for="...">` にする
 *   （text/textarea/number/date/checkbox/select/multilist のように、
 *   1フィールド=1つの入力要素として `for` で直接指せる場合はこちらを使う）。
 * - `labelFor` に `null` を渡すと、見出しを `<span id="...">` にして返り値の
 *   `legendId` として返す（multiselect のようにチェックボックスが複数あり、
 *   単一の `for` で指せない場合はこちらを使い、呼び出し側でチップ群の
 *   コンテナに `role="group"` + `aria-labelledby` として関連付ける）。
 * - 説明文がある場合は id を振って `descId` として返す。呼び出し側で対象の
 *   入力要素（またはグループ）に `aria-describedby` として設定する。
 */
function appendLabelRow(
    card: HTMLElement,
    field: FormField,
    baseId: string,
    labelFor: string | null
): { descId?: string; legendId?: string } {
    const labelRow = card.createDiv({ cls: 'fb-label-row' });
    let legendId: string | undefined;
    if (labelFor) {
        const label = labelRow.createEl('label', { cls: 'fb-label', text: field.label ?? field.key });
        label.htmlFor = labelFor;
    } else {
        legendId = `${baseId}-legend`;
        labelRow.createSpan({ cls: 'fb-label', text: field.label ?? field.key, attr: { id: legendId } });
    }
    if (field.required) {
        // "*" は視覚的な必須マークであり、必須である旨はスクリーンリーダーには
        // 各入力要素側の aria-required で伝えるため、二重に読み上げられないよう隠す。
        labelRow.createSpan({ cls: 'fb-required-mark', text: '*', attr: { 'aria-hidden': 'true' } });
    }
    let descId: string | undefined;
    if (field.description) {
        descId = `${baseId}-desc`;
        card.createDiv({ cls: 'fb-desc', text: field.description, attr: { id: descId } });
    }
    return { descId, legendId };
}

// ---------- text ----------

function renderText(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    if (field.type !== 'text') return;
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);

    // folder オプションがない場合は従来通り input のみを表示する
    if (!field.folder) {
        const input = card.createEl('input', { cls: 'fb-input' });
        input.type = 'text';
        input.id = baseId;
        input.value = field.default ?? '';
        if (field.placeholder) input.placeholder = field.placeholder;
        if (descId) input.setAttribute('aria-describedby', descId);
        if (field.required) input.setAttribute('aria-required', 'true');
        input.addEventListener('input', () => values.set(field.key, input.value));
        return;
    }

    // folder オプションあり: input の隣にフォルダ選択ボタンを表示する。
    // 値自体はあくまで通常の文字列のため、選択後も自由に手入力で編集できる。
    const row = card.createDiv({ cls: 'fb-input-row' });
    const input = row.createEl('input', { cls: 'fb-input' });
    input.type = 'text';
    input.id = baseId;
    input.value = field.default ?? '';
    if (field.placeholder) input.placeholder = field.placeholder;
    if (descId) input.setAttribute('aria-describedby', descId);
    if (field.required) input.setAttribute('aria-required', 'true');
    input.addEventListener('input', () => values.set(field.key, input.value));

    const pickBtn = row.createEl('button', { cls: 'fb-folder-picker-btn', text: '📁' });
    pickBtn.type = 'button';
    pickBtn.title = ctx.folderPickerBtnLabel;
    pickBtn.setAttribute('aria-label', ctx.folderPickerBtnLabel);
    pickBtn.addEventListener('click', () => {
        new FolderSuggestModal(ctx.app, input.value, ctx.folderPickerPlaceholder, (folder) => {
            input.value = folder.path;
            values.set(field.key, folder.path);
        }).open();
    });
}

// ---------- textarea ----------

function renderTextarea(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);
    const textarea = card.createEl('textarea', { cls: 'fb-textarea' });
    textarea.id = baseId;
    textarea.value = field.default ?? '';
    if (field.placeholder) textarea.placeholder = field.placeholder;
    if (descId) textarea.setAttribute('aria-describedby', descId);
    if (field.required) textarea.setAttribute('aria-required', 'true');
    const rows = (field as { rows?: number }).rows;
    textarea.rows = (rows && rows > 0) ? rows : 5;
    textarea.addEventListener('input', () => values.set(field.key, textarea.value));
}

// ---------- number ----------

function renderNumber(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);
    const input = card.createEl('input', { cls: 'fb-input' });
    input.type = 'number';
    input.id = baseId;
    const nf = field as { min?: number; max?: number };
    if (nf.min !== undefined) input.min = String(nf.min);
    if (nf.max !== undefined) input.max = String(nf.max);
    if (field.placeholder) input.placeholder = field.placeholder;
    if (descId) input.setAttribute('aria-describedby', descId);
    if (field.required) input.setAttribute('aria-required', 'true');
    input.value = field.default ?? '';
    // ブラウザは type=number の input に数値として解釈できない値を代入すると
    // 実際の value を空文字へ補正することがある。この補正後の実 DOM 値を
    // ValueStore へ保存することで、画面表示と保存値の食い違いを防ぐ（CodeReview #1）。
    values.set(field.key, input.value);
    input.addEventListener('input', () => values.set(field.key, input.value));
}

// ---------- date ----------

function renderDate(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);
    const input = card.createEl('input', { cls: 'fb-input' });
    input.type = 'date';
    input.id = baseId;
    if (descId) input.setAttribute('aria-describedby', descId);
    if (field.required) input.setAttribute('aria-required', 'true');
    input.value = field.default ?? '';
    // number と同様、ブラウザは不正な日付（存在しない日付や誤った形式）を
    // 空文字へ補正することがある。補正後の実 DOM 値を保存する（CodeReview #1）。
    values.set(field.key, input.value);
    input.addEventListener('change', () => values.set(field.key, input.value));
}

// ---------- checkbox (toggle) ----------

function renderCheckbox(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    const initVal = field.default === 'true';
    values.set(field.key, initVal);
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);
    const wrap = card.createDiv({ cls: 'fb-toggle-wrap' });
    const toggleLabel = wrap.createEl('label', { cls: 'fb-toggle' });
    const input = toggleLabel.createEl('input');
    input.type = 'checkbox';
    input.id = baseId;
    input.checked = initVal;
    if (descId) input.setAttribute('aria-describedby', descId);
    toggleLabel.createDiv({ cls: 'fb-toggle-track' });
    toggleLabel.createDiv({ cls: 'fb-toggle-thumb' });
    input.addEventListener('change', () => values.set(field.key, input.checked));
}

// ---------- select ----------

function renderSelect(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    const sf = field as { list: string[] };
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);
    const select = card.createEl('select', { cls: 'fb-select' });
    select.id = baseId;
    if (descId) select.setAttribute('aria-describedby', descId);
    if (field.required) select.setAttribute('aria-required', 'true');
    const emptyOpt = select.createEl('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '---';
    for (const item of sf.list) {
        const opt = select.createEl('option');
        opt.value = item;
        opt.textContent = item;
    }
    const defaultVal = field.default ?? '';
    select.value = (defaultVal && sf.list.includes(defaultVal)) ? defaultVal : '';
    // 実際に選択された（ブラウザが受理した）DOM 値を保存する。
    // list に存在しない default を指定した場合、画面は "---"（空）になるが、
    // 修正前は values に無効な default がそのまま残っていた（CodeReview #1）。
    values.set(field.key, select.value);
    select.addEventListener('change', () => values.set(field.key, select.value));
}

// ---------- multiselect (チップ UI) ----------

function renderMultiselect(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    if (field.type !== 'multiselect') return;
    const defaultRaw   = field.default ?? '';
    const defaultItems = defaultRaw
        ? defaultRaw.split(';').map(s => s.trim()).filter(s => field.list.includes(s))
        : [];
    const selected = new Set<string>(defaultItems);
    values.set(field.key, [...selected]);

    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    // multiselect はチェックボックスが複数あり、単一の <label for> では対象を指せないため、
    // 見出しを <span id> にしてもらい、チップ群のコンテナに role="group" +
    // aria-labelledby / aria-describedby で関連付ける（CodeReview #10）。
    const { descId, legendId } = appendLabelRow(card, field, baseId, null);

    const chipGroup = card.createDiv({ cls: 'fb-chip-group' });
    chipGroup.setAttribute('role', 'group');
    if (legendId) chipGroup.setAttribute('aria-labelledby', legendId);
    if (descId) chipGroup.setAttribute('aria-describedby', descId);
    field.list.forEach((item, index) => {
        const chipWrap = chipGroup.createDiv({ cls: 'fb-chip' });
        // list 内に重複した値がある場合や、同じキー・値を持つフォームを複数開いた場合でも
        // id が衝突しないよう、モーダル固有の instanceId と配列 index を組み合わせる
        // （item の文字列自体は一意性を保証できないため id には使わない）（CodeReview #9）。
        const id = `fb-chip-${ctx.instanceId}-${field.key}-${index}`;
        const checkbox = chipWrap.createEl('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = selected.has(item);
        const label = chipWrap.createEl('label', { cls: 'fb-chip-label' });
        label.htmlFor = id;
        label.textContent = item;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selected.add(item);
            else selected.delete(item);
            values.set(field.key, [...selected]);
        });
    });
}

// ---------- list（自由入力・1行1項目） ----------

function renderList(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    if (field.type !== 'multilist') return;
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    const baseId = fieldBaseId(ctx, field);
    const { descId } = appendLabelRow(card, field, baseId, baseId);

    // ヒントテキスト（description が指定されていない場合のみ表示）
    let hintDescId: string | undefined;
    if (!field.description) {
        hintDescId = `${baseId}-hint`;
        card.createDiv({ cls: 'fb-desc', text: ctx.multilistHint, attr: { id: hintDescId } });
    }

    const textarea = card.createEl('textarea', { cls: 'fb-textarea fb-list-input' });
    textarea.id = baseId;
    textarea.value = field.default ?? '';
    if (field.placeholder) textarea.placeholder = field.placeholder;
    textarea.rows = (field.rows && field.rows > 0) ? field.rows : 4;
    // description があれば descId、なければヒントテキストの id を aria-describedby に使う
    const effectiveDescId = descId ?? hintDescId;
    if (effectiveDescId) textarea.setAttribute('aria-describedby', effectiveDescId);
    if (field.required) textarea.setAttribute('aria-required', 'true');
    textarea.addEventListener('input', () => values.set(field.key, textarea.value));
}

// ---------- number バリデーション（型 + min/max 範囲） ----------

export type NumberFieldErrorReason = 'invalid' | 'min' | 'max';

export interface NumberFieldError {
    key: string;
    reason: NumberFieldErrorReason;
}

/**
 * number フィールドの入力値を検証する。
 * - 数値として解釈できない場合（空文字は対象外。空欄の必須チェックは highlightRequiredErrors が担当）
 * - min / max の範囲外の場合
 * にエラーとして扱い、該当する入力欄に fb-error クラスを付与する。
 *
 * 注意: このメソッドは highlightRequiredErrors とは異なり、呼び出し時に .fb-error を
 * 一括リセットしない。同一送信フローの中で highlightRequiredErrors の後に呼び出し、
 * 両方のチェック結果を重ねて表示できるようにするための設計。
 */
export function validateNumberFields(
    containerEl: HTMLElement,
    fields: FormField[],
    values: ValueStore
): NumberFieldError[] {
    const errors: NumberFieldError[] = [];

    for (const field of fields) {
        if (field.type !== 'number') continue;

        const raw = values.get(field.key);
        if (raw === undefined || raw === '') continue; // 空欄は required 側の担当
        if (typeof raw !== 'string') continue;

        const num = Number(raw);
        let reason: NumberFieldErrorReason | null = null;

        if (Number.isNaN(num)) {
            reason = 'invalid';
        } else if (field.min !== undefined && num < field.min) {
            reason = 'min';
        } else if (field.max !== undefined && num > field.max) {
            reason = 'max';
        }

        if (reason) {
            errors.push({ key: field.key, reason });
            const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
            if (el) el.addClass('fb-error');
        }
    }

    return errors;
}

// ---------- required バリデーション ----------

export function highlightRequiredErrors(
    containerEl: HTMLElement,
    fields: FormField[],
    values: ValueStore
): string[] {
    containerEl.querySelectorAll('.fb-error').forEach(el => el.removeClass('fb-error'));

    const missing: string[] = [];
    for (const field of fields) {
        if (!field.required) continue;
        const value = values.get(field.key);

        // checkbox は required の対象外（false も有効な値のため）
        // multilist は空行除去後に1行以上あれば有効
        const isEmpty = field.type === 'checkbox'
            ? false
            : field.type === 'multilist'
            ? (typeof value !== 'string' || value.split('\n').map(l => l.trim()).filter(Boolean).length === 0)
            : (value === undefined || value === '' ||
               (Array.isArray(value) && value.length === 0));

        if (isEmpty) {
            missing.push(field.key);
            const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
            if (el) el.addClass('fb-error');
        }
    }
    return missing;
}
