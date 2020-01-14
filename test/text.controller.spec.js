import {expect} from "chai";
import { View } from "../src/MVC/view";
import { Model } from '../src/MVC/model';
import { ObserverInterface } from '../src/components/observer';
import $ from 'jquery';
import { Controller } from "../src/MVC/controller";

let containerForSlider = document.createElement("div");

document.body.appendChild(containerForSlider);
containerForSlider.classList.add("example-slider")

const observer = new ObserverInterface.Observer;
let model = new Model(observer);
let view = new View(model);
let slider = new Controller(model, view, observer);

describe("settings slider type test", () => {
    it ("trying generate horizontal slider", () => {
        slider.setViewType('horizontal');
        assert(slider.view.viewType === 'horizontal');
    })

    it ('now we will try to generate vertical view slider', () => {
        slider.setViewType('vertical');
        assert(slider.view.viewType === 'vertical');
    })
})