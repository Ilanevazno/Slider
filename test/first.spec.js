import {expect} from "chai";
import { View } from "../src/MVC/view";
import $ from 'jquery';
import { Controller } from "../src/MVC/controller";

let containerForSlider = document.createElement("div");

document.body.appendChild(containerForSlider);
containerForSlider.classList.add("example-slider")

let testSlider = document.querySelector(".example-slider");

let slider = new View();

describe("Slider render test", () => {
    slider.sliderStart(testSlider);
    
    it("Rendering slider body", () =>{
        assert(testSlider.querySelector(".slider__body"));
    });
    it("Rendering slider pointer", () => {
        assert(testSlider.querySelector(".slider__pointer"));
    });

    describe("Getting value indicator", () => {
        slider.getValueIndicator();
        it("Rendering slider indicator after installing", () => {
            assert(testSlider.querySelector(".slider__value"));
        })
    })
})

let sliderController = new Controller();

describe("Testing controller", () => {
    sliderController.StartPointerMove();

    it("Method not returns undefined", () => {
        assert.isDefined(sliderController);
    });
})

describe("Added table with percentages", () => {
    sliderController.getPercentages();

    it("Renderings table with percentages", () => {
        assert(testSlider.querySelector(".slider__percenages"))
    })
})
