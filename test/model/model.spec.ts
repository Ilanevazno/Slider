import {expect} from "chai";
import { View } from "../../src/MVC/view";
import { Model } from '../../src/MVC/model';
import { ObserverInterface } from '../../src/components/observer';
import $ from 'jquery';
import { Controller } from "../../src/MVC/controller";
const assert = require('assert');

namespace modelTest {
    let containerForSlider = document.createElement("div");

    document.body.appendChild(containerForSlider);
    containerForSlider.classList.add("example-slider")
    
    const observer = new ObserverInterface.Observer;
    let model = new Model(observer);
    let view = new View(model);
    let controller = new Controller(model, view, observer);
    
    describe("settings slider type test", () => {
    
    })
}