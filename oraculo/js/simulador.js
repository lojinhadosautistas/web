/* =========================================================
ORÁCULO • SIMULADOR OPERACIONAL
simulador.js • v2 CINEMÁTICO
========================================================= */

/* =========================================================
ESTADO GLOBAL
========================================================= */

let camadaAtual = 1;

let scoreCoerencia = 12;

let reflexoesRespondidas = 0;

let progressoSistema = 0;

let statusSistema = "ONLINE";

const respostasUsuario = {};

const camadasDesbloqueadas = [1];

/* =========================================================
ESTADO REFLEXIVO INTERNO
========================================================= */

const estadoSistema = {

    tensao:20,

    clareza:40,

    estabilidade:50,

    coerencia:35,

    profundidade:20

};

/* =========================================================
CONFIGURAÇÃO DAS CAMADAS
========================================================= */

const camadas = [

{
    id:1,

    letra:"O",

    nome:"Observação Contextual",

    cor:"#2f6bff",

    pergunta:
    "O que está acontecendo neste contexto que exige sua atenção neste momento?",

    placeholder:
    "Descreva o cenário, tensões, sinais, acontecimentos e percepções relevantes..."
},

{
    id:2,

    letra:"R",

    nome:"Reconhecimento de Padrões",

    cor:"#7b2cff",

    pergunta:
    "Quais padrões, recorrências ou movimentos parecem emergir deste contexto?",

    placeholder:
    "Observe ciclos, comportamentos repetitivos, conexões e influências..."
},

{
    id:3,

    letra:"A",

    nome:"Ativação de BPs",

    cor:"#00b7c3",

    pergunta:
    "Quais elementos merecem prioridade operacional neste momento?",

    placeholder:
    "Identifique focos críticos, tensões centrais e variáveis prioritárias..."
},

{
    id:4,

    letra:"C",

    nome:"Configuração Estratégica",

    cor:"#23b04a",

    pergunta:
    "Quais ajustes podem aumentar a coerência deste cenário?",

    placeholder:
    "Pense em reorganizações, decisões e alinhamentos possíveis..."
},

{
    id:5,

    letra:"U",

    nome:"Unidade Integrada",

    cor:"#ffb300",

    pergunta:
    "Como integrar as diferentes dimensões deste contexto sem fragmentação?",

    placeholder:
    "Conecte emoções, lógica, recursos, contexto e direção..."
},

{
    id:6,

    letra:"L",

    nome:"Leitura Dinâmica",

    cor:"#ff6b00",

    pergunta:
    "O que pode mudar rapidamente neste cenário?",

    placeholder:
    "Observe instabilidades, riscos emergentes e movimentos adaptativos..."
},

{
    id:7,

    letra:"O",

    nome:"Output Programático",

    cor:"#2f6bff",

    pergunta:
    "Qual direção prática parece mais coerente após esta trajetória reflexiva?",

    placeholder:
    "Organize sínteses, decisões, direcionamentos e possibilidades..."
}

];

/* =========================================================
DOM
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

const tensaoElement =
document.getElementById("nivelTensao");

const clarezaElement =
document.getElementById("nivelClareza");

const estabilidadeElement =
document.getElementById("nivelEstabilidade");

/* =========================================================
INICIALIZAÇÃO
========================================================= */

window.onload = ()=>{

    iniciarSistema();

};

function iniciarSistema(){

    renderizarCamada();

    atualizarHUD();

    atualizarMapa();

    criarParticulas();

    iniciarMonitoramento();

    console.log(
    "ORÁCULO • Sistema Inicializado"
    );

}

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

    /* =====================================================
    VALIDAÇÃO MÍNIMA
    ===================================================== */

    if(texto.length < 40){

        efeitoErro();

        respostaOraculo.innerHTML = `

        O ORÁCULO necessita de uma reflexão
        mais profunda para estabelecer uma
        leitura contextual consistente.

        Expanda sua percepção antes de prosseguir.

        `;

        return;

    }

    respostasUsuario[camadaAtual] =
    texto;

    reflexoesRespondidas++;

    atualizarEstadoInterno(texto);

    atualizarScore(texto);

    atualizarHUD();

    responderOraculo(texto);

    efeitoPulse();

    atualizarMapa();

    desbloquearProximaCamada();

}

/* =========================================================
RESPOSTAS DO ORÁCULO
========================================================= */

function responderOraculo(texto){

    const resposta =
    obterResposta(
        camadaAtual,
        texto
    );

    respostaOraculo.innerHTML =
    resposta;

}

/* =========================================================
ESTADO INTERNO
========================================================= */

function atualizarEstadoInterno(texto){

    const t =
    texto.toLowerCase();

    /* =====================================================
    TENSÃO
    ===================================================== */

    if(
        t.includes("medo")
        ||
        t.includes("pressão")
        ||
        t.includes("ansiedade")
        ||
        t.includes("conflito")
        ||
        t.includes("sobrecarga")
    ){

        estadoSistema.tensao += 8;

    }

    /* =====================================================
    CLAREZA
    ===================================================== */

    if(
        t.includes("entendo")
        ||
        t.includes("clareza")
        ||
        t.includes("percebo")
        ||
        t.includes("compreendo")
    ){

        estadoSistema.clareza += 7;

    }

    /* =====================================================
    ESTABILIDADE
    ===================================================== */

    if(
        t.includes("organizar")
        ||
        t.includes("equilibrio")
        ||
        t.includes("planejamento")
        ||
        t.includes("estratégia")
    ){

        estadoSistema.estabilidade += 6;

    }

    /* =====================================================
    PROFUNDIDADE
    ===================================================== */

    if(texto.length > 180){

        estadoSistema.profundidade += 10;

    }else{

        estadoSistema.profundidade += 4;

    }

    limitarEstados();

}

/* =========================================================
LIMITAR ESTADOS
========================================================= */

function limitarEstados(){

    Object.keys(estadoSistema).forEach(chave=>{

        if(estadoSistema[chave] > 100){

            estadoSistema[chave] = 100;

        }

        if(estadoSistema[chave] < 0){

            estadoSistema[chave] = 0;

        }

    });

}

/* =========================================================
ATUALIZAR SCORE
========================================================= */

function atualizarScore(texto){

    let incremento = 6;

    if(texto.length > 80){

        incremento += 8;

    }

    if(texto.length > 180){

        incremento += 10;

    }

    incremento +=
    Math.floor(Math.random()*6);

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

            camadasDesbloqueadas.push(
            camadaAtual
            );

        }

        setTimeout(()=>{

            renderizarCamada();

        },2200);

    }else{

        concluirSimulacao();

    }

}

/* =========================================================
CONCLUSÃO
========================================================= */

function concluirSimulacao(){

    statusSistema =
    "TRAJETÓRIA CONSOLIDADA";

    atualizarHUD();

    respostaOraculo.innerHTML = `

    O ORÁCULO concluiu a trajetória
    reflexiva e consolidou um eixo
    operacional mais coerente.

    As respostas observadas ao longo
    do percurso revelam padrões,
    tensões e possibilidades que agora
    podem ser convertidas em direção,
    estratégia e organização consciente.

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

    if(tensaoElement){

        tensaoElement.innerHTML =
        estadoSistema.tensao + "%";

    }

    if(clarezaElement){

        clarezaElement.innerHTML =
        estadoSistema.clareza + "%";

    }

    if(estabilidadeElement){

        estabilidadeElement.innerHTML =
        estadoSistema.estabilidade + "%";

    }

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
ABRIR CAMADA
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

    },700);

}

/* =========================================================
CONFETTI
========================================================= */

function criarConfetti(){

    for(let i=0;i<40;i++){

        const confetti =
        document.createElement("div");

        confetti.className =
        "confetti";

        confetti.innerHTML =
        ["✦","⬢","✧","⬡","•"][
        Math.floor(Math.random()*5)
        ];

        confetti.style.left =
        Math.random()*100 + "vw";

        confetti.style.top =
        "-40px";

        confetti.style.fontSize =
        (12 + Math.random()*28) + "px";

        confetti.style.animationDuration =
        (2 + Math.random()*4) + "s";

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

    for(let i=0;i<100;i++){

        const p =
        document.createElement("div");

        p.classList.add("particle");

        p.style.left =
        Math.random()*100 + "vw";

        p.style.top =
        Math.random()*100 + "vh";

        p.style.animationDuration =
        (15 + Math.random()*30) + "s";

        p.style.animationDelay =
        Math.random()*-30 + "s";

        p.style.opacity =
        Math.random()*.45;

        p.style.transform =
        `scale(${Math.random()*2})`;

        particles.appendChild(p);

    }

}

/* =========================================================
MONITORAMENTO OPERACIONAL
========================================================= */

function iniciarMonitoramento(){

    setInterval(()=>{

        const estados = [

        "ONLINE",

        "PROCESSANDO CONTEXTO",

        "ANALISANDO PADRÕES",

        "VALIDANDO COERÊNCIA",

        "MAPEANDO ESTRUTURAS",

        "ORGANIZANDO TRAJETÓRIA",

        "INTEGRANDO CAMADAS"

        ];

        statusSistema =
        estados[
        Math.floor(
        Math.random()*estados.length
        )
        ];

        atualizarHUD();

    },9000);

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
EXPORTAÇÃO FUTURA
========================================================= */

function exportarSessao(){

    const dados = {

        score:scoreCoerencia,

        estado:estadoSistema,

        reflexoes:
        respostasUsuario,

        concluido:
        camadaAtual >= 7

    };

    console.log(dados);

}
