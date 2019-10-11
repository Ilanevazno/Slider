import * as $ from "jquery";
import './mySlider.scss';
import './fonts/fonts.scss';
import { View } from "./MVC/view";
import { Controller } from './MVC/controller';

export namespace Slider {
    let $ = jQuery;
    let slider: JQuery<HTMLElement>;
    
    jQuery.fn.extend({
        createSlider: function(): void{
            let slider = new Controller();
            slider.view.sliderStart(this);
            slider.view.getValueIndicator();

            slider.AccessToDragging();
        }
    })

    interface jQuery{
        createSlider(): void;
    }
}