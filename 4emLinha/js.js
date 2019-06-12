
/*
$(document).ready(function () {
    newPopup();
    
});*/

function clicou(x){
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('/img/amarelo.png')"
}



function newPopup(){
    varWindow = window.open ('popup.html','Dificuldade',
    "width=600, height=439, top=160, left=360, scrollbars=no ");
    //varWindow.document.write ('<link rel="stylesheet" href="css/estilo.css"><div class="dificuldade"> <button>Fácil</button><br><button>Médio</button><br><button>Difícil</button></div>');
    //varWindow = varWindow.close()
}