
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


