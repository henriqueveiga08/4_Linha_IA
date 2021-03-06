var dific = 0
var modal
var vezJogador = -1 //-1 para jogador e 1 para maquina


$(document).ready(function () {
    newModal();

    estadoAtual = new Estado(0, -1, false);

    //console.log("estado Atual")
    //console.log(estadoAtual)
});

class Estado {
    constructor(nivel, jogadorAtual, maximizar) {
        this.tabuleiro = new Array(
            [Number(0), Number(0), Number(0), Number(0), Number(0), Number(0), Number(0)],
            [Number(0), Number(0), Number(0), Number(0), Number(0), Number(0), Number(0)],
            [Number(0), Number(0), Number(0), Number(0), Number(0), Number(0), Number(0)],
            [Number(0), Number(0), Number(0), Number(0), Number(0), Number(0), Number(0)],
            [Number(0), Number(0), Number(0), Number(0), Number(0), Number(0), Number(0)],
            [Number(3), Number(3), Number(3), Number(3), Number(3), Number(3), Number(3)]
        );
        this.nivel = nivel;
        this.jogadorAtual = jogadorAtual;
        this.max = maximizar;
        this.minMax = 0;
        this.filhos = [];
        this.jogadaFeitaNoEstado = -1;
    };

    get procuraBotoesPossiveis() {
        var array = new Array();
        var i = Number();
        var j = Number();
        for (i = 0; i < 6; i++) {
            for (j = 0; j < 7; j++) {
                if (this.tabuleiro[i][j] == 3) {
                    array.push((i * 7) + j);
                }
            }
        }
        return array;
    };
}


function newModal() {
    modal = document.getElementById("myModal");
    modal.style.display = "block";
}


function dificuldade(x) {
    dific = Number(x);
    modal.style.display = "none";
    //estadoAtual.nivel = x;
}


function clicou(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('img/vermelho.png')"
    botaoClicado.disabled = true; //Desabilita o botao que o jogador clicou
    atualizaTabuleiro(estadoAtual, estadoAtual, botao, estadoAtual.jogadorAtual); //Atualiza a matriz com o valor jogado
    var r = verificaVitoria(estadoAtual, estadoAtual.jogadorAtual);
    console.log(`o valor de JOG foi = ${r}`)
    if (r == 1 || r == -1) {
        finalizarJogo(r);
    }


    estadoAtual = escolherJogada(estadoAtual); //Ia escolhe uma jogada para fazer

}


function mouseCima(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('img/jogada.png')"
}


function mouseSai(x) {
    var botao = String(x)
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    botaoClicado.style.background = "url('img/vazio.png')"
}



function atualizaTabuleiro(state, pai, botao, jogador) {
    x = Number(botao);
    q = Number(x / 7) | 0;
    w = Number(x % 7) | 0;
    var i = Number();
    var j = Number();
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            state.tabuleiro[i][j] = pai.tabuleiro[i][j];
        }
    }
    if (jogador == 1) {
        state.tabuleiro[q][w] = 1;
    } else {
        state.tabuleiro[q][w] = -1;
    }
    if (botao > 6) {
        state.tabuleiro[q - 1][w] = 3;
    }
    state.jogadaFeitaNoEstado = x;
};


function escolherJogada(state) {
    state.nivel = 0;
    gerarArvore(state, dific, state.jogadorAtual);
    var jogada = state.filhos[0];
    var js = []
    for(var i=0; i<state.filhos.length;i++){
        console.log("FILHOS E MIN MAX")
        console.log(state.filhos[i].minMax)
    }
    //console.log("JOGADA")
    //console.log(jogada)

    state.filhos.forEach(element => {
        if (element.minMax > jogada.minMax) {
            js = []
            js.push(element)
        } else if (element.minMax == jogada.minMax) {
            js.push(element)
        }
    });

    var posicao = Math.floor(Math.random() * js.length)
    jogada = js[posicao];
    //console.log("essa foi a jogada")
    //console.log(jogada)
    while (jogada.filhos.length > 0) {
        jogada.filhos.pop();
    }
    state = jogada;
    console.log("MINIMAX DESSE STADO É")
    console.log(state.minMax)
    //console.log("jogador Atual é")
    //console.log(state.jogadorAtual)
    atualizaTabuleiro(state, state, state.jogadaFeitaNoEstado, state.jogadorAtual)
    atualizaInterface(state);
    var x = verificaVitoria(state.jogadorAtual);
    console.log(`o valor de IA foi = ${x}`)
    if (x == 1 || x == -1) {
        finalizarJogo(x);
    }
    state.jogadorAtual = state.jogadorAtual * -1 //vem com o falor do jogador atual e isMax de filho
    state.max = !state.max
    return state;
}


function gerarArvore(state, nivelDificuldade, jogadorAtual) {
    posicoes = [];
    var iterador = Number(0);

    if (state.nivel == nivelDificuldade) {
        // Chegou até o último nível possível
        state.minMax = Number(calcularMinMax(state));
        return state.minMax
    }

    posicoes = state.procuraBotoesPossiveis

    posicoes.forEach(element => {
        // Para cada posição possível cria um novo estado e coloca na lista de estados filhos do estado atual        
        aux = new Estado(state.nivel + 1, (-1) * jogadorAtual, !state.max);
        atualizaTabuleiro(aux, state, element, jogadorAtual);
        aux.jogadaFeitaNoEstado = element;
        state.filhos.push(aux);
        iterador++;
    });


    if (iterador > 0) {
        //state.filhos = filhos
    } else {
        // Não tem mais posições jogáveis, chegou na folha da árvore
        state.minMax = Number(calcularMinMax(state));
        return state.minMax
    }
    /*
        if (state.max) {
            state.minMax = -64;
        } else {
            state.minMax = 64;
        }*/

    state.filhos.forEach(element => {
        
        // Gera a árvore para cada estado filho do estado atual
        gerarArvore(element, nivelDificuldade, jogadorAtual);
        if (state.max) {
            if (element.minMax > state.getMinmax) {
                state.minMax = element.getMinmax;
            }
        } else {
            if (element.minMax < state.getMinimax) {
                state.minMax = element.getMinmax;
            }
        }
        console.log("ESTA DENTRO DE GERAR ARVORE, MINIMAX=")
        console.log(element.minMax)
    });

    state.minMax = Number(calcularMinMax(state));
    return state.minMax
}


function atualizaInterface(state) {
    var botao = state.jogadaFeitaNoEstado;
    var stringElemento = String("button" + botao)
    var botaoClicado = document.getElementById(stringElemento)
    //window.alert(`botao clicado foi ${stringElemento}`)
    botaoClicado.style.background = "url('img/amarelo.png')"
    botaoClicado.disabled = true;
    habilitaBotoes(state);
}


function habilitaBotoes(state) {
    var i = Number();
    var j = Number();
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            if (state.tabuleiro[i][j] == 3) {
                x = Number(i * 7 + j);
                botao = String(x);
                var stringElemento = String("button" + botao)
                var botaoHabilitado = document.getElementById(stringElemento)
                botaoHabilitado.disabled = false;
            }
        }
    }
}


function verificaVitoria(state, jogador) {
    posicaoJogada = state.jogadaFeitaNoEstado;
    x = Number(posicaoJogada);
    linha = Number(x / 7) | 0;
    coluna = Number(x % 7) | 0;
    var i = Number();
    var j = Number();
    var countJOG = Number(0)
    var countIA = Number(0)


    if (jogador == 1) {
        ///////////////varrendo noroeste//////////////////////////varrendo sudeste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i > 0 && j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i - 1][j - 1] == 1) {
                countIA++;
            } else {
                i = 0;
            }
            i--;
            j--;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j + 1] == 1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
            j++;
        }
        if (countIA == 3) {
            return 1;
        }


        /////////////////varrendo oeste/////////////////////varrendo leste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i][j - 1] == 1) {
                countIA++;
            } else {
                j = 0;
            }
            j--;
        }
        i = linha;
        j = coluna;
        while (j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i][j + 1] == 1) {
                countIA++;
            } else {
                j = 6;
            }

            j++;
        }
        if (countIA == 3) {
            return 1;
        }


        ///////////////////varrendo nordeste////////////////////////varrendo sudoeste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i > 0 && j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i - 1][j + 1] == 1) {
                countIA++;
            } else {
                i = 0;
            }
            i--;
            j++;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j - 1] == 1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
            j--;
        }
        if (countIA == 3) {
            return 1;
        }

        ///////////////////varrendo sul//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i < 5) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j] == 1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
        }
        if (countIA == 3) {
            return 1;
        }
    }


    if (jogador == -1) {
        ///////////////varrendo noroeste//////////////////////////varrendo sudeste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i > 0 && j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i - 1][j - 1] == -1) {
                countJOG++;
            } else {
                i = 0;
            }
            i--;
            j--;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j + 1] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
            j++;
        }
        if (countJOG == 3) {
            return -1;
        }


        /////////////////varrendo oeste/////////////////////varrendo leste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i][j - 1] == -1) {
                countJOG++;
            } else {
                j = 0;
            }
            j--;
        }
        i = linha;
        j = coluna;
        while (j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i][j + 1] == -1) {
                countJOG++;
            } else {
                j = 6;
            }
            j++;
        }
        if (countJOG == 3) {
            return -1;
        }


        ///////////////////varrendo nordeste////////////////////////varrendo sudoeste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i > 0 && j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i - 1][j + 1] == -1) {
                countJOG++;
            } else {
                i = 0;
            }
            i--;
            j++;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j - 1] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
            j--;
        }
        if (countJOG == 3) {
            return -1;
        }


        ///////////////////varrendo sul//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i < 5) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
        }
        if (countJOG == 3) {
            return -1;
        }
    }


    return 0;

}


function calcularMinMax(state) {
    posicaoJogada = state.jogadaFeitaNoEstado;
    x = Number(posicaoJogada);
    linha = Number(x / 7) | 0;
    coluna = Number(x % 7) | 0;
    var i = Number();
    var j = Number();
    var countJOG = Number(0)
    var countIA = Number(0)
    var maiorIA = Number(0)
    var maiorJOG = Number(0)
    var jogador = state.jogadorAtual
    if (jogador == 1) {
        ///////////////varrendo noroeste//////////////////////////varrendo sudeste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i > 0 && j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i - 1][j - 1] == 1) {
                countIA++;
            } else {
                i = 0;
            }
            i--;
            j--;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j + 1] == 1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
            j++;
        }
        if (countIA > maiorIA) {
            maiorIA = countIA;
        }


        /////////////////varrendo oeste/////////////////////varrendo leste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i][j - 1] == 1) {
                countIA++;
            } else {
                j = 0;
            }
            j--;
        }
        i = linha;
        j = coluna;
        while (j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i][j + 1] == 1) {
                countIA++;
            } else {
                j = 6;
            }

            j++;
        }
        if (countIA > maiorIA) {
            maiorIA = countIA;
        }


        ///////////////////varrendo nordeste////////////////////////varrendo sudoeste//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i > 0 && j < 6) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i - 1][j + 1] == 1) {
                countIA++;
            } else {
                i = 0;
            }
            i--;
            j++;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j > 0) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j - 1] == 1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
            j--;
        }
        if (countIA > maiorIA) {
            maiorIA = countIA;
        }

        ///////////////////varrendo sul//////////////////
        i = linha;
        j = coluna;
        countIA = 0;
        while (i < 5) {
            if (state.tabuleiro[i][j] == 1 && state.tabuleiro[i + 1][j] == -1) {
                countIA++;
            } else {
                i = 5;
            }
            i++;
        }
        if (countIA > maiorIA) {
            maiorIA = countIA;
        }
    }


    if (jogador == -1) {
        ///////////////varrendo noroeste//////////////////////////varrendo sudeste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i > 0 && j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i - 1][j - 1] == -1) {
                countJOG++;
            } else {
                i = 0;
            }
            i--;
            j--;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j + 1] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
            j++;
        }
        if (countJOG > maiorJOG) {
            maiorJOG = countJOG;
        }


        /////////////////varrendo oeste/////////////////////varrendo leste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i][j - 1] == -1) {
                countJOG++;
            } else {
                j = 0;
            }
            j--;
        }
        i = linha;
        j = coluna;
        while (j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i][j + 1] == -1) {
                countJOG++;
            } else {
                j = 6;
            }
            j++;
        }
        if (countJOG > maiorJOG) {
            maiorJOG = countJOG;
        }


        ///////////////////varrendo nordeste////////////////////////varrendo sudoeste//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i > 0 && j < 6) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i - 1][j + 1] == -1) {
                countJOG++;
            } else {
                i = 0;
            }
            i--;
            j++;
        }
        i = linha;
        j = coluna;
        while (i < 5 && j > 0) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j - 1] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
            j--;
        }
        if (countJOG > maiorJOG) {
            maiorJOG = countJOG;
        }


        ///////////////////varrendo sul//////////////////
        i = linha;
        j = coluna;
        countJOG = 0;
        while (i < 5) {
            if (state.tabuleiro[i][j] == -1 && state.tabuleiro[i + 1][j] == -1) {
                countJOG++;
            } else {
                i = 5;
            }
            i++;
        }
        if (countJOG > maiorJOG) {
            maiorJOG = countJOG;
        }
    }

    console.log("MAIORIA E MAIORJOG RESPECTIVAMENTE")
    console.log(maiorIA)
    console.log(maiorJOG)
    if (state.max) {
        return maiorIA;
    }
    return -maiorJOG;
};


function finalizarJogo(vencedor) {
    if (vencedor == 1) {
        alert(`O jogador vencedor foi a máquina`);
    } else {
        alert(`O jogador vencedor foi o humano`);
    }

}


