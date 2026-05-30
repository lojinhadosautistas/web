/* =========================================================
   BOOKOS CUSTOS
   Sistema Editorial Operacional
   Versão: 1.0
========================================================= */


/* =========================================================
   01. PARTICLES BACKGROUND
========================================================= */

if (typeof particlesJS !== 'undefined') {

    particlesJS('particles-js', {

        particles: {

            number: {
                value: 60
            },

            color: {
                value: '#b28a52'
            },

            shape: {
                type: 'circle'
            },

            opacity: {
                value: 0.18
            },

            size: {
                value: 3
            },

            move: {
                enable: true,
                speed: 1
            }

        }

    });

}


/* =========================================================
   02. NAVEGAÇÃO PRINCIPAL
========================================================= */

const tabs = document.querySelectorAll('.tab[data-target]');
const sections = document.querySelectorAll('.content-section');

tabs.forEach(tab => {

    tab.addEventListener('click', () => {

        tabs.forEach(t =>
            t.classList.remove('active')
        );

        sections.forEach(section =>
            section.classList.remove('active')
        );

        tab.classList.add('active');

        const target =
            document.getElementById(tab.dataset.target);

        if (target) {
            target.classList.add('active');
        }

    });

});


/* =========================================================
   03. CAPÍTULOS
========================================================= */

const chapterButtons =
    document.querySelectorAll('.chapter-btn');

const chapterPages =
    document.querySelectorAll('.doc-page');

chapterButtons.forEach(button => {

    button.addEventListener('click', () => {

        chapterButtons.forEach(btn =>
            btn.classList.remove('active')
        );

        chapterPages.forEach(page =>
            page.classList.remove('active')
        );

        button.classList.add('active');

        const page =
            document.getElementById(button.dataset.doc);

        if (page) {
            page.classList.add('active');
        }

    });

});


/* =========================================================
   04. DASHBOARD
   GRÁFICO DE IMPACTO OPERACIONAL
========================================================= */

const impactChartCanvas =
    document.getElementById('impactChart');

if (
    impactChartCanvas &&
    typeof Chart !== 'undefined'
) {

    new Chart(impactChartCanvas, {

        type: 'bar',

        data: {

            labels: [
                'Revisão',
                'NBCT',
                'SICSP',
                'Estudos',
                'Governança'
            ],

            datasets: [{

                label: 'Maturidade Operacional',

                data: [
                    72,
                    94,
                    81,
                    65,
                    92
                ],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });

}


/* =========================================================
   05. FUTUROS MÓDULOS
========================================================= */

/*

Governança
Disclosure
Roadmap
Versionamento
OneDrive Sync
Analytics
Indicadores Editoriais

*/
