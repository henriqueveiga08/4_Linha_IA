var dific = 0
var modal
var vezJogador = -1 //-1 para jogador e 1 para maquina



$(document).ready(function () {
    newModal();

    //////////////////////////programaçao da IA/////////////////////////////////////// 
    /*
        var matriz = new Array(6);
        for (var i = 0; i < matriz.length; i++) {
            matriz[i] = new Array(7);
        }
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                if (i == 5) {
                    matriz[i][j] = Number(3);
                } else {
                    matriz[i][j] = Number(0);
                }
            }
        }
        console.log("Matriz:")
        console.log(matriz)
    */
    
     var matriz = new Array(
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0],
         [3, 3, 3, 3, 3, 3, 3]
     );
/*
    var x, x_length = 6
        , y, y_length = 7
        , matriz = []

    // Don't be lazy
    for (x = 0; x < x_length; x++) {
        matriz[x] = []
        for (y = 0; y < y_length; y++) {
            matriz[x][y] = 0
        }
    }*/

    var Estado = function (tabuleiro, nivel, jogadorAtual, maximizar) {
        this.tabuleiro = tabuleiro;
        this.nivel = nivel;
        this.jogadorAtual = jogadorAtual;
        this.max = maximizar;
        this.minMax = -10;

        this.setMinMax = function (valor) {
            this.minMax = valor;
        }

        this.setFilhos = function (valor) {
            this.Filhos = valor;
        }

        this.setJogadorAtual = function (valor) {
            this.jogadorAtual = valor;
        }

        this.setNivel = function (valor) {
            this.nivel = valor;
        }

        this.getMinMax = function () {
            return this.minMax;
        }

        this.getNivel = function () {
            return this.nivel;
        }

        this.getFilhos = function () {
            return this.filhos;
        }

        this.getJogadorAtual = function () {
            return this.jogadorAtual;
        }

        this.getTabuleiro = function () {
            return this.tabuleiro;
        }

        this.getJogadaFeitaNoEstado = function () {
            return this.jogadaFeitaNoEstado;
        }

        this.isMax = function () {
            return this.maximizar;
        }

        this.procuraBotoesPossiveis = function () {
            var array = [];
            for (i = 0; i < 6; i++) {
                for (i = 0; i < 7; i++) {
                    if (this.tabuleiro[i][j] == 3) {
                        array.push((i * 7) + j);
                    }
                }
            }
            return array;
        }

        this.calcularMinMax = function () {
            this.minMax = 1;
        }

        this.atualizaTabuleiro = function (botao, jogador) {
            x = Number(botao)
            i = Number(x/7)
            j = Number(x%7)
            if (jogador == 1) {
                this.tabuleiro[i][j] = 1;
            } else {
                this.tabuleiro[i][j] = -1;
            }
            this.jogadaFeitaNoEstado = x;
        }
    }

    estadoAtual = new Estado(matriz, 0, -1, false);
});


function newModal() {
    modal = document.getElementById("myModal");
    modal.style.display = "block";
}


function clicou(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('/img/vermelho.png')"
    botaoClicado.disabled = true;
    estadoAtual.atualizaTabuleiro(x, estadoAtual.getJogadorAtual());
    escolherJogada(estadoAtual);
}


function mouseCima(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('/img/jogada.png')"
}


function mouseSai(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('/img/vazio.png')"
}


function dificuldade(x) {
    dific = Number(x);
    modal.style.display = "none";
    estadoAtual.setNivel(x);
}


function escolherJogada(state) {
    gerarArvore(state, dific, (state.getJogadorAtual()) * (-1));
    var jogada;
    for (i in state.getFilhos()) {
        jogada = i;
        if (i.getMinMax > jogada) {
            jogada = i;
        }
    }
    while (jogada.getFilhos.length > 0) {
        jogada.getFilhos.pop();
    }
    state = jogada;
    atualizaInterface(state);
}


function gerarArvore(state, nivelDificuldade, jogadorAtual) {
    posicoes = new ArrayList();
    filhos = new ArrayList();
    var iterador = Number(0);

    if (state.getNivel() == nivelDificuldade) {
        // Chegou até o último nível possível
        state.setMinMax(state.calcularMinMax);
        //return state.getMinMax();
    }

    posicoes = state.procuraBotoesPossiveis();

    for (i in posicoes) {
        // Para cada posição possível cria um novo estado e coloca na lista de estados filhos do estado atual        
        aux = new Estado(state.getTabuleiro(), (state.getNivel() + 1), ((-1) * jogadorAtual), !state.isMax());
        aux.atualizaTabuleiro(i, jogadorAtual);
        filhos.push(aux);
        iterador++;
    }

    if (iterador > 0) {
        state.setFilhos(filhos);
    } else {
        // Não tem mais posições jogáveis, chegou na folha da árvore
        state.setMinMax(state.calcularMinMax());
        //return state.getMinMax();
    }

    if (state.isMax()) {
        state.setMinmax(-64);
    } else {
        state.setMinmax(64);
    }

    for (i in filhos) {
        // Gera a árvore para cada estado filho do estado atual
        gerarArvore(i, nivelDificuldade, ((-1) * jogadorAtual));
        if (state.isMax()) {
            if (i.getMinmax() > state.getMinmax()) {
                state.setMinmax(i.getMinmax());
            }
        } else {
            if (i.getMinmax() < state.getMinimax()) {
                state.setMinmax(i.getMinmax());
            }
        }
    }

    //return state.getMinimax();
}


function atualizaInterface(state) {
    var botao = state.getJogadaFeitaNoEstado;
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('/img/amarelo.png')"
}