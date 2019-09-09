import * as $ from "jquery";
namespace Slider {
    interface jQuery{
        mySlider():jQuery;
    }

    class model{
        sliderBody: JQuery<HTMLElement>;
        sliderPointer: JQuery<HTMLElement>;
        
        sayHello(){
            console.log(this.sliderPointer[0]);
        }
    }

    class view extends model{
        model = new model;
        controller = new controller;

        sliderBody = $('<div/>', {
            class: 'slider__body'
        }).appendTo(slider);

        sliderPointer = $('<span/>', {
            class: "slider__pointer"
        }).appendTo(this.sliderBody);

        getValueIndicator(){
            let valueIndicator = $('<span/>', {
                class: "slider__value"
            }).appendTo(this.sliderBody);
        }
    }

    class controller extends model{

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
slider.sayHello();