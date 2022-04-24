/*
*   BIBLIOTECAS
*/
const axios = require('axios');
const jsdom = require("jsdom");
const { type } = require('os');
const { JSDOM } = jsdom;
/*
*   VARIÁVEIS
*/
let paginasManga = []
let listaDeUrls = [];
let ultimoCapitulo = 682;
const capitulo = {
    grupo: "Anima Regia",
    volume: "",
    numeroCap: "",
    lingua: "pt-BR",
    nome: "",
    paginas: paginasManga,
}
/*
*   FUNÇÕES
*/
// Gera as URLS a serem acessadas
for(numeroCapitulo = 511; numeroCapitulo <= ultimoCapitulo; numeroCapitulo++){
    listaDeUrls.push(`http://animaregia.net/manga/yowamushi-pedal-ptbr/${numeroCapitulo}/1`);
}
function extraiNomeCap(stringHTML){
    const htmlConvertido = new JSDOM(stringHTML);
    const extraiLi = htmlConvertido.window.document.querySelector("li#chapter-list").innerHTML;
    const liConvertido = new JSDOM(extraiLi);
    const extraiA = liConvertido.window.document.querySelector("li.active").innerHTML;
    const aConvertido = new JSDOM(extraiA);
    const titulo = aConvertido.window.document.querySelector("a").innerHTML;
    capitulo.nome =  titulo.split(": ").pop();
}
// Executa o acesso a URL passada
axios
  .get(listaDeUrls[0])
  .then(res => {
    extraiNomeCap(res.data);
    console.log(capitulo);
  })
  .catch(error => {
    console.error(error);
  })