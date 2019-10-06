import * as $ from "jquery";
import './mySlider.scss';
import './fonts/fonts.scss';
import { Controller } from './MVC/controller';

export namespace Slider {
    let $ = jQuery;
    
    jQuery.fn.extend({
        createSlider: function(){
            const slider = new Controller;
        }
    })

    interface jQuery{
        createSlider(): void;
    }
}