function obterResposta(camada){

  const bibliotecas = {
    1: respostasCamada1,
    2: respostasCamada2,
    3: respostasCamada3,
    4: respostasCamada4,
    5: respostasCamada5,
    6: respostasCamada6,
    7: respostasCamada7
  };

  const lista = bibliotecas[camada];

  return lista[
    Math.floor(Math.random()*lista.length)
  ];

}
