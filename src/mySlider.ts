import * as $ from "jquery";
import './mySlider.scss';
import './fonts/fonts.scss';
import { View } from "./MVC/view";

export namespace Slider {
    let $ = jQuery;
    let slider: JQuery<HTMLElement>;
    
    jQuery.fn.extend({
        createSlider: function(): void{
            let slider = new View();
            slider.sliderStart(this);
        }
    })

    interface jQuery{
        createSlider(): void;
    }
}