
/* =========================================================
   GOOGLE SHEETS CONTINUUM
========================================================= */

const sheetButtons = document.querySelectorAll('.gsheet-btn');
const continuumFrame = document.getElementById('continuumSheet');

if (continuumFrame && sheetButtons.length > 0) {

    sheetButtons.forEach(button => {

        button.addEventListener('click', () => {

            sheetButtons.forEach(btn =>
                btn.classList.remove('active')
            );

            button.classList.add('active');

            const gid = button.dataset.sheet;

            continuumFrame.src =
                `https://docs.google.com/spreadsheets/d/e/2PACX-1vSAYlRPhAWc23mhdBQaw2aqq9n7oeMof7ReKRUt5cSUx1MI6goE2isbFSho4EYU9e6_hQTOesRIDfZ7/pubhtml?gid=${gid}&single=true&widget=true&headers=false`;

        });

    });

}
