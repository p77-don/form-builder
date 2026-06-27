import { App, Modal } from 'obsidian';
import type { SupportedLocale } from '../locales';
import { getLocale } from '../locales';

export class HelpModal extends Modal {
    private locale: SupportedLocale;

    constructor(app: App, locale: SupportedLocale) {
        super(app);
        this.locale = locale;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();
        const L = getLocale(this.locale);
        this.setTitle(L.helpTitle);

        const root = contentEl.createDiv({ cls: 'fb-modal fb-help' });

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

        const btnRow = root.createDiv({ cls: 'fb-btn-row' });
        btnRow.createEl('button', { cls: 'fb-btn fb-btn-accent', text: L.btnClose })
            .addEventListener('click', () => this.close());
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private section(root: HTMLElement, title: string, paragraphs: string[]): void {
        const sec = root.createDiv({ cls: 'fb-help-section' });
        sec.createDiv({ cls: 'fb-help-section-title', text: title });
        for (const p of paragraphs) {
            sec.createDiv({ cls: 'fb-help-para', text: p });
        }
    }

    private subSection(root: HTMLElement, title: string): void {
        root.createDiv({ cls: 'fb-help-sub-title', text: title });
    }

    private codeBlock(root: HTMLElement, text: string): void {
        root.createEl('pre', { cls: 'fb-example-block' }).createEl('code', { text });
    }

    private table(root: HTMLElement, rows: [string, string][]): void {
        const tbody = root.createEl('table', { cls: 'fb-help-table' }).createEl('tbody');
        for (const [key, desc] of rows) {
            const tr = tbody.createEl('tr');
            tr.createEl('td', { cls: 'fb-help-td-key' }).createEl('code', { text: key });
            tr.createEl('td', { cls: 'fb-help-td-desc', text: desc });
        }
    }
}
