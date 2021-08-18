import { limparCampos, limpaSeletor } from "./botaoLimpar.js"
import {resultados, warnninggerber} from "./respostas.js"

var classeMaeEntradasDenteGerber = document.getElementById('calculoDenteGerber').children[0].children[1].getElementsByClassName('entradas')
var btnDenteGerber = document.getElementById("btnDenteGerber")

var dE, fcd, fyd, fcdr, Rsd, pdEf, valorTetha, arcTg, senTetha, sigma, AsTirante, AsCostura, AsSuspensao = 0

// Calculo do dente gerber
function calcularDenteGerber(lista, resistenciaConcreto,
    resEscoamentoAco, cargaCalculo, cargaHorizontalC, dimensaoE

){
    resistenciaConcreto /= 1000
    dE = dimensaoE * 100

    fcd = resistenciaConcreto / 1.4
    fyd = resEscoamentoAco / 1.15

    // Converte os campos em metro.
    let listaNomes = ["alturaUtilGerber", "distanciadlinha",
        "dimZ", "dAplicacaoCarga", "larguraDenteGerber",
        "lPontodeApoioC", "dBielaDeCompresssao"]
    let valoresMetro = {}
    for(let i = 0; i< lista.length - 5; i ++){
        valoresMetro[listaNomes[i]] = parseFloat(lista[i].value) * 100
        
    }
    

    fcdr = 0.6 * (1 - (resistenciaConcreto/250)) * fcd

    // Verifica se a carga horizontal foi adicionada.
    if(isNaN(cargaHorizontalC)){
        Rsd = ((cargaCalculo * valoresMetro["dAplicacaoCarga"] ) / valoresMetro["dimZ"])
        pdEf = cargaCalculo

    }else {
        Rsd = ((cargaCalculo * valoresMetro["dAplicacaoCarga"] ) / valoresMetro["dimZ"])  + cargaHorizontalC * (1 + (dE/ listaNomes["dimZ"]))
        pdEf = cargaCalculo + (dE /listaNomes["dAplicacaoCarga"] ) * cargaHorizontalC
    }
    
    valorTetha = (valoresMetro["alturaUtilGerber"] - valoresMetro["distanciadlinha"]) / (valoresMetro["dAplicacaoCarga"] + (valoresMetro["lPontodeApoioC"] / 2))

    arcTg = Math.atan(valorTetha)

    senTetha = Math.sin(arcTg)

    sigma = pdEf / (valoresMetro["larguraDenteGerber"] * valoresMetro["dBielaDeCompresssao"] * senTetha)

    sigma *= 10

    let listaSaida = []
    // Dá a resposta dos valores
    if (sigma <= fcdr){
        console.log("A largura do aparelho é satisfatória.")
        AsTirante = Rsd / fyd
        AsCostura = AsTirante / 2
        AsSuspensao = cargaCalculo / fyd

        listaSaida = [{"Área de aço da armadura do tirante: ": AsTirante},
            {"Área de aço da armadura de Costura: ": AsCostura},
            {"Área de aço da armadura de Suspensão: ": AsSuspensao}]


        console.log("Armadura do tirante: ",AsTirante)
        console.log("Armadura de Costura: ", AsCostura)
        console.log("Armadura de Suspensão: ", AsSuspensao)

    }else{

        warnninggerber(document.getElementsByClassName("divsCalculos")[4], "A largura do aparelho não satisfaz.","Recomenda-se uma resvisão dos valores.")
        console.log("A largura do aparelho não satisfaz.")
        console.log("Recomenda-se uma resvisão dos valores.")
        listaSaida = []

    }
    return listaSaida

}
7

btnDenteGerber.onclick = function(){
    var valor = calcularDenteGerber(
        classeMaeEntradasDenteGerber,                      // lista
        parseFloat(classeMaeEntradasDenteGerber[7].value), // resistenciaConcreto
        parseFloat(classeMaeEntradasDenteGerber[8].value), // resEcoamentoAco
        parseFloat(classeMaeEntradasDenteGerber[9].value),  // cargaCalculo
        parseFloat(classeMaeEntradasDenteGerber[10].value), // cargaHorizontalC
        parseFloat(classeMaeEntradasDenteGerber[11].value)  // dimensaoE
    )
    resultados(document.getElementsByClassName("divsCalculos")[4], valor, false, 'imagens/viga/Gerber.jpg');

    
    
}

document.getElementById("btnLimpaGerber").onclick = function(){
    limparCampos(classeMaeEntradasDenteGerber)
    

}