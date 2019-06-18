var dific = 0
var modal
var vezJogador = 1 //1 para jogador e 2 para maquina

$(document).ready(function () {   
    newModal();
});

function newModal(){
    modal = document.getElementById("myModal");
    modal.style.display = "block";     
      
}


function clicou(x){
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('/img/vermelho.png')"
    botaoClicado.disabled=true; 
    
}

function mouseCima(x){
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('/img/jogada.png')"
}

function mouseSai(x){
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('/img/vazio.png')"
}



//////////////////////////programaçao da IA///////////////////////////////////////

function dificuldade(x){
    dific = Number(x)
    modal.style.display = "none"
    iniciarJogo()
}

var matriz = new Array(6);

for (var i = 0; i < matriz.length; i++) {
  matriz[i] = new Array(7);
}

for(var i = 0; i < 6; i++) {
    if(i==5){
        matriz[i][j] = 0;
    }else{
        for(var j = 0; j < 7; j++) {
            matriz[i][j] = 0;
        }
    }    
}
  console.log("kk eae")
  console.log(matriz)

function iniciarJogo(){
    if(vezJogador==1){

    }
    if(vezJogador==2){

    }
    window.alert("eae man")
}