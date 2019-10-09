import { Model } from './model'; 
import { View } from './view';

export class Controller{
    model = new Model;
    view = new View;

    constructor() {
        
    }

    AccessToDragging() {
        this.view.sliderPointer.on("mousedown", () => {
            console.log('ok');
        });
    }
}