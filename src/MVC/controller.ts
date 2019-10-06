import { Model } from './model'; 
import { View } from './view';

export class Controller{
    view = new View;
    model = new Model;

    constructor(){
        this.view.sliderStart();
    }
}