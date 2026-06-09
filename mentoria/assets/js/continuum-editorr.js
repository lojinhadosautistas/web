/* ==========================================================
CONTINUUM EDITOR
Memória Operacional Longitudinal
========================================================== */

class ContinuumEditor {

    constructor() {

        this.storageKey = "continuumSylviaEditor";

        this.editor = null;

        this.isSaving = false;

        this.autosaveInterval = 30000;

        this.init();

    }

    /* ==========================================================
    INIT
    ========================================================== */

    async init() {

        if (!document.getElementById("editorjs")) return;

        const savedData = this.load();

        this.editor = new EditorJS({

            holder: "editorjs",

            autofocus: true,

            placeholder:
                "Registre observações, aprendizados, decisões e hipóteses...",

            data: savedData || this.defaultData(),

            tools: {

                header: {
                    class: Header,
                    inlineToolbar: true
                },

                list: {
                    class: EditorjsList,
                    inlineToolbar: true
                },

                checklist: {
                    class: Checklist,
                    inlineToolbar: true
                },

                quote: {
                    class: Quote,
                    inlineToolbar: true
                },

                delimiter: Delimiter

            },

            onReady: () => {

                console.log("✓ Continuum Editor iniciado");

                this.bindEvents();

                this.startAutosave();

                this.updateStatus("Pronto");

            },

            onChange: () => {

                this.updateStatus("Editando...");

            }

        });

    }

    /* ==========================================================
    DADOS PADRÃO
    ========================================================== */

    defaultData() {

        return {

            time: Date.now(),

            blocks: [

                {
                    type: "header",
                    data: {
                        text: "Painel Vivo Continuum",
                        level: 2
                    }
                },

                {
                    type: "paragraph",
                    data: {
                        text:
                            "Este espaço registra observações, decisões, aprendizados e continuidade operacional."
                    }
                }

            ]

        };

    }

    /* ==========================================================
    SALVAR
    ========================================================== */

    async save() {

        if (!this.editor) return;

        if (this.isSaving) return;

        try {

            this.isSaving = true;

            this.updateStatus("Salvando...");

            const output = await this.editor.save();

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(output)
            );

            this.updateStatus(
                `Salvo ${new Date().toLocaleTimeString()}`
            );

            console.log("✓ Continuum salvo");

            document.dispatchEvent(
                new CustomEvent(
                    "continuumSaved",
                    {
                        detail: output
                    }
                )
            );

        } catch (error) {

            console.error(error);

            this.updateStatus("Erro ao salvar");

        } finally {

            this.isSaving = false;

        }

    }

    /* ==========================================================
    CARREGAR
    ========================================================== */

    load() {

        try {

            const raw =
                localStorage.getItem(this.storageKey);

            if (!raw) return null;

            return JSON.parse(raw);

        } catch (error) {

            console.error(error);

            return null;

        }

    }

    /* ==========================================================
    LIMPAR
    ========================================================== */

    clear() {

        if (
            !confirm(
                "Deseja realmente apagar toda a memória local?"
            )
        ) return;

        localStorage.removeItem(
            this.storageKey
        );

        location.reload();

    }

    /* ==========================================================
    EXPORTAR
    ========================================================== */

    async exportJSON() {

        const data =
            await this.editor.save();

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            `continuum-${
                new Date()
                    .toISOString()
                    .split("T")[0]
            }.json`;

        a.click();

        URL.revokeObjectURL(url);

    }

    /* ==========================================================
    IMPORTAR
    ========================================================== */

    async importJSON(file) {

        const text =
            await file.text();

        const data =
            JSON.parse(text);

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(data)
        );

        location.reload();

    }

    /* ==========================================================
    NOVA NOTA
    ========================================================== */

    async addNote(title) {

        await this.editor.blocks.insert(
            "header",
            {
                text: title,
                level: 3
            }
        );

    }

    /* ==========================================================
    STATUS
    ========================================================== */

    updateStatus(text) {

        const status =
            document.getElementById(
                "editorStatus"
            );

        if (status)
            status.textContent = text;

    }

    /* ==========================================================
    AUTOSAVE
    ========================================================== */

    startAutosave() {

        setInterval(() => {

            this.save();

        }, this.autosaveInterval);

    }

    /* ==========================================================
    EVENTOS
    ========================================================== */

    bindEvents() {

        document
            .getElementById("saveEditor")
            ?.addEventListener(
                "click",
                () => this.save()
            );

        document
            .getElementById("exportEditor")
            ?.addEventListener(
                "click",
                () => this.exportJSON()
            );

        document
            .getElementById("clearEditor")
            ?.addEventListener(
                "click",
                () => this.clear()
            );

        window.addEventListener(
            "beforeunload",
            () => this.save()
        );

    }

}

/* ==========================================================
INSTÂNCIA GLOBAL
========================================================== */

window.Continuum = new ContinuumEditor();
