function obterResposta(camada,textoUsuario){

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

  const texto =
  textoUsuario.toLowerCase();

  let respostasCompativeis = [];

  lista.forEach(item=>{

    item.tags.forEach(tag=>{

      if(texto.includes(tag)){

        respostasCompativeis.push(item);

      }

    });

  });

  /* fallback */

  if(respostasCompativeis.length === 0){

    respostasCompativeis = lista;

  }

  const respostaSelecionada =
  respostasCompativeis[
    Math.floor(
      Math.random() *
      respostasCompativeis.length
    )
  ];

  return respostaSelecionada.texto;

}
