$(document).ready(function(e){
    loadSettingsPanel();

    function loadSettingsPanel(){
        let settingsPanel = $('<div/>', {
            class: 'slider_settings'
        }).appendTo('.slider-wrapper');

        let stepSize = $('<input/>', {
            class: 'step_size',
            placeholder: 'Размер шага'
        }).appendTo(settingsPanel);

        let setValue = $('<input/>', {
            class: 'set_size',
            placeholder: 'Установить значение'
        }).appendTo(settingsPanel)

        let showToggle = $('<label/>', {
            for: 'Enable_actValue',
            text: 'Показывать бегунок'
        }).appendTo(settingsPanel)

        let toggle = $('<input/>', {
            type: 'checkbox',
            id: 'Enable_actValue'
        }).appendTo(showToggle)

        toggle.click(function(){
            if(toggle.prop("checked")){
                GetValueIndicator();
            } else {
                removeValueIndicator();
            }
        })
    }
    
    let slider = $('.slider');
    let toggler = slider.children();
    let sliderWidth = slider[0].offsetWidth - toggler[0].offsetWidth;

    function GetValueIndicator(){
        indicatorElem = $('<div/>', {
            class: 'slider_value',
            text: '0'
        });
        toggler.append(indicatorElem);
    }

    function removeValueIndicator(){
        (indicatorElem).remove();
    }

    function getSliderValue(indicatorElem)
    {
        let sliderValue = Math.round((toggler[0].offsetLeft * 100) / sliderWidth);
        indicatorElem[0].innerText = sliderValue;
    }

    toggler.on('mousedown', function(e)
    {
        prepareToggler();
        let thumbCoords = getCoords(toggler);
        let shiftX = Math.floor(e.pageX - thumbCoords.left);
        let sliderCoords = getCoords(slider);

        function prepareToggler()
        {
            thumbCoords;
            let startPos = thumbCoords + '%';

            toggler.css(
                {
                    "position": "absolute",
                    "left": `${startPos}`
                }
            )
        }

        function getCoords(elem)
        {
            let box = elem[0].getBoundingClientRect();
            return {
                left: box.left + pageXOffset
            }
        }
        
        $(document).on('mousemove', function(e, newLeft)
        {
            getSliderValue(indicatorElem);
            newLeft = e.pageX - shiftX - sliderCoords.left;
            checkScope();
            toggler.css(
                {
                    "left": newLeft + "px"
                }
            )

            function checkScope(){
                (newLeft < 0) ? newLeft = 0 : newLeft;
                (newLeft > sliderWidth) ? newLeft = sliderWidth : newLeft;
            }
        });
    })
    $(document).on("mouseup", function(e)
    {
        $(document).off("mousemove");
    })
})