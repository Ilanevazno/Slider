import * as $ from "jquery";
import './mySlider.scss';
import './fonts/fonts.scss';
import { View } from "./MVC/view";
import { Controller } from './MVC/controller';

export namespace Slider {
    const $ = jQuery;
    let slider: JQuery<HTMLElement>;
    const horizontalType: string = 'horizontal';
    const verticalType: string = 'vertical';
    
    jQuery.fn.extend({
        createSlider: function(): void{
            let slider = new Controller();
            slider.setViewType(horizontalType);
            slider.generateSlider(this);
            slider.initSettings(this);
            slider.AccessToDragging();
        }
    })

    interface jQuery{
        createSlider(): void;
    }
}