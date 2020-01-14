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


describe("slider render test", () => {
    view.sliderBodyExemplar.renderSliderBody('horizontal', 'slider__body', containerForSlider);

    it ("generate slider body", () => {
        //expecting avialability sliderBody;
        assert.notEqual($(containerForSlider).find('.slider__body').length, 0);
    })

    describe("pointer render test", () => {
        it ("generate pointer for slider", () => {
            let pointerList = view.pointer.generatePointer(view.sliderBodyExemplar.body[0], 'slider__pointer', 1);
            assert.notEqual(pointerList, 0);
        })

        it('another one generate some pointers for slider', () => {
            let pointerList = view.pointer.generatePointer(view.sliderBodyExemplar.body[0], 'slider__pointer', 2);
            assert.notEqual(pointerList, 1);
        })
    })

    describe("pointer-value test", () => {
        
    })

    it ("and now we will destroy slider body", () => {
        view.sliderBodyExemplar.destroy();
        assert.equal($(containerForSlider).find('.slider__body').length, 0);
    })
})