$(document).ready(()=>{
    //открытие меню настроек
    $('#menu__toggle').on('click', ()=>{
        if($('#menu__toggle').is(':checked')){
            $('#settings').removeClass("displayNone");
            $('#settings').removeClass("opacityNone");
            $('#settings').addClass("displayBlock");

            setTimeout(() =>{
                $('#settings').addClass("opacity");
            }, 5)
        }else{
            $('#settings').removeClass("displayBlock")
            $('#settings').removeClass("opacity")
            $('#settings').addClass("opacityNone")
            $('#settings').addClass("displayNone")
        }

    });


    //Изменение правил игры 
    $('#burnTo').on('change', () =>{
        let burnTo = $('#burnTo');
        let burnToValue = burnTo.val();

        if(burnToValue > 8 && Bivariate.neighborhood == 0){
            Bivariate.burnTo = 8;
            burnTo.val('8');
        }
        if(burnToValue < 8 && Bivariate.neighborhood == 0) Bivariate.burnTo = burnToValue;
    
        if(burnToValue > 4 && Bivariate.neighborhood == 1){
            Bivariate.burnTo = 4;
            burnTo.val('4');
        }
        if(burnToValue < 4 && Bivariate.neighborhood == 1) Bivariate.burnTo = burnToValue;
    });

    $('#burnUp').on('change', () =>{
        let burnUp = $('#burnUp');
        let burnUpValue = burnUp.val();

        if(burnUpValue > 8 && Bivariate.neighborhood == 0){
            Bivariate.burnUp = 8;
            burnUp.val('8');
        }
        if(burnUpValue < 8 && Bivariate.neighborhood == 0) Bivariate.burnUp = burnUpValue;
    
        if(burnUpValue > 4 && Bivariate.neighborhood == 1){
            Bivariate.burnUp = 4;
            burnUp.val('4');
        }
        if(burnUpValue < 4 && Bivariate.neighborhood == 1) Bivariate.burnUp = burnUpValue;
    });

    $('#saveTo').on('change', () =>{
        let saveTo = $('#saveTo');
        let saveToValue = saveTo.val();

        if(saveToValue > 8 && Bivariate.neighborhood == 0){
            Bivariate.saveTo = 8;
            saveTo.val('8');
        }
        if(saveToValue < 8 && Bivariate.neighborhood == 0) Bivariate.saveTo = saveToValue;
    
        if(saveToValue > 4 && Bivariate.neighborhood == 1){
            Bivariate.saveTo = 4;
            saveTo.val('4');
        }
        if(saveToValue < 4 && Bivariate.neighborhood == 1) Bivariate.saveTo = saveToValue;
    });

    $('#saveUp').on('change', () =>{
        let saveUp = $('#saveUp');
        let saveUpValue = saveUp.val();

        if(saveUpValue > 8 && Bivariate.neighborhood == 0){
            Bivariate.saveUp = 8;
            saveUp.val('8');
        }
        if(saveUpValue < 8 && Bivariate.neighborhood == 0) Bivariate.saveUp = saveUpValue;
    
        if(saveUpValue > 4 && Bivariate.neighborhood == 1){
            Bivariate.saveUp = 4;
            saveUp.val('4');
        }
        if(saveUpValue < 4 && Bivariate.neighborhood == 1) Bivariate.saveUp = saveUpValue;
    });

    //Смена окружения
    $('#okrSelect').on('change', () =>{
        if($('#okrSelect').val() == 0){
            Bivariate.neighborhood = 0;
            $('#burnTo').attr('max', 8);
            $('#burnUp').attr('max', 8);
            $('#saveTo').attr('max', 8);
            $('#saveUp').attr('max', 8);
            $('#presset').css('pointerEvents', 'auto');
            $('#presset').css('opacity', '1');


        }else{
            Bivariate.neighborhood = 1;
            $('#burnTo').attr('max', 4);
            $('#burnUp').attr('max', 4);
            $('#saveTo').attr('max', 4);
            $('#saveUp').attr('max', 4);
            $('#presset').css('pointerEvents', 'none');
            $('#presset').css('opacity', '0.5');
        }

    });

    //Прессеты правил игры
    $('#presset').on('change', () =>{
        switch($('#presset').val()){
            case "1": Bivariate.PressetChange(3, 3, 2, 3); burnTo.value = 3; burnUp.value = 3; saveTo.value = 2; saveUp.value = 3;  break;
            case "2": Bivariate.PressetChange(3, 3, 0, 8); burnTo.value = 3; burnUp.value = 3; saveTo.value = 0; saveUp.value = 8; break;
            case "3": Bivariate.PressetChange(5, 8, 4, 8); burnTo.value = 5; burnUp.value = 8; saveTo.value = 4; saveUp.value = 8; break;
            case "4": Bivariate.PressetChange(1, 1, 0, 8); burnTo.value = 1; burnUp.value = 1; saveTo.value = 0; saveUp.value = 8; break;
            case "5": Bivariate.PressetChange(2, 2, 2, 5); burnTo.value = 2; burnUp.value = 2; saveTo.value = 2; saveUp.value = 5; break;
        }
    });

    //Скорость игры
    $('#speedSelect').on('change', () =>{
        stepInMs = Number($('#speedSelect').val());
    });

    //Цвет
    $('#colorBody').on('input', ()=>{
        $('#body').css('backgroundColor', $('#colorBody').val())
    });
    
    $('#color').on('input', ()=>{ 
        let Color = toRGB($('#color').val());
            colorRGB[0][0] = (1/255) * Color[0];
            colorRGB[0][1] = (1/255) * Color[1];
            colorRGB[0][2] = (1/255) * Color[2];
            if(gameStop)requestAnimationFrame(printRequstMap)
    });
    
    $('#colorCellOne').on('input', ()=>{
        let Color = toRGB($('#colorCellOne').val());
            colorRGB[3][0] = (1/255) * Color[0];
            colorRGB[3][1] = (1/255) * Color[1];
            colorRGB[3][2] = (1/255) * Color[2];
            if(gameStop)requestAnimationFrame(printRequstMap);
    });
    
    $('#colorCellTwo').on("input", () =>{
        let Color = toRGB($('#colorCellTwo').val());
        colorRGB[2][0] = (1/255) * Color[0];
        colorRGB[2][1] = (1/255) * Color[1];
        colorRGB[2][2] = (1/255) * Color[2];
        if(gameStop)requestAnimationFrame(printRequstMap);
    });
    
    $('#colorCellThree').on('input', () =>{
        let Color = toRGB($('#colorCellThree').val());
        colorRGB[1][0] = (1/255) * Color[0];
        colorRGB[1][1] = (1/255) * Color[1];
        colorRGB[1][2] = (1/255) * Color[2];
        requestAnimationFrame(printRequstMap);
    });

    //Нажатие кнопки старт
    $('#start').on('click', () =>{
        startGameButton();
    });

    //Нажатие кнопки стоп
    $('#stop').on('click', () =>{
        if(startGame) restartGame();
    });

    //Нажатие кнопки очистка
    $('#clear').on('click', () =>{
        clearMap();
    });

    //изменения масштаба
    $('#resolution').on('input', () =>{
        resolution = Number($('#resolution').val());
        restartGame();
        requestAnimationFrame(printRequstMap);
    });

    //Изменение режима кисти на телефоне
    $('#brushes__btn').on('click', () =>{
        modeBrushes = modeBrushes ? false : true;

        if(modeBrushes){ 
            $('#brushes__btn').css('border', '2.5px solid #2ff156');
            $('#brushes__btn').html('Рисование');
        }else{
            $('#brushes__btn').css('border', '2.5px solid #dce442');
            $('#brushes__btn').html('Стирание');
        }
    });

    //Режим шаг
    $('#checkboxStep').on('change', () =>{
        modeStepGame = $('#checkboxStep').is(':checked');
        if(modeStepGame){
            $('#start').html('Шаг');
            $('#start').css('backgroundColor', '#d11544');
            cancelAnimationFrame(requestFrameId);
            gameStop = true;
        }else{
            $('#start').html('Стоп');
            $('#start').css('backgroundColor', '#ffffff');
            requestFrameId = requestAnimationFrame(gameStep);
            gameStop = false;
        }
    });

    //Рекция белоусова
    $('#reactBel').on('click', () =>{
        Bivariate.ReactBelMode = $('#reactBel').is(':checked');

        if(Bivariate.ReactBelMode){
            restartGame();
            $('.color__txt').css('display', 'none');
            $('#showSetings').css('display', 'none');
            $('#reactBelSetings').css('display', 'block');
            $('#setings2').css('display', 'none');

        }else{
            restartGame();
            $('.color__txt').css('display', 'block');
            $('#showSetings').css('display', 'block');
            $('#reactBelSetings').css('display', 'none');
            $('#setings2').css('display', 'block');
        }
    });

    //Нажатие на canvas
    $('#canvas').on('click', (event) =>{
        if(TwoGame !== undefined) canvasClick(event.clientX, event.clientY);
    });

     //Событие нажатие клавиши на canvas
     $('#canvas').on('mousedown', () =>{
        draw = true;
    });
    
    //Событие отпускания клавиши на canvas
    $('#canvas').on('mouseup', () =>{
        draw = false;
    });

    //Движение мыши на canvas
    $('#canvas').on('mousemove', (event) =>{
        if(draw && WIDHT >= 400) {
            canvasClick(event.clientX, event.clientY);
        }
    });

    //Движение пальца по телефону
   
    $('#canvas').on('touchmove', (event) =>{
        if(TwoGame !== undefined)canvasClick(event.touches[0].clientX, event.touches[0].clientY);   
    });

});

//Конвертер #000000 в rgb
function toRGB(hex) {      
    return  hex.match(/[^#]./g).map(ff => parseInt(ff, 16));
}