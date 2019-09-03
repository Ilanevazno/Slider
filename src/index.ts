import * as $ from "jquery";

namespace Slider {
    interface jQuery{
        mySlider():jQuery;
    }

    let $ = jQuery;

    jQuery.fn.extend({
        createSlider: function(){
            console.log("asd");
        }
    })
}

let slider: any;

slider = $("#first_slider");
slider.createSlider();