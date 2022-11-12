'use strict'
//CANVAS
const canvas = $('#canvas')[0];
const canvasContext = canvas.getContext('webgl2', { premultipliedAlpha: false });

const gpu = new GPU({
    canvas,
    context: canvasContext
});

//Масштаб
let resolution = 1;

//Размер экрана
const WIDHT = window.innerWidth;
const HEIGHT = window.innerHeight;

//Анимация
let requestFrameId;

//Обьект класса
let TwoGame;

//Размер карты 
let widthMap;
let heightMap;

//Скорость игры
let startTime = null; 
let stepInMs = 1;

//Цвет
let colorRGB = [
    [(1/255) * 255,0,0],
    [(1/255) * 168, (1/255) * 31, (1/255) * 21],
    [(1/255) * 142, (1/255) * 88, (1/255) * 167],
    [(1/255) * 98,  (1/255) * 88,  (1/255) * 141]
];

//Флаги
let gameStop = false;
let startGame = false;
let openSeting = false;
let modeBrushes = true;
let modeStepGame = false;
let draw = false;

window.onload = () =>{
    canvas.width = WIDHT;
    canvas.height = HEIGHT;
};

//Старт игры
function startGameButton() {
    if(!startGame){
        restartGame();
        document.getElementById('stop').textContent = 'Заново';
    }
    
    if(modeStepGame){
        requestAnimationFrame(gameStepMode)
    }else{
        gameStop = gameStop ? false : true;

        if(gameStop && !startGame) gameStop = false;
        if(gameStop) {document.getElementById('start').textContent = 'Старт'; cancelAnimationFrame(requestFrameId);} else 
        {document.getElementById('start').textContent = 'Стоп'; requestFrameId = requestAnimationFrame(gameStep);}
    }   
    startGame = true;
}

//Перезапуск игры
function restartGame() {
    widthMap = Math.ceil(WIDHT / resolution) + 2;
    heightMap = Math.ceil(HEIGHT / resolution) + 2;
    TwoGame = new Bivariate(widthMap, heightMap);  
    requestAnimationFrame(printRequstMap);
}

//Очистка поля
function clearMap() {
    TwoGame.Clear();
    requestAnimationFrame(printRequstMap);
}

let time = 0;
let genP = $('#generation');
function gameStep(timestamp){
    const diff = timestamp - time;
    let progress;

    if (startTime === null) startTime = timestamp;
    progress = timestamp - startTime;

    if(progress > stepInMs){
        TwoGame.NextGeneration();
        render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
        startTime = timestamp;
    }

    time = timestamp;
    genP.html("Поколение: " + Math.floor(1000 / diff));

    requestFrameId = requestAnimationFrame(gameStep); 
}

//Обновление экрана игры
function printRequstMap() {
    render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB)
};

//Режим шаг отрисовка
function gameStepMode() {
    TwoGame.NextGeneration()
    render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
    genP.html("Поколение: " + TwoGame.countGeneration);
}

const render = gpu.createKernel(function(mas, wid, flag, size, color) {  
    let x = Math.floor(this.thread.x / size) + 1;
    let y = Math.floor(this.thread.y / size) + 1;
    if(flag){
       if(mas[x + y * wid] == 0) this.color(color[1][0], color[1][1], color[1][2], 1);
       if(mas[x + y * wid] == 1) this.color(color[2][0], color[2][1], color[2][2], 1);
       if(mas[x + y * wid] == 2) this.color(color[3][0], color[3][1], color[3][2], 1);
    }else if(mas[x  + y  * wid] == 1){
        this.color(color[0][0], color[0][1], color[0][2], 1);
    }
}).setOutput([WIDHT, HEIGHT]).setGraphical(true);

//Добавление и удаления клеток
function AddRemoveCell(add, posX, posY) {
    if(window.innerWidth <= 1200){
        if(modeBrushes){
            TwoGame.AddCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(printRequstMap)
        }else{
            TwoGame.RemoveCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(printRequstMap)
        }
    }else{
        if(!add){

            TwoGame.AddCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(printRequstMap)
           
        }else{
            TwoGame.RemoveCellMap(posX, posY)
            if(gameStop) requestAnimationFrame(printRequstMap)
        }
    }  
}

//Нажатие на canvas
function canvasClick(x, y) {
    if(!Bivariate.ReactBelMode){
        let posX =Math.ceil(x / resolution);
        let posY =TwoGame.height - Math.round(y / resolution) - 1;
        if(TwoGame != undefined)
            AddRemoveCell(event.ctrlKey, posX, posY);
    }
}  