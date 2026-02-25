// ===============================
// PRISMA PATH LOADER — SISTEMA REDE
// Compatível com:
// /rede/prisma
// /rede/prisma/subpastas
// assets fora de /rede
// ===============================

(function () {

  const path = window.location.pathname;

  // trecho após /rede/
  const afterRede = path.split('/rede/')[1] || '';

  // profundidade dentro da pasta rede
  const depth = afterRede.split('/').length - 1;

  // prefixo relativo para voltar até /rede
  const backToRede = '../'.repeat(depth);

  // prefixo para voltar até raiz (main)
  const backToRoot = backToRede + '../';

  window.PRISMA_PATHS = {

    // volta até pasta rede
    rede: backToRede,

    // volta até raiz
    root: backToRoot,

    // assets ficam na raiz
    assets: backToRoot + 'assets/',

    // js ficam em rede/js
    js: backToRede + 'js/',

    // componentes
    components: backToRede + 'components/',

    // imagens
    img: backToRoot + 'assets/img/'

  };

})();
