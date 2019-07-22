$(document).ready(function(e){
    function loadSettingsPanel(){

    }
    
    let slider = $('.slider');
    let toggler = slider.children();
    let sliderWidth = slider[0].offsetWidth - toggler[0].offsetWidth;
    GetValueIndicator();

    function GetValueIndicator(){
        indicatorElem = $('<div/>', {
            class: 'slider_value',
            text: '0'
        });
        toggler.append(indicatorElem);
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