// ===============================
// PRISMA PATH LOADER — SISTEMA REDE
// Versão robusta (corrige acesso a diretórios)
// ===============================

(function () {

  const path = window.location.pathname;

  // pega trecho após /rede/
  let afterRede = path.split('/rede/')[1] || '';

  // remove arquivo final se existir
  if (afterRede.includes('.html')) {
    afterRede = afterRede.substring(0, afterRede.lastIndexOf('/') + 1);
  }

  // remove barra final
  afterRede = afterRede.replace(/\/$/, '');

  // calcula profundidade real
  const depth = afterRede ? afterRede.split('/').length : 0;

  // prefixos
  const backToRede = '../'.repeat(depth);
  const backToRoot = backToRede + '../';

  window.PRISMA_PATHS = {

    rede: backToRede,
    root: backToRoot,
    assets: backToRoot + 'assets/',
    js: backToRede + 'js/',
    components: backToRede + 'components/',
    img: backToRoot + 'assets/img/'

  };

})();
