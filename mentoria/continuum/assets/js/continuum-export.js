/* ==========================================================
CONTINUUM EXPORT v2.0
JSON • Markdown • PDF • Word
Complemento do Continuum Editor
========================================================== */

class ContinuumExport {

    constructor() {

        this.dropdown = null;

        this.init();

    }

    /* ==========================================================
    INIT
    ========================================================== */

init() {

    this.dropdown =
        document.getElementById(
            "exportDropdown"
        );

    this.bindEvents();

}

    /* ==========================================================
    EDITOR DATA
    ========================================================== */



    async getEditorData() {

    if (!window.Continuum) {

        throw new Error(
            "Continuum não carregado."
        );

    }

    await window.Continuum.editor.isReady;

    return await window.Continuum.editor.save();

}

    /* ==========================================================
    PLAIN TEXT
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
                        block.data.text.toUpperCase() +
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

        return text.trim();

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
                            block.data.level || 1
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

        return md.trim();

    }

    /* ==========================================================
    HELPERS
    ========================================================== */

    today() {

        return new Date()
            .toISOString()
            .split("T")[0];

    }



    closeDropdown() {

        this.dropdown
        ?.classList
        .remove("active");

    }

    download(
        content,
        filename,
        mimeType
    ) {

        const blob =
            new Blob(
                [content],
                {
                    type:
                    mimeType
                }
            );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            filename;

        document.body
            .appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(url);

    }

    /* ==========================================================
    MARKDOWN
    ========================================================== */

    async exportMD() {

        try {

            const md =
                await this.getMarkdown();

            this.download(

                md,

                `continuum-${this.today()}.md`,

                "text/markdown"

            );

            this.closeDropdown();

        }

        catch(error) {

            console.error(error);

        }

    }

    /* ==========================================================
    PDF
    ========================================================== */

    async exportPDF() {

        try {

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

            const pageWidth =
                180;

            const lines =
                doc.splitTextToSize(
                    text,
                    pageWidth
                );

            let y = 20;

            lines.forEach(line => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;

                }

                doc.text(
                    line,
                    15,
                    y
                );

                y += 7;

            });

            doc.save(
                `continuum-${this.today()}.pdf`
            );

            this.closeDropdown();

        }

        catch(error) {

            console.error(error);

        }

    }

    /* ==========================================================
    DOCX
    ========================================================== */

    async exportDOCX() {

        try {

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

                                new docx.Paragraph({

                                    text

                                })

                            ]

                        }

                    ]

                });

            const blob =
                await docx.Packer
                .toBlob(doc);

            saveAs(

                blob,

                `continuum-${this.today()}.docx`

            );

            this.closeDropdown();

        }

        catch(error) {

            console.error(error);

        }

    }

    /* ==========================================================
    DROPDOWN
    ========================================================== */

    toggleDropdown() {

        this.dropdown
        ?.classList
        .toggle("active");

    }

    /* ==========================================================
    EVENTS
    ========================================================== */

    bindEvents() {

        document
        .getElementById(
            "exportMenu"
        )
        ?.addEventListener(
            "click",
            () => {

                this.toggleDropdown();

            }
        );

        document
        .getElementById(
            "exportMD"
        )
        ?.addEventListener(
            "click",
            () => this.exportMD()
        );

        document
        .getElementById(
            "exportPDF"
        )
        ?.addEventListener(
            "click",
            () => this.exportPDF()
        );

        document
        .getElementById(
            "exportDOCX"
        )
        ?.addEventListener(
            "click",
            () => this.exportDOCX()
        );

        document.addEventListener(
            "click",
            event => {

                const menu =
                    document.getElementById(
                        "exportMenu"
                    );

                if (
                    !menu ||
                    !this.dropdown
                ) return;

                if (
                    !menu.contains(
                        event.target
                    )
                    &&
                    !this.dropdown.contains(
                        event.target
                    )
                ) {

                    this.closeDropdown();

                }

            }
        );

    }

}

/* ==========================================================
GLOBAL
========================================================== */

window.ContinuumExport =
    new ContinuumExport();
