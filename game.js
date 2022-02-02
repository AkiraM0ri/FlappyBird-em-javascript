const 
    canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    sprites = new Image(),
    sound_hit = new Audio(),
    sound_jump = new Audio(),
    sound_ponto = new Audio();

let frames = 0

sound_jump.src = './efeitos/pulo.wav'
sound_ponto.src = './efeitos/ponto.wav'
sound_hit.src = './efeitos/hit.wav'
sprites.src = './sprites/sprites.png'

//colisao do flappybird com o chao
function fazColisao(flappy, terreno) {
    const flappyBirdY = flappy.y + flappy.height;
    const terrenoY = terreno.y

    if (flappyBirdY >= terrenoY) {
        return true
    } 
    return false
}

function criarFlappy(){
    const flappy = {
        spriteX:  0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.20,
        pulo: 4.5,
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                const 
                incremento = flappy.frameAtual + 1,
                baseRepeticao = flappy.movimentos.length;
            flappy.frameAtual = incremento % baseRepeticao;
            }
            
        },
        pula(){
            flappy.velocidade = - flappy.pulo;
            sound_jump.play()
        },
        taxaDeAtualizacao() {
            if(fazColisao(flappy, globais.terreno)) {
                sound_hit.play()
                mudarTela(telas.gameOver);
                return
            }
    
            flappy.velocidade = flappy.velocidade + flappy.gravidade;
            flappy.y = flappy.y + flappy.velocidade
        },
        desenhar(){
            flappy.atualizaFrameAtual()
            const { spriteX, spriteY } = flappy.movimentos[flappy.frameAtual]
            context.drawImage(
                sprites, 
                spriteX, spriteY, // spriteX e spriteY 
                flappy.width, flappy.height, // tamanho do recorte inicial da sprite 
                flappy.x, flappy.y, // posicao do sprite no canvas
                flappy.width, flappy.height, // tamanho do sprite no canvas
            );
        }
    };
    return flappy;
}

//flappyBird

//terreno
function criarTerreno() {
    const terreno = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
    
        atualiza(){
            terreno.x = terreno.x - 1;

            if (terreno.x < -120) {
                terreno.x = -10
            }
        },
        desenhar(){
            context.drawImage(
                sprites,
                terreno.spriteX, terreno.spriteY,   
                terreno.width, terreno.height,
                terreno.x, terreno.y,
                terreno.width, terreno.height,
            )
            context.drawImage(
                sprites,
                terreno.spriteX, terreno.spriteY,   
                terreno.width, terreno.height,
                (terreno.x + terreno.width), terreno.y,
                terreno.width, terreno.height,
            )
        }
    }
    return terreno
}
// cenario
const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y:canvas.height - 204,

    desenhar() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0,0, canvas.width, canvas.height)

        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,   
            background.width, background.height,
            background.x, background.y,
            background.width, background.height,
        )
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,   
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height,
        )
    }
}

// mensagem inicial
const messegeGetReady = {
    sX: 134,
    sY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 100,
    desenhar() {
        context.drawImage(
            sprites,
            messegeGetReady.sX, messegeGetReady.sY,
            messegeGetReady.width, messegeGetReady.height,
            messegeGetReady.x, messegeGetReady.y,
            messegeGetReady.width, messegeGetReady.height,
        )
    }
}
// mensagem de GameOver
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    width: 226,
    height: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 100,
    desenhar() {
        context.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.width, mensagemGameOver.height,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.width, mensagemGameOver.height,
        )
    }
}

const globais = {};
let telaAtiva = {};

function mudarTela(novaTela) {
    telaAtiva =  novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

//placar de pontuacao
function criaPlacar() {
    const placar = {
        timer: -3,
        pontuacao: 0,
        desenhar() {
            context.font = '35px "VT323"',
            context.textAlign = 'center'
            context.fillStyle = '#fff'
            context.fillText(`${placar.pontuacao}`, 160, 35)
            placar.pontuacao
        },
        atualiza() {
            let intervaloDeFrames = 100;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                placar.timer = placar.timer + 1;
            }
            if(placar.timer >= placar.pontuacao) {
                 placar.pontuacao ++
                 sound_ponto.play()
             }
        }
    }
    return placar
}

// criar canos
function criarPipes(){
    const pipes = {
        width: 52,
        height: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        pares: [],
        
        espaco: 80,
        desenhar() {
            
            pipes.pares.forEach((par)=>{
                //canoDoCeu
                const 
                    yRandom = par.y,
                    espacamentoEntreCanos = 120,
                    canoCeuX = par.x,
                    canoCeuY = yRandom;

                context.drawImage(
                    sprites,
                    pipes.ceu.spriteX, pipes.ceu.spriteY,
                    pipes.width, pipes.height,
                    canoCeuX, canoCeuY,
                    pipes.width, pipes.height,
                )

                //canoDoChao
                const 
                    canoChaoX = par.x,
                    canoChaoY = pipes.height + espacamentoEntreCanos + yRandom;
                context.drawImage(
                    sprites,
                    pipes.chao.spriteX, pipes.chao.spriteY,
                    pipes.width, pipes.height,
                    canoChaoX, canoChaoY,
                    pipes.width, pipes.height,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: pipes.height + canoCeuY,
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            })
        },
        temColisao(par) {
            const
                cabecaFlappy = globais.flappy.y,
                peFlappy = globais.flappy.y + globais.flappy.height;
                
            if((globais.flappy.x + globais.flappy.width) >= par.x) {
                // console.log('area dos canos')
                if(cabecaFlappy <= par.canoCeu.y){
                    return true
                }
                if(peFlappy >= par.canoChao.y){
                    return true
                }
            }
            return false
        },
        
        atualiza(){
            const passou100Frames = frames % 100 === 0;

            if (passou100Frames) {
                pipes.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            pipes.pares.forEach((par)=> {
                par.x = par.x - 2;

                if(pipes.temColisao(par)){
                    sound_hit.play()
                    mudarTela(telas.gameOver)
                }

                if(par.x + pipes.width <= 0) {
                    pipes.pares.shift()
                }
            })
        }
    }
    return pipes
}

//telas do jogo
const telas = {
    inicio: {
        inicializa() {
            globais.flappy = criarFlappy();
            globais.terreno = criarTerreno();
            globais.pipes = criarPipes()
        },
        desenhar() {
            background.desenhar();
            globais.terreno.desenhar();
            globais.flappy.desenhar();
            messegeGetReady.desenhar();
        },
        click() {
            mudarTela(telas.jogo)
        },
        taxaDeAtualizacao(){
            globais.terreno.atualiza()
        }
    },
    jogo: {
        inicializa() {
            globais.placar = criaPlacar()
        },
        desenhar() {
            background.desenhar();
            globais.pipes.desenhar()
            globais.terreno.desenhar();
            globais.flappy.desenhar();
            globais.placar.desenhar();
        },
        click() {
            globais.flappy.pula();
        },
        taxaDeAtualizacao(){
            globais.pipes.atualiza()
            globais.flappy.taxaDeAtualizacao();
            globais.terreno.atualiza()
            globais.placar.atualiza()
        }
    },
    gameOver: {
        desenhar(){
            mensagemGameOver.desenhar()
        },
        taxaDeAtualizacao(){
            
        },
        click() {
            mudarTela(telas.inicio)
        },
    }
}


//Frames por segundo
function framesPerSecondLoop() {
    telaAtiva.desenhar()
    telaAtiva.taxaDeAtualizacao()

    frames += 1;
    requestAnimationFrame(framesPerSecondLoop);
}

window.addEventListener('click', ()=>{
    telaAtiva.click ? telaAtiva.click() : null;
})

mudarTela(telas.inicio)
framesPerSecondLoop()