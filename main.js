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
    lingua: "",
    nomeCap: "",
    paginas: paginasManga,
}
/*
*   FUNÇÕES
*/
// Gera as URLS a serem acessadas
for(numeroCapitulo = 511; numeroCapitulo <= ultimoCapitulo; numeroCapitulo++){
    listaDeUrls.push(`http://animaregia.net/manga/yowamushi-pedal-ptbr/${numeroCapitulo}/1`);
}
function pegaNomeCap(stringHTML){
    const dom = new JSDOM(dados.data);
    let pegaLi = dom.window.document.querySelector("li#chapter-list").innerHTML;
    const liConvertido = new JSDOM(pegaLi);
    let pegaA = liConvertido.window.document.querySelector("li.active").innerHTML;
    const aConvertido = new JSDOM(pegaA);
    let aTitulo = aConvertido.window.document.querySelector("a").innerHTML;
    console.log(aTitulo);
    return aTitulo.split(": ").pop();
}
// Executa o acesso a URL passada
axios
  .get(listaDeUrls[0])
  .then(res => {
    pegaNomeCap(res.data);
    
  })
  .catch(error => {
    console.error(error);
  })