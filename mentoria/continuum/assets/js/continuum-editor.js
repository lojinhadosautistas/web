/* ==========================================================
CONTINUUM EDITOR v2.0
Memória Operacional Longitudinal
========================================================== */

class ContinuumEditor {

    constructor() {

        this.version = "2.0";

        this.storageKey = "continuumSylviaEditor";

        this.editor = null;

        this.isSaving = false;

        this.hasChanges = false;

        this.autosaveTimer = null;

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

            onReady: async () => {

                console.log(
                    `✓ Continuum Editor v${this.version}`
                );

                this.bindEvents();

                this.startAutosave();

                this.updateStatus("Pronto");

                this.updateMetrics();

            },

            onChange: () => {

                this.hasChanges = true;

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
    SAVE
    ========================================================== */

    async save(force = false) {

        if (!this.editor) return;

        if (this.isSaving) return;

        if (!this.hasChanges && !force) return;

        try {

            this.isSaving = true;

            this.updateStatus("Salvando...");

            const output =
                await this.editor.save();

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(output)
            );

            this.hasChanges = false;

            const now =
                new Date().toLocaleTimeString();

            this.updateStatus(
                `Salvo ${now}`
            );

            this.updateMetrics();

            document.dispatchEvent(

                new CustomEvent(
                    "continuumSaved",
                    {
                        detail: output
                    }
                )

            );

        } catch(error) {

            console.error(error);

            this.updateStatus(
                "Erro ao salvar"
            );

        } finally {

            this.isSaving = false;

        }

    }

    /* ==========================================================
    LOAD
    ========================================================== */

    load() {

        try {

            const raw =
                localStorage.getItem(
                    this.storageKey
                );

            if (!raw) return null;

            return JSON.parse(raw);

        } catch(error) {

            console.error(error);

            return null;

        }

    }

    /* ==========================================================
    CLEAR
    ========================================================== */

    clear() {

        const confirmDelete = confirm(
            "Deseja apagar toda a memória local?"
        );

        if (!confirmDelete) return;

        localStorage.removeItem(
            this.storageKey
        );

        location.reload();

    }

    /* ==========================================================
    SNAPSHOT
    ========================================================== */

    async exportJSON() {

        try {

            const output =
                await this.editor.save();

            const snapshot = {

                continuum: "Sylvia",

                version: this.version,

                exportedAt:
                    new Date().toISOString(),

                data: output

            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            snapshot,
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

            const date =
                new Date()
                .toISOString()
                .split("T")[0];

            a.href = url;

            a.download =
                `continuum-snapshot-${date}.json`;

            a.click();

            URL.revokeObjectURL(url);

            this.updateStatus(
                "Snapshot exportado"
            );

        } catch(error) {

            console.error(error);

        }

    }

    /* ==========================================================
    RESTORE
    ========================================================== */

    async importJSON(file) {

        try {

            const text =
                await file.text();

            const snapshot =
                JSON.parse(text);

            const data =
                snapshot.data || snapshot;

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(data)
            );

            alert(
                "Snapshot restaurado."
            );

            location.reload();

        } catch(error) {

            console.error(error);

            alert(
                "Arquivo inválido."
            );

        }

    }

    /* ==========================================================
    ADD NOTE
    ========================================================== */

    async addNote(title) {

        if (!this.editor) return;

        await this.editor.blocks.insert(
            "header",
            {
                text: title,
                level: 3
            }
        );

        this.hasChanges = true;

    }

    /* ==========================================================
    STATUS
    ========================================================== */

    updateStatus(text) {

        const el =
            document.getElementById(
                "editorStatus"
            );

        if (el)
            el.textContent = text;

    }

    /* ==========================================================
    MÉTRICAS
    ========================================================== */

    async updateMetrics() {

        try {

            const data =
                await this.editor.save();

            const notes =
                document.getElementById(
                    "metricNotes"
                );

            const update =
                document.getElementById(
                    "metricUpdate"
                );

            if (notes)
                notes.textContent =
                    data.blocks.length;

            if (update)
                update.textContent =
                    new Date()
                    .toLocaleTimeString();

        } catch(error) {

            console.warn(error);

        }

    }

    /* ==========================================================
    AUTOSAVE
    ========================================================== */

    startAutosave() {

        if (this.autosaveTimer)
            clearInterval(
                this.autosaveTimer
            );

        this.autosaveTimer =
            setInterval(() => {

                this.save();

            }, this.autosaveInterval);

    }

    /* ==========================================================
    EVENTS
    ========================================================== */

    bindEvents() {

        document
        .getElementById("saveEditor")
        ?.addEventListener(
            "click",
            () => this.save(true)
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

        document
        .getElementById("importEditor")
        ?.addEventListener(
            "click",
            () => {

                document
                .getElementById(
                    "importFile"
                )
                ?.click();

            }
        );

        document
        .getElementById("importFile")
        ?.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files[0];

                if (file)
                    this.importJSON(file);

            }
        );

        window.addEventListener(
            "beforeunload",
            () => {

                this.save(true);

            }
        );

    }

}

/* ==========================================================
API GLOBAL
========================================================== */

window.Continuum =
    new ContinuumEditor();
