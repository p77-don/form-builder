import { Setting } from 'obsidian';
import type { FormField, MultiselectField } from '../model/FieldModel';

type ValueStore = Map<string, string | string[] | boolean>;

/**
 * フィールドタイプに応じた UI を containerEl に追加する
 */
export function renderField(
    containerEl: HTMLElement,
    field: FormField,
    values: ValueStore
): void {
    switch (field.type) {
        case 'text':      renderText(containerEl, field, values); break;
        case 'textarea':  renderTextarea(containerEl, field, values); break;
        case 'number':    renderNumber(containerEl, field, values); break;
        case 'date':      renderDate(containerEl, field, values); break;
        case 'checkbox':  renderCheckbox(containerEl, field, values); break;
        case 'select':    renderSelect(containerEl, field, values); break;
        case 'multiselect': renderMultiselect(containerEl, field as MultiselectField, values); break;
    }
}

// ---------- helpers ----------

function labelOf(field: FormField): string {
    return field.label ?? field.key;
}

function descOf(field: FormField): string {
    return field.description ?? '';
}

/** required フラグ付きのフィールド名を生成（* マーカー付き） */
function createNameEl(containerEl: HTMLElement, field: FormField): HTMLElement {
    const el = containerEl.createSpan();
    el.textContent = labelOf(field);
    if (field.required) {
        const mark = el.createSpan({ cls: 'form-builder-required-mark' });
        mark.textContent = ' *';
    }
    return el;
}

// ---------- 各フィールドレンダラー ----------

function renderText(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    // 初期値をセット
    values.set(field.key, field.default ?? '');

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addText(text => text
        .setPlaceholder(field.placeholder ?? '')
        .setValue(field.default ?? '')
        .onChange(value => values.set(field.key, value)));

    if (field.required) {
        setting.settingEl.dataset.formKey = field.key;
        setting.settingEl.addClass('form-builder-field');
    }
}

function renderTextarea(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addTextArea(area => {
        area.setPlaceholder(field.placeholder ?? '')
            .setValue(field.default ?? '')
            .onChange(value => values.set(field.key, value));

        const rows = (field as { rows?: number }).rows;
        if (rows && rows > 0) {
            area.inputEl.rows = rows;
        } else {
            area.inputEl.rows = 5;
        }
    });

    if (field.required) {
        setting.settingEl.dataset.formKey = field.key;
        setting.settingEl.addClass('form-builder-field');
    }
}

function renderNumber(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addText(text => {
        text.inputEl.type = 'number';

        const nf = field as { min?: number; max?: number };
        if (nf.min !== undefined) text.inputEl.min = String(nf.min);
        if (nf.max !== undefined) text.inputEl.max = String(nf.max);
        if (field.placeholder) text.inputEl.placeholder = field.placeholder;

        text.setValue(field.default ?? '')
            .onChange(value => values.set(field.key, value));
    });

    if (field.required) {
        setting.settingEl.dataset.formKey = field.key;
        setting.settingEl.addClass('form-builder-field');
    }
}

function renderDate(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    values.set(field.key, field.default ?? '');

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addText(text => {
        text.inputEl.type = 'date';
        text.setValue(field.default ?? '')
            .onChange(value => values.set(field.key, value));
    });

    if (field.required) {
        setting.settingEl.dataset.formKey = field.key;
        setting.settingEl.addClass('form-builder-field');
    }
}

function renderCheckbox(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    const initVal = field.default === 'true';
    values.set(field.key, initVal);

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addToggle(toggle => toggle
        .setValue(initVal)
        .onChange(value => values.set(field.key, value)));
}

function renderSelect(containerEl: HTMLElement, field: FormField, values: ValueStore): void {
    const sf = field as { list: string[] };
    values.set(field.key, field.default ?? '');

    const setting = new Setting(containerEl)
        .setDesc(descOf(field));
    setting.nameEl.empty();
    setting.nameEl.appendChild(createNameEl(containerEl, field));

    setting.addDropdown(drop => {
        drop.addOption('', '---');
        for (const item of sf.list) drop.addOption(item, item);

        // default 値が list に存在する場合のみセット
        const defaultVal = field.default ?? '';
        if (defaultVal && sf.list.includes(defaultVal)) {
            drop.setValue(defaultVal);
        } else {
            drop.setValue('');
        }

        drop.onChange(value => values.set(field.key, value));
    });

    if (field.required) {
        setting.settingEl.dataset.formKey = field.key;
        setting.settingEl.addClass('form-builder-field');
    }
}

function renderMultiselect(
    containerEl: HTMLElement,
    field: MultiselectField,
    values: ValueStore
): void {
    // デフォルト選択状態の計算
    const defaultRaw = field.default ?? '';
    const defaultItems = defaultRaw
        ? defaultRaw.split(';').map(s => s.trim()).filter(s => field.list.includes(s))
        : [];
    const selected = new Set<string>(defaultItems);
    values.set(field.key, [...selected]);

    // ラッパー div
    const wrapper = containerEl.createDiv({ cls: 'form-builder-multiselect' });
    if (field.required) {
        wrapper.dataset.formKey = field.key;
        wrapper.addClass('form-builder-field');
    }

    // タイトル行
    const titleSetting = new Setting(wrapper)
        .setDesc(descOf(field));
    titleSetting.nameEl.empty();
    titleSetting.nameEl.appendChild(createNameEl(wrapper, field));

    // チェックボックスグループ
    const checkGroup = wrapper.createDiv({ cls: 'form-builder-multiselect-group' });
    for (const item of field.list) {
        const label = checkGroup.createEl('label', { cls: 'form-builder-multiselect-item' });
        const checkbox = label.createEl('input');
        checkbox.type = 'checkbox';
        checkbox.checked = selected.has(item);
        label.createSpan({ text: item });

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selected.add(item);
            else selected.delete(item);
            values.set(field.key, [...selected]);
        });
    }
}

/**
 * required フィールドが未入力のものをハイライトする
 * @returns 未入力のキー一覧
 */
export function highlightRequiredErrors(
    containerEl: HTMLElement,
    fields: FormField[],
    values: ValueStore
): string[] {
    // まず既存のエラークラスをリセット
    containerEl.querySelectorAll('.form-builder-required-error').forEach(el => {
        el.removeClass('form-builder-required-error');
    });

    const missing: string[] = [];

    for (const field of fields) {
        if (!field.required) continue;
        const value = values.get(field.key);
        const isEmpty =
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            value === false;

        if (isEmpty) {
            missing.push(field.key);
            // data-form-key 属性でフィールド要素を特定してハイライト
            const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
            if (el) el.addClass('form-builder-required-error');
        }
    }

    return missing;
}
