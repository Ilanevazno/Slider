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
    const singleValue: string = 'singleValue';
    const doubleValue: string = 'doubleValue';
    let arbitraryAmount: number; 
    
    jQuery.fn.extend({
        createSlider: function(): void{
            let slider = new Controller();
            slider.initSettings(this);
            slider.setViewType(horizontalType, doubleValue);
            slider.generateSlider(this);
            slider.AccessToDragging();
        }
    })

    interface jQuery{
        createSlider(): void;
    }
}