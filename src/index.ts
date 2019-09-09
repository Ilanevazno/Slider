import * as $ from "jquery";
import "./index.scss";

namespace Slider {
    interface jQuery{
        mySlider():jQuery;
    }

    class model {
        slider = slider;
    }

    class view {
        constructor(){
            let sliderBody = $('<div/>', {
                class: 'slider__body'
            }).appendTo(slider);

            let sliderPointer = $('<span/>', {
                class: "slider__pointer"
            }).appendTo(sliderBody);

            let sliderValue = $('<span/>', {
                class: "slider__value"
            }).appendTo(sliderBody);
        }
    }

    class controller {

    }

    let $ = jQuery;

    jQuery.fn.extend({
        createSlider: function(){
            slider = new view;
        }
    })
}

let slider: any;

slider = $("#first_slider");
slider.createSlider();