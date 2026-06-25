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
var DEFAULT_SETTINGS = {
  templateFolder: "Templates"
};
var FormBuilderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setHeading().setName("Form Builder Settings");
    new import_obsidian.Setting(containerEl).setName("Template folder").setDesc("Folder to look for template files. Markdown files in this folder will be treated as templates.").addText((text) => text.setPlaceholder("Templates").setValue(this.plugin.settings.templateFolder).onChange(async (value) => {
      this.plugin.settings.templateFolder = value.trim();
      await this.plugin.saveSettings();
    }));
  }
};

// src/form/FormModal.ts
var import_obsidian4 = require("obsidian");

// src/form/FieldRenderer.ts
var import_obsidian2 = require("obsidian");
function renderField(containerEl, field, values) {
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
  }
}
function labelOf(field) {
  var _a;
  return (_a = field.label) != null ? _a : field.key;
}
function descOf(field) {
  var _a;
  return (_a = field.description) != null ? _a : "";
}
function createNameEl(containerEl, field) {
  const el = containerEl.createSpan();
  el.textContent = labelOf(field);
  if (field.required) {
    const mark = el.createSpan({ cls: "form-builder-required-mark" });
    mark.textContent = " *";
  }
  return el;
}
function renderText(containerEl, field, values) {
  var _a;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addText((text) => {
    var _a2, _b;
    return text.setPlaceholder((_a2 = field.placeholder) != null ? _a2 : "").setValue((_b = field.default) != null ? _b : "").onChange((value) => values.set(field.key, value));
  });
  if (field.required) {
    setting.settingEl.dataset.formKey = field.key;
    setting.settingEl.addClass("form-builder-field");
  }
}
function renderTextarea(containerEl, field, values) {
  var _a;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addTextArea((area) => {
    var _a2, _b;
    area.setPlaceholder((_a2 = field.placeholder) != null ? _a2 : "").setValue((_b = field.default) != null ? _b : "").onChange((value) => values.set(field.key, value));
    const rows = field.rows;
    if (rows && rows > 0) {
      area.inputEl.rows = rows;
    } else {
      area.inputEl.rows = 5;
    }
  });
  if (field.required) {
    setting.settingEl.dataset.formKey = field.key;
    setting.settingEl.addClass("form-builder-field");
  }
}
function renderNumber(containerEl, field, values) {
  var _a;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addText((text) => {
    var _a2;
    text.inputEl.type = "number";
    const nf = field;
    if (nf.min !== void 0)
      text.inputEl.min = String(nf.min);
    if (nf.max !== void 0)
      text.inputEl.max = String(nf.max);
    if (field.placeholder)
      text.inputEl.placeholder = field.placeholder;
    text.setValue((_a2 = field.default) != null ? _a2 : "").onChange((value) => values.set(field.key, value));
  });
  if (field.required) {
    setting.settingEl.dataset.formKey = field.key;
    setting.settingEl.addClass("form-builder-field");
  }
}
function renderDate(containerEl, field, values) {
  var _a;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addText((text) => {
    var _a2;
    text.inputEl.type = "date";
    text.setValue((_a2 = field.default) != null ? _a2 : "").onChange((value) => values.set(field.key, value));
  });
  if (field.required) {
    setting.settingEl.dataset.formKey = field.key;
    setting.settingEl.addClass("form-builder-field");
  }
}
function renderCheckbox(containerEl, field, values) {
  const initVal = field.default === "true";
  values.set(field.key, initVal);
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addToggle((toggle) => toggle.setValue(initVal).onChange((value) => values.set(field.key, value)));
}
function renderSelect(containerEl, field, values) {
  var _a;
  const sf = field;
  values.set(field.key, (_a = field.default) != null ? _a : "");
  const setting = new import_obsidian2.Setting(containerEl).setDesc(descOf(field));
  setting.nameEl.empty();
  setting.nameEl.appendChild(createNameEl(containerEl, field));
  setting.addDropdown((drop) => {
    var _a2;
    drop.addOption("", "---");
    for (const item of sf.list)
      drop.addOption(item, item);
    const defaultVal = (_a2 = field.default) != null ? _a2 : "";
    if (defaultVal && sf.list.includes(defaultVal)) {
      drop.setValue(defaultVal);
    } else {
      drop.setValue("");
    }
    drop.onChange((value) => values.set(field.key, value));
  });
  if (field.required) {
    setting.settingEl.dataset.formKey = field.key;
    setting.settingEl.addClass("form-builder-field");
  }
}
function renderMultiselect(containerEl, field, values) {
  var _a;
  const defaultRaw = (_a = field.default) != null ? _a : "";
  const defaultItems = defaultRaw ? defaultRaw.split(";").map((s) => s.trim()).filter((s) => field.list.includes(s)) : [];
  const selected = new Set(defaultItems);
  values.set(field.key, [...selected]);
  const wrapper = containerEl.createDiv({ cls: "form-builder-multiselect" });
  if (field.required) {
    wrapper.dataset.formKey = field.key;
    wrapper.addClass("form-builder-field");
  }
  const titleSetting = new import_obsidian2.Setting(wrapper).setDesc(descOf(field));
  titleSetting.nameEl.empty();
  titleSetting.nameEl.appendChild(createNameEl(wrapper, field));
  const checkGroup = wrapper.createDiv({ cls: "form-builder-multiselect-group" });
  for (const item of field.list) {
    const label = checkGroup.createEl("label", { cls: "form-builder-multiselect-item" });
    const checkbox = label.createEl("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected.has(item);
    label.createSpan({ text: item });
    checkbox.addEventListener("change", () => {
      if (checkbox.checked)
        selected.add(item);
      else
        selected.delete(item);
      values.set(field.key, [...selected]);
    });
  }
}
function highlightRequiredErrors(containerEl, fields, values) {
  containerEl.querySelectorAll(".form-builder-required-error").forEach((el) => {
    el.removeClass("form-builder-required-error");
  });
  const missing = [];
  for (const field of fields) {
    if (!field.required)
      continue;
    const value = values.get(field.key);
    const isEmpty = value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || value === false;
    if (isEmpty) {
      missing.push(field.key);
      const el = containerEl.querySelector(`[data-form-key="${field.key}"]`);
      if (el)
        el.addClass("form-builder-required-error");
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
function formatMarkdownList(values, style) {
  if (style === "1.") {
    return values.map((v, i) => `${i + 1}. ${v}`).join("\n");
  }
  return values.map((v) => `${style} ${v}`).join("\n");
}
function formatMultiselect(selected, field) {
  var _a;
  if (field.markdownlist) {
    return formatMarkdownList(selected, field.markdownlist);
  }
  const sep = (_a = field.separator) != null ? _a : ", ";
  return selected.join(sep);
}
function formatValue(value, field) {
  if (value === void 0 || value === null)
    return "";
  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    return formatMultiselect(selected, field);
  }
  if (field.type === "checkbox") {
    return value === true || value === "true" ? "true" : "false";
  }
  if (Array.isArray(value))
    return value.join(", ");
  return String(value);
}
function resolveUserVariables(template, values, fields) {
  let result = template;
  for (const field of fields) {
    const value = values.get(field.key);
    const expanded = formatValue(value, field);
    result = result.split(`$${field.key}$`).join(expanded);
  }
  return result;
}
function resolveSystemVariables(template) {
  const now = new Date();
  return template.split("%timestamp%").join(formatTimestamp(now)).split("%date%").join(formatDate(now)).split("%time%").join(formatTime(now));
}
function resolveFilenamePreview(filenameTemplate, fields) {
  let result = filenameTemplate;
  for (const field of fields) {
    result = result.split(`$${field.key}$`).join("");
  }
  result = resolveSystemVariables(result);
  return result;
}

// src/generator/NoteGenerator.ts
var INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;
function sanitizeFileName(name) {
  const sanitized = name.replace(INVALID_FILENAME_CHARS, "_");
  if (sanitized !== name) {
    new import_obsidian3.Notice(`Form Builder: Some invalid characters in the file name were replaced with "_".`);
  }
  return sanitized;
}
async function ensureFolder(app, folderPath) {
  if (!folderPath)
    return;
  const folder = app.vault.getFolderByPath(folderPath);
  if (!folder) {
    await app.vault.createFolder(folderPath);
  }
}
async function generateNote(app, bodyTemplate, values, fields, meta, outputFolder, fileName) {
  let content = resolveUserVariables(bodyTemplate, values, fields);
  content = resolveSystemVariables(content);
  let resolvedFileName = resolveSystemVariables(fileName);
  resolvedFileName = sanitizeFileName(resolvedFileName);
  if (!resolvedFileName.endsWith(".md")) {
    resolvedFileName += ".md";
  }
  await ensureFolder(app, outputFolder);
  const filePath = outputFolder ? (0, import_obsidian3.normalizePath)(`${outputFolder}/${resolvedFileName}`) : (0, import_obsidian3.normalizePath)(resolvedFileName);
  await app.vault.create(filePath, content);
  const file = app.vault.getFileByPath(filePath);
  if (file) {
    await app.workspace.getLeaf().openFile(file);
  }
}

// src/form/FormModal.ts
var FormModal = class extends import_obsidian4.Modal {
  constructor(app, parseResult) {
    var _a;
    super(app);
    this.values = /* @__PURE__ */ new Map();
    this.parseResult = parseResult;
    this.outputFolder = (_a = parseResult.meta.folder) != null ? _a : "";
    this.fileName = parseResult.meta.filename ? resolveFilenamePreview(parseResult.meta.filename, parseResult.fields) : "Untitled";
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.setTitle("Form Builder");
    this.renderWarnings();
    this.renderMetaSection();
    this.renderFields();
    this.renderSubmitButton();
  }
  onClose() {
    this.contentEl.empty();
  }
  // ---------- 警告ブロック ----------
  renderWarnings() {
    if (this.parseResult.warnings.length === 0)
      return;
    const warningBlock = this.contentEl.createDiv({ cls: "form-builder-warning-block" });
    for (const w of this.parseResult.warnings) {
      const div = warningBlock.createDiv({ cls: "form-builder-warning" });
      div.createSpan({ text: `\u26A0 ${w.message}` });
    }
  }
  // ---------- 出力フォルダ・ファイル名 ----------
  renderMetaSection() {
    const { contentEl } = this;
    new import_obsidian4.Setting(contentEl).setName("Output folder").setDesc("Folder where the note will be saved.").addText((text) => text.setPlaceholder("e.g. Notes/Characters").setValue(this.outputFolder).onChange((value) => {
      this.outputFolder = value;
    }));
    new import_obsidian4.Setting(contentEl).setName("File name").setDesc("Name of the note to create (without .md extension).").addText((text) => text.setValue(this.fileName).onChange((value) => {
      this.fileName = value;
    }));
  }
  // ---------- フィールド群 ----------
  renderFields() {
    const { contentEl } = this;
    if (this.parseResult.fields.length > 0) {
      contentEl.createEl("hr");
    }
    for (const field of this.parseResult.fields) {
      renderField(contentEl, field, this.values);
    }
  }
  // ---------- 送信ボタン ----------
  renderSubmitButton() {
    const { contentEl } = this;
    contentEl.createEl("hr");
    new import_obsidian4.Setting(contentEl).addButton((btn) => btn.setButtonText("Create Note").setCta().onClick(() => this.onSubmit()));
  }
  // ---------- 送信処理 ----------
  async onSubmit() {
    const missing = highlightRequiredErrors(
      this.contentEl,
      this.parseResult.fields,
      this.values
    );
    if (missing.length > 0) {
      new import_obsidian4.Notice(`Form Builder: Please fill in all required fields.`);
      return;
    }
    const rawFileName = this.fileName.trim() || "Untitled";
    try {
      await generateNote(
        this.app,
        this.parseResult.bodyTemplate,
        this.values,
        this.parseResult.fields,
        this.parseResult.meta,
        this.outputFolder.trim(),
        rawFileName
      );
      this.close();
    } catch (e) {
      console.error("Form Builder: Failed to create note", e);
      const message = e instanceof Error ? e.message : String(e);
      new import_obsidian4.Notice(`Form Builder: Failed to create note.
${message}`, 8e3);
    }
  }
};
var TemplateSelectorModal = class extends import_obsidian4.Modal {
  constructor(app, templates, onSelect) {
    super(app);
    this.templates = templates;
    this.onSelect = onSelect;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.setTitle("Select Template");
    const listEl = contentEl.createEl("ul", { cls: "form-builder-template-list" });
    for (const file of this.templates) {
      const li = listEl.createEl("li", { cls: "form-builder-template-item" });
      const btn = li.createEl("button", { cls: "form-builder-template-btn" });
      btn.textContent = file.basename;
      btn.addEventListener("click", () => {
        this.close();
        this.onSelect(file);
      });
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var NoTemplateModal = class extends import_obsidian4.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.setTitle("Welcome to Form Builder");
    contentEl.createEl("p", {
      text: "No templates found. Please create a template file and place it in your template folder."
    });
    const exampleBlock = contentEl.createEl("pre", { cls: "form-builder-example" });
    exampleBlock.createEl("code", {
      text: [
        "```formbuilder",
        "{{text|name|label=[\u540D\u524D]}}",
        "{{textarea|description|label=[\u8AAC\u660E]}}",
        "```"
      ].join("\n")
    });
    new import_obsidian4.Setting(contentEl).addButton((btn) => btn.setButtonText("Open Settings").onClick(() => {
      this.close();
      this.app.setting.open();
    })).addButton((btn) => btn.setButtonText("Documentation").onClick(() => {
      window.open("https://github.com/your-repo/form-builder#readme");
    })).addButton((btn) => btn.setButtonText("Close").onClick(() => this.close()));
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
  "multiselect"
]);
var KNOWN_FIELD_OPTIONS = {
  text: ["required", "label", "placeholder", "description", "default"],
  textarea: ["required", "label", "placeholder", "description", "default", "rows"],
  number: ["required", "label", "placeholder", "description", "default", "min", "max"],
  date: ["required", "label", "placeholder", "description", "default"],
  checkbox: ["required", "label", "description", "default"],
  select: ["required", "label", "description", "default", "list"],
  multiselect: ["required", "label", "description", "default", "list", "rows", "separator", "markdownlist"]
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
    return {
      message: `Invalid key: "${key}". Keys must match [a-zA-Z0-9_-]`,
      line
    };
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
      errors.push({
        message: `"${field.type}" requires the "list" option`,
        line
      });
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
    const defaultValues = field.default.split(";").map((s) => s.trim());
    for (const dv of defaultValues) {
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
  if (field.type === "multiselect") {
    if (field.separator !== void 0 && field.markdownlist !== void 0) {
      warnings.push({
        message: `Both "separator" and "markdownlist" are set in field "${field.key}". The first-defined one takes priority.`,
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
var FORMBUILDER_BLOCK_RE = /^```formbuilder\s*\n([\s\S]*?)\n```/m;
var FIELD_SYNTAX_RE = /^\{\{([\s\S]*?)\}\}$/;
var KV_OPTION_RE = /^([a-zA-Z_-]+)=\[([^\]]*)\]$/;
function trimSpaces(s) {
  return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}
function parseList(raw) {
  return raw.split(";").map((item) => trimSpaces(item));
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
  if (kvMatch) {
    return { key: kvMatch[1], value: kvMatch[2] };
  }
  if (/^[a-zA-Z_-]+$/.test(token)) {
    return { key: token, value: null };
  }
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
    if (opt.key === "folder" && opt.value !== null) {
      meta.folder = opt.value;
    } else if (opt.key === "filename" && opt.value !== null) {
      meta.filename = opt.value;
    }
  }
}
function parseFieldLine(tokens, errors, warnings, lineNum) {
  var _a, _b, _c, _d, _e, _f;
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
  const optionOrder = [];
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
      optionOrder.push(opt.key);
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
      const min = minStr !== void 0 && minStr !== null ? parseFloat(minStr) : void 0;
      const max = maxStr !== void 0 && maxStr !== null ? parseFloat(maxStr) : void 0;
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
      if (listRaw === void 0 || listRaw === null) {
        errors.push({ message: `"select" requires the "list" option in field "${key}"`, line: lineNum });
        return null;
      }
      return { type: "select", ...base, list: parseList(listRaw) };
    }
    case "multiselect": {
      const listRaw = optMap.get("list");
      if (listRaw === void 0 || listRaw === null) {
        errors.push({ message: `"multiselect" requires the "list" option in field "${key}"`, line: lineNum });
        return null;
      }
      const list = parseList(listRaw);
      const separatorIdx = optionOrder.indexOf("separator");
      const markdownlistIdx = optionOrder.indexOf("markdownlist");
      let separator = void 0;
      let markdownlist = void 0;
      if (separatorIdx !== -1 && markdownlistIdx !== -1) {
        warnings.push({
          message: `Both "separator" and "markdownlist" are set in field "${key}". "${optionOrder[Math.min(separatorIdx, markdownlistIdx)]}" takes priority.`,
          line: lineNum
        });
        if (separatorIdx < markdownlistIdx) {
          separator = (_e = optMap.get("separator")) != null ? _e : void 0;
        } else {
          const ml = optMap.get("markdownlist");
          if (ml === "-" || ml === "*" || ml === "1.")
            markdownlist = ml;
        }
      } else {
        if (separatorIdx !== -1)
          separator = (_f = optMap.get("separator")) != null ? _f : void 0;
        if (markdownlistIdx !== -1) {
          const ml = optMap.get("markdownlist");
          if (ml === "-" || ml === "*" || ml === "1.")
            markdownlist = ml;
          else if (ml !== void 0) {
            warnings.push({
              message: `Invalid markdownlist value "${ml}" in field "${key}". Must be "-", "*", or "1."`,
              line: lineNum
            });
          }
        }
      }
      const msField = { type: "multiselect", ...base, list };
      if (separator !== void 0)
        msField.separator = separator;
      if (markdownlist !== void 0)
        msField.markdownlist = markdownlist;
      const rowsStr = optMap.get("rows");
      if (rowsStr) {
        msField.rows = parseInt(rowsStr, 10);
      }
      return msField;
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
    return {
      meta,
      fields,
      bodyTemplate: templateContent,
      errors,
      warnings
    };
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
    if (!syntaxMatch) {
      continue;
    }
    const inner = syntaxMatch[1];
    const tokens = splitTokens(inner);
    if (tokens.length === 0 || tokens[0] === "")
      continue;
    const firstToken = tokens[0];
    if (firstToken === "meta") {
      parseMetaLine(tokens, meta, warnings, lineNum);
    } else {
      const field = parseFieldLine(tokens, errors, warnings, lineNum);
      if (field) {
        const vr = validateField(field, lineNum);
        errors.push(...vr.errors);
        warnings.push(...vr.warnings);
        if (vr.errors.length === 0) {
          fields.push(field);
        }
      }
    }
  }
  return { meta, fields, bodyTemplate, errors, warnings };
}

// src/ui/ErrorNotice.ts
var import_obsidian5 = require("obsidian");
function showFatalError(errors) {
  const messages = errors.map((e) => {
    const lineInfo = e.line ? ` (line ${e.line})` : "";
    return `\u2022 ${e.message}${lineInfo}`;
  }).join("\n");
  new import_obsidian5.Notice(`Form Builder Error:
${messages}`, 8e3);
}

// src/main.ts
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
  /**
   * テンプレートフォルダから Markdown ファイルを取得し、
   * テンプレート選択 → フォーム表示 の流れを起動する
   */
  async openTemplatePicker() {
    const folderPath = this.settings.templateFolder;
    const templates = this.app.vault.getMarkdownFiles().filter(
      (f) => f.path.startsWith(folderPath + "/") || f.path.startsWith(folderPath + "\\")
    );
    if (templates.length === 0) {
      new NoTemplateModal(this.app, this).open();
      return;
    }
    if (templates.length === 1) {
      await this.openFormForTemplate(templates[0]);
    } else {
      new TemplateSelectorModal(this.app, templates, async (file) => {
        await this.openFormForTemplate(file);
      }).open();
    }
  }
  /**
   * 指定テンプレートファイルを読み込んでフォームを表示する
   */
  async openFormForTemplate(file) {
    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new import_obsidian6.Notice(`Form Builder: Failed to read template file "${file.path}".`);
      return;
    }
    const parseResult = parseTemplate(content);
    if (parseResult.errors.length > 0) {
      showFatalError(parseResult.errors);
      return;
    }
    new FormModal(this.app, parseResult).open();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
