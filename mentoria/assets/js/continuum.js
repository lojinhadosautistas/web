/* =========================================================
   CONTINUUM
   Sistema de Integração Programática
========================================================= */

/* =========================================================
   NAVEGAÇÃO ENTRE ABAS PRINCIPAIS
========================================================= */

const tabs = document.querySelectorAll('.menu-tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {

    tab.addEventListener('click', () => {

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');

        const target = document.getElementById(tab.dataset.tab);

        if (target) {
            target.classList.add('active');
        }

    });

});

/* =========================================================
   THEME
========================================================= */

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {

    themeToggle.addEventListener('click', () => {

        document.body.classList.toggle('dark');

        if (document.body.classList.contains('dark')) {

            themeToggle.innerHTML = '☀️';
            localStorage.setItem('continuum-theme', 'dark');

        } else {

            themeToggle.innerHTML = '🌙';
            localStorage.setItem('continuum-theme', 'light');

        }

    });

    if (localStorage.getItem('continuum-theme') === 'dark') {

        document.body.classList.add('dark');
        themeToggle.innerHTML = '☀️';

    }

}

/* =========================================================
   PARTICLES
========================================================= */

if (typeof particlesJS !== 'undefined') {

    particlesJS('particles-js', {

        particles: {

            number: { value: 55 },
            color: { value: '#00b7d9' },
            shape: { type: 'circle' },
            opacity: { value: 0.16 },
            size: { value: 3 },

            move: {
                enable: true,
                speed: 1
            }

        }

    });

}

/* =========================================================
   MERMAID
========================================================= */

if (typeof mermaid !== 'undefined') {

    mermaid.initialize({
        startOnLoad: true
    });

}

/* =========================================================
   CHART.JS
========================================================= */

const chartCanvas = document.getElementById('continuumChart');

if (chartCanvas && typeof Chart !== 'undefined') {

    new Chart(chartCanvas, {

        type: 'line',

        data: {

            labels: [
                'Out/25',
                'Nov/25',
                'Dez/25',
                'Jan/26',
                'Mar/26',
                'Abr/26'
            ],

            datasets: [

                {
                    label: 'Continuidade',
                    data: [72, 74, 61, 83, 88, 79],
                    tension: .4,
                    borderWidth: 3,
                    borderColor: '#00b7d9',
                    backgroundColor: 'rgba(0,183,217,.12)',
                    fill: true
                },

                {
                    label: 'Sobrecarga',
                    data: [58, 72, 89, 48, 42, 81],
                    tension: .4,
                    borderWidth: 3,
                    borderColor: '#ff6b81',
                    backgroundColor: 'rgba(255,107,129,.08)',
                    fill: true
                },

                {
                    label: 'Conversação',
                    data: [64, 59, 52, 78, 84, 63],
                    tension: .4,
                    borderWidth: 3,
                    borderColor: '#63d84e',
                    backgroundColor: 'rgba(109,255,124,.08)',
                    fill: true
                }

            ]

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
   CLÍNICA INTEGRADA
========================================================= */

const clinicalLinks = document.querySelectorAll('.clinical-link');
const clinicPanels = document.querySelectorAll('.clinic-panel');

clinicalLinks.forEach(link => {

    link.addEventListener('click', () => {

        clinicalLinks.forEach(l => {
            l.classList.remove('active');
        });

        clinicPanels.forEach(panel => {
            panel.classList.remove('active-clinic');
        });

        link.classList.add('active');

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        const clinicaTab = document.getElementById('clinica');

        if (clinicaTab) {
            clinicaTab.classList.add('active');
        }

        const target = link.dataset.clinic;

        const panel = document.getElementById(`${target}-panel`);

        if (panel) {
            panel.classList.add('active-clinic');
        }

        const anchor = link.dataset.anchor;

        if (anchor) {

            setTimeout(() => {

                const element = document.getElementById(anchor);

                if (element) {

                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                }

            }, 120);

        }

    });

});
