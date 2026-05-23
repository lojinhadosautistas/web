/* =========================================================
ORÁCULO • SIMULADOR OPERACIONAL
simulador.js
========================================================= */

/* =========================================================
ESTADO GLOBAL DO SISTEMA
========================================================= */

let camadaAtual = 1;

let scoreCoerencia = 12;

let reflexoesRespondidas = 0;

let statusSistema = "ONLINE";

let progressoSistema = 0;

const respostasUsuario = {};

const camadasDesbloqueadas = [1];

/* =========================================================
CONFIGURAÇÃO DAS CAMADAS
========================================================= */

const camadas = [

{
    id:1,
    letra:"O",
    nome:"Observação Contextual",
    cor:"#0f3fff",

    pergunta:
    "O que está acontecendo neste contexto que exige sua atenção neste momento?",

    placeholder:
    "Descreva livremente o cenário, sinais, tensões, padrões ou acontecimentos relevantes..."
},

{
    id:2,
    letra:"R",
    nome:"Reconhecimento de Padrões",
    cor:"#7b2cff",

    pergunta:
    "Quais padrões, recorrências ou comportamentos parecem emergir deste contexto?",

    placeholder:
    "Observe conexões, repetições, influências ou ciclos perceptíveis..."
},

{
    id:3,
    letra:"A",
    nome:"Ativação de BPs",
    cor:"#00a2b8",

    pergunta:
    "Quais elementos merecem prioridade operacional neste momento?",

    placeholder:
    "Identifique focos estratégicos, eixos ativos ou componentes críticos..."
},

{
    id:4,
    letra:"C",
    nome:"Configuração Estratégica",
    cor:"#22aa33",

    pergunta:
    "Quais ajustes ou estratégias podem aumentar a coerência deste cenário?",

    placeholder:
    "Pense em caminhos possíveis, reorganizações e decisões estruturantes..."
},

{
    id:5,
    letra:"U",
    nome:"Unidade Integrada",
    cor:"#ffb300",

    pergunta:
    "Como integrar as diferentes dimensões deste contexto sem fragmentação?",

    placeholder:
    "Busque coerência entre emoções, lógica, recursos e realidade operacional..."
},

{
    id:6,
    letra:"L",
    nome:"Leitura Dinâmica",
    cor:"#ff6b00",

    pergunta:
    "O que mudou ou pode mudar rapidamente neste cenário?",

    placeholder:
    "Observe instabilidades, riscos, movimentos emergentes e sinais adaptativos..."
},

{
    id:7,
    letra:"O",
    nome:"Output Programático",
    cor:"#0f3fff",

    pergunta:
    "Qual direção prática parece mais coerente após esta trajetória reflexiva?",

    placeholder:
    "Organize sínteses, direcionamentos e possibilidades de ação..."
}

];

/* =========================================================
ELEMENTOS DO DOM
========================================================= */

const tituloCamada =
document.getElementById("tituloCamada");

const letraCamada =
document.getElementById("letraCamada");

const perguntaCamada =
document.getElementById("perguntaCamada");

const campoResposta =
document.getElementById("campoResposta");

const respostaOraculo =
document.getElementById("respostaOraculo");

const scoreElement =
document.getElementById("scoreCoerencia");

const reflexoesElement =
document.getElementById("reflexoesRespondidas");

const camadaElement =
document.getElementById("camadaAtual");

const statusElement =
document.getElementById("statusSistema");

const progressoElement =
document.getElementById("barraProgresso");

const mapaNodes =
document.querySelectorAll(".map-node");

/* =========================================================
INICIALIZAÇÃO
========================================================= */

function iniciarSistema(){

    atualizarHUD();

    renderizarCamada();

    atualizarMapa();

    criarParticulas();

    console.log(
    "ORÁCULO • Sistema Inicializado"
    );

}

window.onload = iniciarSistema;

/* =========================================================
RENDERIZAR CAMADA
========================================================= */

function renderizarCamada(){

    const camada =
    camadas[camadaAtual - 1];

    tituloCamada.innerHTML =
    camada.nome;

    letraCamada.innerHTML =
    camada.letra;

    perguntaCamada.innerHTML =
    camada.pergunta;

    campoResposta.placeholder =
    camada.placeholder;

    letraCamada.style.color =
    camada.cor;

    campoResposta.value = "";

    atualizarHUD();

}

/* =========================================================
ENVIAR REFLEXÃO
========================================================= */

function enviarReflexao(){

    const texto =
    campoResposta.value.trim();

    if(texto.length < 8){

        efeitoErro();

        respostaOraculo.innerHTML = `
        O ORÁCULO necessita de uma reflexão
        mais estruturada para prosseguir.
        `;

        return;

    }

    respostasUsuario[camadaAtual] =
    texto;

    reflexoesRespondidas++;

    atualizarScore(texto);

    atualizarHUD();

    responderOraculo();

    efeitoPulse();

    desbloquearProximaCamada();

    atualizarMapa();

}

/* =========================================================
RESPOSTAS DO ORÁCULO
========================================================= */

function responderOraculo(){

    let resposta = "";

    switch(camadaAtual){

        case 1:
        resposta =
        obterRespostaCamada1();
        break;

        case 2:
        resposta =
        obterRespostaCamada2();
        break;

        case 3:
        resposta =
        obterRespostaCamada3();
        break;

        case 4:
        resposta =
        obterRespostaCamada4();
        break;

        case 5:
        resposta =
        obterRespostaCamada5();
        break;

        case 6:
        resposta =
        obterRespostaCamada6();
        break;

        case 7:
        resposta =
        obterRespostaCamada7();
        break;

    }

    respostaOraculo.innerHTML =
    resposta;

}

/* =========================================================
ATUALIZAR SCORE
========================================================= */

function atualizarScore(texto){

    const tamanho =
    texto.length;

    let incremento =
    5;

    if(tamanho > 40){
        incremento += 5;
    }

    if(tamanho > 100){
        incremento += 8;
    }

    incremento +=
    Math.floor(Math.random()*7);

    scoreCoerencia += incremento;

    if(scoreCoerencia > 100){
        scoreCoerencia = 100;
    }

    progressoSistema =
    (camadaAtual / 7) * 100;

}

/* =========================================================
DESBLOQUEAR CAMADAS
========================================================= */

function desbloquearProximaCamada(){

    if(camadaAtual < 7){

        camadaAtual++;

        if(
        !camadasDesbloqueadas.includes(camadaAtual)
        ){
            camadasDesbloqueadas.push(camadaAtual);
        }

        setTimeout(()=>{

            renderizarCamada();

        },1800);

    }else{

        concluirSimulacao();

    }

}

/* =========================================================
CONCLUIR
========================================================= */

function concluirSimulacao(){

    statusSistema =
    "TRAJETÓRIA CONSOLIDADA";

    atualizarHUD();

    respostaOraculo.innerHTML = `

    O ORÁCULO consolidou uma trajetória
    reflexiva completa.

    A coerência construída ao longo do
    percurso agora pode ser convertida
    em direcionamento operacional,
    planejamento integrado e leitura
    sistêmica mais consciente.

    `;

    criarConfetti();

}

/* =========================================================
HUD
========================================================= */

function atualizarHUD(){

    scoreElement.innerHTML =
    scoreCoerencia + "%";

    reflexoesElement.innerHTML =
    reflexoesRespondidas;

    camadaElement.innerHTML =
    camadaAtual + " / 7";

    statusElement.innerHTML =
    statusSistema;

    progressoElement.style.width =
    progressoSistema + "%";

}

/* =========================================================
MAPA SISTÊMICO
========================================================= */

function atualizarMapa(){

    mapaNodes.forEach((node,index)=>{

        node.classList.remove(
        "ativo",
        "atual"
        );

        if(index + 1 < camadaAtual){

            node.classList.add("ativo");

        }

        if(index + 1 === camadaAtual){

            node.classList.add("atual");

        }

    });

}

/* =========================================================
SELEÇÃO MANUAL DE CAMADA
========================================================= */

function abrirCamada(numero){

    if(
    !camadasDesbloqueadas.includes(numero)
    ){
        return;
    }

    camadaAtual = numero;

    renderizarCamada();

    atualizarMapa();

}

/* =========================================================
EFEITOS VISUAIS
========================================================= */

function efeitoPulse(){

    document.body.classList.add(
    "pulse-system"
    );

    setTimeout(()=>{

        document.body.classList.remove(
        "pulse-system"
        );

    },1200);

}

function efeitoErro(){

    document.body.classList.add(
    "erro-system"
    );

    setTimeout(()=>{

        document.body.classList.remove(
        "erro-system"
        );

    },500);

}

/* =========================================================
CONFETTI
========================================================= */

function criarConfetti(){

    for(let i=0;i<35;i++){

        const confetti =
        document.createElement("div");

        confetti.className =
        "confetti";

        confetti.innerHTML =
        ["✦","•","⬢","✧","⬡"][
        Math.floor(Math.random()*5)
        ];

        confetti.style.left =
        Math.random()*100 + "vw";

        confetti.style.top =
        "-40px";

        confetti.style.fontSize =
        (12 + Math.random()*24) + "px";

        confetti.style.animationDuration =
        (2 + Math.random()*3) + "s";

        document.body.appendChild(
        confetti
        );

        setTimeout(()=>{

            confetti.remove();

        },5000);

    }

}

/* =========================================================
PARTÍCULAS
========================================================= */

function criarParticulas(){

    const particles =
    document.getElementById("particles");

    if(!particles){
        return;
    }

    for(let i=0;i<80;i++){

        const p =
        document.createElement("div");

        p.classList.add("particle");

        p.style.left =
        Math.random()*100 + "vw";

        p.style.top =
        Math.random()*100 + "vh";

        p.style.animationDuration =
        (12 + Math.random()*20) + "s";

        p.style.animationDelay =
        Math.random()*-20 + "s";

        p.style.opacity =
        Math.random()*.5;

        p.style.transform =
        `scale(${Math.random()*2})`;

        particles.appendChild(p);

    }

}

/* =========================================================
TECLA ENTER
========================================================= */

campoResposta.addEventListener(
"keydown",
function(e){

    if(
    e.key === "Enter"
    &&
    !e.shiftKey
    ){

        e.preventDefault();

        enviarReflexao();

    }

});

/* =========================================================
EXPORTAR DADOS FUTURAMENTE
========================================================= */

function exportarSessao(){

    const dados = {

        score:scoreCoerencia,

        reflexoes:
        respostasUsuario,

        concluido:
        camadaAtual >= 7

    };

    console.log(dados);

}

/* =========================================================
MONITORAMENTO VIVO
========================================================= */

setInterval(()=>{

    const estados = [

    "ONLINE",
    "PROCESSANDO CONTEXTO",
    "ANALISANDO PADRÕES",
    "ORGANIZANDO COERÊNCIA",
    "MAPEANDO EIXOS",
    "VALIDANDO TRAJETÓRIA"

    ];

    statusSistema =
    estados[
    Math.floor(Math.random()*estados.length)
    ];

    atualizarHUD();

},10000);
