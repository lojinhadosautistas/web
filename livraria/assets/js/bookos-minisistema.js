
/* =========================================================
   GOOGLE SHEETS bookos - VERSÃO PARA PLANILHAS COMPARTILHADAS
========================================================= */

const sheetButtons = document.querySelectorAll('.gsheet-btn');
const bookosFrame = document.getElementById('bookosSheet');

if (bookosFrame && sheetButtons.length > 0) {

    sheetButtons.forEach(button => {

        button.addEventListener('click', () => {

            sheetButtons.forEach(btn =>
                btn.classList.remove('active')
            );

            button.classList.add('active');

            const gid = button.dataset.sheet;

            bookFrame.src =
                `https://docs.google.com/spreadsheets/d/e/2PACX-1vSAYlRPhAWc23mhdBQaw2aqq9n7oeMof7ReKRUt5cSUx1MI6goE2isbFSho4EYU9e6_hQTOesRIDfZ7/pubhtml?gid=${gid}&single=true&widget=true&headers=false`;

        });

    });

}
