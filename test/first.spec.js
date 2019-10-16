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

    describe("Render settings panel", () => {
        slider.initSettings(testSlider);
        it("Render panel", () => {
            assert(testSlider.querySelector(".slider_settings"));
        });

        it("Render step size button", () => {
            assert(testSlider.querySelector(".step_size"));
        });

        it("Render setup value area", () => {
            assert(testSlider.querySelector(".setup_value"));
        });

        it("Render enable pointer button", () => {
            assert(testSlider.querySelector("#Enable_actValue"));
        });

        it("Render slider type area", () => {
            assert(testSlider.querySelector(".view_type"));
        });

        it("Render value type area", () => {
            assert(testSlider.querySelector(".value_type"));
        });

        it("Render apply values button", () => {
            assert(testSlider.querySelector(".apply_values"));
        });
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
    slider.getValueIndicator();

    it("Renderings table with percentages", () => {
        assert(testSlider.querySelector(".slider__value"))
    })
})
