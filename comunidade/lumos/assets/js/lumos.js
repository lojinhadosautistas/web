/*
====================================
LUMOS
Laboratório Unificado de Música,
Organização e Suporte
====================================
*/

console.log(`
╔══════════════════════════════╗
║            LUMOS            ║
║ Sistema Cultural Atípicos   ║
╚══════════════════════════════╝
`);

/* ==========================
SCROLL REVEAL
========================== */

const revealItems =
document.querySelectorAll(
'.dashboard-card,.album-card,.symbol,.json-card,.agenda-item'
);

const revealObserver =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{
opacity:0,
transform:'translateY(30px)'
},

{
opacity:1,
transform:'translateY(0)'
}

],{

duration:700,
fill:'forwards'

});

}

});

},

{
threshold:0.15
}

);

revealItems.forEach(item=>{

item.style.opacity = "0";

revealObserver.observe(item);

});

/* ==========================
TERMINAL
========================== */

document
.querySelectorAll('.terminal-line')
.forEach(line=>{

line.addEventListener('click',()=>{

alert(
`Comando selecionado:\n${line.textContent}\n\nFuncionalidade futura do LUMOS`
);

});

});

/* ==========================
PARALLAX HERO
========================== */

window.addEventListener('mousemove',(e)=>{

const hero =
document.querySelector('.hero');

if(!hero) return;

const x =
(e.clientX/window.innerWidth)-0.5;

const y =
(e.clientY/window.innerHeight)-0.5;

hero.style.transform =
`translate(${x*8}px,${y*8}px)`;

});

/* ==========================
STARS TWINKLE
========================== */

setInterval(()=>{

const starfield =
document.querySelector('.starfield');

if(!starfield) return;

starfield.style.opacity =
(0.08 + Math.random()*0.08);

},3000);

/* ==========================
WELCOME
========================== */

window.addEventListener('load',()=>{

console.log(
'✨ LUMOS iniciado com sucesso.'
);

});
