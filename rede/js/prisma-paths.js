// ===============================
// PRISMA PATH LOADER
// ===============================

(function () {

  const path = window.location.pathname;

  // Detecta tudo após /rede
  const afterRede = path.split('/rede/')[1] || '';

  // Calcula profundidade
  const depth = afterRede.split('/').length - 1;

  // Prefixo relativo
  const prefix = '../'.repeat(depth);

  // API global
  window.PRISMA_PATHS = {
    root: prefix,
    assets: prefix + 'assets/',
    js: prefix + 'js/',
    components: prefix + 'components/',
    img: prefix + 'assets/img/'
  };

})();
