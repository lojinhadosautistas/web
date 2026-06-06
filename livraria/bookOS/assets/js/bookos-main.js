particlesJS('particles-js', {
particles:{
number:{ value:60 },
color:{ value:'#b28a52' },
shape:{ type:'circle' },
opacity:{ value:.18 },
size:{ value:3 },
move:{ enable:true, speed:1 }
}
});

const tabs = document.querySelectorAll('.tab[data-target]');
const sections = document.querySelectorAll('.content-section');

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');

    document
      .getElementById(tab.dataset.target)
      .classList.add('active');

  });

});

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

document
.getElementById(button.dataset.doc)
.classList.add('active');

});

});

const ctx =
document.getElementById('impactChart');

new Chart(ctx, {

type:'bar',

data:{
labels:[
'Revisão',
'NBCT',
'SICSP',
'Estudos',
'Governança'
],

datasets:[{

label:'Maturidade Operacional',

data:[72,94,81,65,92],

borderWidth:1

}]

},

options:{
responsive:true,
plugins:{
legend:{ display:false }
}
}

});
