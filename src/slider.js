(function($){
    jQuery.fn.newSlider = function(options){
        let slider = this;
        class model {

        }

        class view {
            constructor(){
                let sliderBody = $('<div/>', {
                    class: 'slider__body'
                }).appendTo(slider);

                let sliderPointer = $('<span/>', {
                    class: "slider__pointer"
                }).appendTo(sliderBody)

                let sliderValue = $('<span/>', {
                    class: "slider__value"
                }).appendTo(sliderBody)
            }
        }

        class controller {

        }
        slider = new view();
    }
})(jQuery)

$(document).ready(function(){
    $('#first_slider').newSlider();
})
