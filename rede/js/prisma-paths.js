// ===============================
// PRISMA PATH LOADER — SISTEMA REDE
// Estrutura real:
// assets fora de /rede
// js dentro de /rede/js
// prisma dentro de /rede/prisma
// ===============================

(function () {

  const path = window.location.pathname;

  // trecho após /rede/prisma/
  let afterPrisma = path.split('/rede/prisma/')[1] || '';

  // remove arquivo final
  if (afterPrisma.includes('.html')) {
    afterPrisma = afterPrisma.substring(0, afterPrisma.lastIndexOf('/') + 1);
  }

  // remove barra final
  afterPrisma = afterPrisma.replace(/\/$/, '');

  // profundidade dentro de prisma
  const depth = afterPrisma ? afterPrisma.split('/').length : 0;

  // prefixo para voltar até prisma
  const backToPrisma = '../'.repeat(depth);

  // prefixo para voltar até rede
  const backToRede = backToPrisma + '../';

  // prefixo para voltar até root
  const backToRoot = backToRede + '../';

  window.PRISMA_PATHS = {

    prisma: backToPrisma,
    rede: backToRede,
    root: backToRoot,

    assets: backToRoot + 'assets/',
    css: backToRoot + 'assets/css/',
    vendor: backToRoot + 'assets/vendor/',
    img: backToRoot + 'assets/img/',

    js: backToRede + 'js/',
    components: backToRede + 'components/'

  };

})();
