import * as $ from "jquery";
namespace Slider {
    interface jQuery{
        mySlider():jQuery;
    }

    class Model{
        getCoords(elem: JQuery<HTMLElement>){
            let box = elem[0].getBoundingClientRect();
            return {
                left: box.left + pageXOffset
            }
        }
    }

    class View{
        sliderBody: JQuery<HTMLElement>;
        sliderPointer: JQuery<HTMLElement>;
        model = new Model;
        pointerCoords: object;

        sliderStart(){
            this.sliderBody = $('<div/>', {
                class: 'slider__body'
            }).appendTo(slider);
    
            this.sliderPointer = $('<span/>', {
                class: "slider__pointer"
            }).appendTo(this.sliderBody);

            this.pointerCoords = this.model.getCoords(this.sliderPointer);
        }

        getValueIndicator(){
            let valueIndicator = $('<span/>', {
                class: "slider__value"
            }).appendTo(this.sliderBody);
        }

        preparePointer(): void{
            let startPos = this.pointerCoords + "%";

            this.sliderPointer.css({
                "position": "absolute",
                "left": `${startPos}`,
            })
        }
    }

    class Controller{
        view = new View;
        model = new Model;

        constructor(){
            this.view.sliderStart();
        }
    }

    let $ = jQuery;

    jQuery.fn.extend({
        createSlider: function(){
            slider = new Controller;
        }
    })
}

let slider: any;

slider = $("#first_slider");
slider.createSlider();