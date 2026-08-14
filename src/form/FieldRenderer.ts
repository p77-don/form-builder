import type { App } from 'obsidian';
import type { FormField, ValueStore } from '../model/FieldModel';
import { FolderSuggestModal } from './FolderSuggestModal';

/** renderField / renderText が folder ピッカーを描画するために必要な文言・依存先。 */
export interface FieldRenderContext {
    app: App;
    multilistHint: string;
    folderPickerBtnLabel: string;
    folderPickerPlaceholder: string;
}

export function renderField(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    ctx: FieldRenderContext
): void {
    switch (field.type) {
        case 'text':        renderText(containerEl, field, values, ctx); break;
        case 'textarea':    renderTextarea(containerEl, field, values); break;
        case 'number':      renderNumber(containerEl, field, values); break;
        case 'date':        renderDate(containerEl, field, values); break;
        case 'checkbox':    renderCheckbox(containerEl, field, values); break;
        case 'select':      renderSelect(containerEl, field, values); break;
        case 'multiselect': renderMultiselect(containerEl, field, values); break;
        case 'multilist':   renderList(containerEl, field, values, ctx.multilistHint); break;
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

function appendLabelRow(card: HTMLElement, field: FormField): void {
    const labelRow = card.createDiv({ cls: 'fb-label-row' });
    labelRow.createSpan({ cls: 'fb-label', text: field.label ?? field.key });
    if (field.required) {
        labelRow.createSpan({ cls: 'fb-required-mark', text: '*' });
    }
    if (field.description) {
        card.createDiv({ cls: 'fb-desc', text: field.description });
    }
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
    appendLabelRow(card, field);

    // folder オプションがない場合は従来通り input のみを表示する
    if (!field.folder) {
        const input = card.createEl('input', { cls: 'fb-input' });
        input.type = 'text';
        input.value = field.default ?? '';
        if (field.placeholder) input.placeholder = field.placeholder;
        input.addEventListener('input', () => values.set(field.key, input.value));
        return;
    }

    // folder オプションあり: input の隣にフォルダ選択ボタンを表示する。
    // 値自体はあくまで通常の文字列のため、選択後も自由に手入力で編集できる。
    const row = card.createDiv({ cls: 'fb-input-row' });
    const input = row.createEl('input', { cls: 'fb-input' });
    input.type = 'text';
    input.value = field.default ?? '';
    if (field.placeholder) input.placeholder = field.placeholder;
    input.addEventListener('input', () => values.set(field.key, input.value));

    const pickBtn = row.createEl('button', { cls: 'fb-folder-picker-btn', text: '📁' });
    pickBtn.type = 'button';
    pickBtn.title = ctx.folderPickerBtnLabel;
    pickBtn.addEventListener('click', () => {
        new FolderSuggestModal(ctx.app, input.value, ctx.folderPickerPlaceholder, (folder) => {
            input.value = folder.path;
            values.set(field.key, folder.path);
        }).open();
    });
}

// ---------- textarea ----------

function renderTextarea(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);
    const textarea = card.createEl('textarea', { cls: 'fb-textarea' });
    textarea.value = field.default ?? '';
    if (field.placeholder) textarea.placeholder = field.placeholder;
    const rows = (field as { rows?: number }).rows;
    textarea.rows = (rows && rows > 0) ? rows : 5;
    textarea.addEventListener('input', () => values.set(field.key, textarea.value));
}

// ---------- number ----------

function renderNumber(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);
    const input = card.createEl('input', { cls: 'fb-input' });
    input.type = 'number';
    const nf = field as { min?: number; max?: number };
    if (nf.min !== undefined) input.min = String(nf.min);
    if (nf.max !== undefined) input.max = String(nf.max);
    if (field.placeholder) input.placeholder = field.placeholder;
    input.value = field.default ?? '';
    input.addEventListener('input', () => values.set(field.key, input.value));
}

// ---------- date ----------

function renderDate(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);
    const input = card.createEl('input', { cls: 'fb-input' });
    input.type = 'date';
    input.value = field.default ?? '';
    input.addEventListener('change', () => values.set(field.key, input.value));
}

// ---------- checkbox (toggle) ----------

function renderCheckbox(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    const initVal = field.default === 'true';
    values.set(field.key, initVal);
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);
    const wrap = card.createDiv({ cls: 'fb-toggle-wrap' });
    const toggleLabel = wrap.createEl('label', { cls: 'fb-toggle' });
    const input = toggleLabel.createEl('input');
    input.type = 'checkbox';
    input.checked = initVal;
    toggleLabel.createDiv({ cls: 'fb-toggle-track' });
    toggleLabel.createDiv({ cls: 'fb-toggle-thumb' });
    input.addEventListener('change', () => values.set(field.key, input.checked));
}

// ---------- select ----------

function renderSelect(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    const sf = field as { list: string[] };
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);
    const select = card.createEl('select', { cls: 'fb-select' });
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
    select.addEventListener('change', () => values.set(field.key, select.value));
}

// ---------- multiselect (チップ UI) ----------

function renderMultiselect(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore
): void {
    if (field.type !== 'multiselect') return;
    const defaultRaw   = field.default ?? '';
    const defaultItems = defaultRaw
        ? defaultRaw.split(';').map(s => s.trim()).filter(s => field.list.includes(s))
        : [];
    const selected = new Set<string>(defaultItems);
    values.set(field.key, [...selected]);

    const card = createCard(containerEl, field);
    appendLabelRow(card, field);

    const chipGroup = card.createDiv({ cls: 'fb-chip-group' });
    for (const item of field.list) {
        const chipWrap = chipGroup.createDiv({ cls: 'fb-chip' });
        const id = `fb-chip-${field.key}-${item}`;
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
    }
}

// ---------- list（自由入力・1行1項目） ----------

function renderList(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore,
    multilistHint: string
): void {
    if (field.type !== 'multilist') return;
    values.set(field.key, field.default ?? '');
    const card = createCard(containerEl, field);
    appendLabelRow(card, field);

    // ヒントテキスト（description が指定されていない場合のみ表示）
    if (!field.description) {
        card.createDiv({ cls: 'fb-desc', text: multilistHint });
    }

    const textarea = card.createEl('textarea', { cls: 'fb-textarea fb-list-input' });
    textarea.value = field.default ?? '';
    if (field.placeholder) textarea.placeholder = field.placeholder;
    textarea.rows = (field.rows && field.rows > 0) ? field.rows : 4;
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
