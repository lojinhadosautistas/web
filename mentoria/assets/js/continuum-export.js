/* ==========================================================
CONTINUUM EXPORT v1.0
Complemento do Continuum Editor
JSON • Markdown • TXT • PDF • DOCX
========================================================== */

class ContinuumExport {

    constructor() {

        this.init();

    }

    /* ==========================================================
    INIT
    ========================================================== */

    init() {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                this.bindEvents();

            }
        );

    }

    /* ==========================================================
    GET DATA
    ========================================================== */

    async getEditorData() {

        if (
            !window.Continuum ||
            !window.Continuum.editor
        ) {

            throw new Error(
                "Continuum Editor não encontrado."
            );

        }

        return await
            window.Continuum.editor.save();

    }

    /* ==========================================================
    TEXT
    ========================================================== */

    async getPlainText() {

        const data =
            await this.getEditorData();

        let text = "";

        data.blocks.forEach(block => {

            switch(block.type) {

                case "header":

                    text +=
                        "\n\n" +
                        block.data.text +
                        "\n";

                    break;

                case "paragraph":

                    text +=
                        block.data.text +
                        "\n\n";

                    break;

                case "quote":

                    text +=
                        `"${block.data.text}"\n\n`;

                    break;

                case "list":

                    block.data.items.forEach(item => {

                        text +=
                            "• " +
                            item +
                            "\n";

                    });

                    text += "\n";

                    break;

                case "checklist":

                    block.data.items.forEach(item => {

                        text +=
                            `[${item.checked ? "x" : " "}] `
                            + item.text +
                            "\n";

                    });

                    text += "\n";

                    break;

            }

        });

        return text;

    }

    /* ==========================================================
    MARKDOWN
    ========================================================== */

    async getMarkdown() {

        const data =
            await this.getEditorData();

        let md = "";

        data.blocks.forEach(block => {

            switch(block.type) {

                case "header":

                    md +=
                        "#".repeat(
                            block.data.level
                        ) +
                        " " +
                        block.data.text +
                        "\n\n";

                    break;

                case "paragraph":

                    md +=
                        block.data.text +
                        "\n\n";

                    break;

                case "quote":

                    md +=
                        "> " +
                        block.data.text +
                        "\n\n";

                    break;

                case "list":

                    block.data.items.forEach(item => {

                        md +=
                            "- " +
                            item +
                            "\n";

                    });

                    md += "\n";

                    break;

                case "checklist":

                    block.data.items.forEach(item => {

                        md +=
                            `- [${item.checked ? "x" : " "}] `
                            + item.text +
                            "\n";

                    });

                    md += "\n";

                    break;

            }

        });

        return md;

    }

    /* ==========================================================
    DOWNLOAD
    ========================================================== */

    download(content, filename, type) {

        const blob =
            new Blob(
                [content],
                { type }
            );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download = filename;

        a.click();

        URL.revokeObjectURL(url);

    }

    /* ==========================================================
    TXT
    ========================================================== */

    async exportTXT() {

        const text =
            await this.getPlainText();

        this.download(

            text,

            `continuum-${this.today()}.txt`,

            "text/plain"

        );

    }

    /* ==========================================================
    MARKDOWN
    ========================================================== */

    async exportMD() {

        const md =
            await this.getMarkdown();

        this.download(

            md,

            `continuum-${this.today()}.md`,

            "text/markdown"

        );

    }

    /* ==========================================================
    PDF
    ========================================================== */

    async exportPDF() {

        if (!window.jspdf) {

            alert(
                "jsPDF não carregado."
            );

            return;

        }

        const text =
            await this.getPlainText();

        const { jsPDF } =
            window.jspdf;

        const doc =
            new jsPDF();

        const lines =
            doc.splitTextToSize(
                text,
                180
            );

        doc.text(
            lines,
            15,
            20
        );

        doc.save(
            `continuum-${this.today()}.pdf`
        );

    }

    /* ==========================================================
    DOCX
    ========================================================== */

    async exportDOCX() {

        if (
            !window.docx ||
            !window.saveAs
        ) {

            alert(
                "Bibliotecas DOCX não carregadas."
            );

            return;

        }

        const text =
            await this.getPlainText();

        const doc =

            new docx.Document({

                sections: [

                    {

                        children: [

                            new docx.Paragraph(
                                text
                            )

                        ]

                    }

                ]

            });

        const blob =
            await docx.Packer.toBlob(
                doc
            );

        saveAs(

            blob,

            `continuum-${this.today()}.docx`

        );

    }

    /* ==========================================================
    DATA
    ========================================================== */

    today() {

        return new Date()

            .toISOString()

            .split("T")[0];

    }

    /* ==========================================================
    EVENTS
    ========================================================== */

    bindEvents() {

        document
        .getElementById("exportTXT")
        ?.addEventListener(
            "click",
            () => this.exportTXT()
        );

        document
        .getElementById("exportMD")
        ?.addEventListener(
            "click",
            () => this.exportMD()
        );

        document
        .getElementById("exportPDF")
        ?.addEventListener(
            "click",
            () => this.exportPDF()
        );

        document
        .getElementById("exportDOCX")
        ?.addEventListener(
            "click",
            () => this.exportDOCX()
        );

    }

}

/* ==========================================================
GLOBAL
========================================================== */

window.ContinuumExport =
    new ContinuumExport();
