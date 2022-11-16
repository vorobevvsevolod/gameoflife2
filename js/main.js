'use strict'
//CANVAS
const canvasGPU = $('#canvas')[0];
let canvasContextGPU
try{
    canvasContextGPU = canvasGPU.getContext('webgl2') ||canvasGPU.getContext('webgl') || canvas.getContext('experimental-webgl2')|| canvas.getContext('experimental-webgl');
}catch(e){
alert("Ваш браузер не поддерживает технологию WebGl")
}


const canvasCPU = $('#canvasCPU')[0];
const canvasContextCPU = canvasCPU.getContext('2d');

let colorGrid = "#ffffff";

let gpu = new GPU({
    canvas: canvasGPU,
    context: canvasContextGPU
});

//Масштаб
let resolution = 1;
let renderSetting = 0;

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
let modeBrushes = true;
let modeStepGame = false;
let draw = false;

let countSlider = 0;

window.onload = () =>{
    canvas.width = WIDHT;
    canvas.height = HEIGHT;
    widthMap = Math.ceil(WIDHT / resolution) + 2;
    heightMap = Math.ceil(HEIGHT / resolution) + 2;

    //Получение инфы о видеокарте
    let debugInfo = canvasContextGPU.getExtension('WEBGL_debug_renderer_info');
    let vendor = canvasContextGPU.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    let n = vendor.split(" ");
    n[n.length - 1].substring(1);
    let result = n[n.length - 1].slice(1, -1);
    console.log(vendor, result, n[0])
    if(result == n[0] ) $('.model').fadeToggle(); else $('#canvasCPU').remove(); 
};
 

//Старт игры
function startGameButton() {  
    if(modeStepGame){
        requestAnimationFrame(gameStepMode)
    }else{
        gameStop = gameStop ? false : true;

        if(gameStop && !startGame) gameStop = false;
        if(gameStop) { $('#start').html('Старт'); cancelAnimationFrame(requestFrameId); } 
        else { $('#start').html('Стоп'); requestFrameId = requestAnimationFrame(gameStep); }
    }  
    if(!startGame){
        restartGame();
        $('#stop').html('Заново');
        startGame = true;
    }     
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
let genP = $('.setting__generation');
function gameStep(timestamp){
    const diff = timestamp - time;
    let progress;

    if (startTime === null) startTime = timestamp;
    progress = timestamp - startTime;

    if(progress > stepInMs){
        TwoGame.NextGeneration();
        renderSetting == 2 
            ? PrintMap()
            :render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
        startTime = timestamp;
    }

    time = timestamp;
    genP.html("Поколение: " + TwoGame.countGeneration);

    requestFrameId = requestAnimationFrame(gameStep); 
}

//Обновление экрана игры
function printRequstMap() {
    renderSetting == 2 
            ? PrintMap()
            :render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
};

//Режим шаг отрисовка
function gameStepMode() {
    TwoGame.NextGeneration()
    renderSetting == 2 
            ? PrintMap()
            :render(TwoGame.Map, widthMap, Bivariate.ReactBelMode, resolution, colorRGB);
    genP.html("Поколение: " + TwoGame.countGeneration);
}

const PrintMap = () =>{
    canvasContextCPU.clearRect(0,0, WIDHT, HEIGHT);
    canvasContextCPU.beginPath();
    
    for(let y = 1; y < heightMap - 1; y++)
        for(let x = 1; x < widthMap - 1; x++){
            if(!Bivariate.ReactBelMode){
                if(TwoGame.Map[x + y * widthMap] == 1)
                canvasContextCPU.rect(
                    (x * resolution) - resolution, 
                    (y * resolution) - resolution, 
                    (resolution- 0.5), (resolution - 0.5) ); 
            }else{
                switch(TwoGame.Map[x + y * widthMap]){
                    case 1: 
                    canvasContextCPU.fillStyle = colorTwo;
                    canvasContextCPU.fillRect(
                        (x * resolution) - resolution, 
                        (y * resolution) - resolution, 
                        resolution, resolution); 
                    break;
                    case 2: 
                    canvasContextCPU.fillStyle = colorThree;
                    canvasContextCPU.fillRect(
                        (x * resolution) - resolution, 
                        (y * resolution) - resolution, 
                        resolution, resolution); 
                    break;
                }
            }
            
        }
       

    canvasContextCPU.closePath();
    canvasContextCPU.fill();
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
        if(modeBrushes)TwoGame.AddCellMap(posX, posY); else TwoGame.RemoveCellMap(posX, posY);
        
        if(gameStop) requestAnimationFrame(printRequstMap);
    }else{
        if(!add) TwoGame.AddCellMap(posX, posY); else TwoGame.RemoveCellMap(posX, posY);
        if(gameStop) requestAnimationFrame(printRequstMap);
        }      
}  

//Нажатие на canvas
function canvasClick(x, y) {
    if(!Bivariate.ReactBelMode && TwoGame){
        let posX; 
        let posY; 
        if(renderSetting == 2){
            posX = Math.ceil(x / resolution);
            posY = Math.floor(y / resolution) + 1;
        }else{
            posX = Math.ceil(x / resolution);
            posY = TwoGame.height - Math.round(y / resolution) - 2;
        }      
        if(TwoGame)AddRemoveCell(event.ctrlKey, posX, posY);
    }
}  