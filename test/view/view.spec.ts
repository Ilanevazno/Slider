import {expect} from "chai";
import { View } from "../../src/MVC/view";
import { Model } from '../../src/MVC/model';
import { ObserverInterface } from '../../src/components/observer';
import $ from 'jquery';
import { Controller } from "../../src/MVC/controller";
import { SettingsPanel } from '../../src/components/panel'
const assert = require('assert');

namespace viewTest {
    const containerForSlider: any = document.createElement("div");
    document.body.appendChild(containerForSlider);
    containerForSlider.classList.add("example-slider")

    const observer = new ObserverInterface.Observer;
    const model = new Model(observer);
    const view = new View(model);
    const slider = new Controller(model, view, observer);
    const panel = new SettingsPanel.Panel;

    describe("slider render test", () => {
        view.sliderBodyExemplar.renderSliderBody('horizontal', 'slider__body', containerForSlider);
    
        it ("generate slider body", () => {
            //expecting avialability sliderBody;
            assert.equal($(containerForSlider).find('.slider__body').length, 1);
        })
    
        describe("pointer render test", () => {
            let pointerList = view.pointer.generatePointer(view.sliderBodyExemplar.body[0], 'slider__pointer', 1);
            it ("generate pointer for slider", () => {
                assert.notEqual(pointerList.length, 0);
            })
    
            pointerList = view.pointer.generatePointer(view.sliderBodyExemplar.body[0], 'slider__pointer', 2);
            it('another one generate some pointers for slider', () => {
                assert.equal(pointerList.length, 2);
            })
            
            // and now we can remove pointers
    
            view.pointer.destroyPointers();
            it('old pointers will destroy', () => {
                // getting pointers length from pointer Class method
                assert.equal(view.pointer.getPointerList().length, 0);
            })
        })
    
        describe("test settings panel module", () => {
            panel.renderSettingsPanel(containerForSlider);
    
            it('rendering settings panel', () => {
                assert.equal($(containerForSlider).find(".slider_settings").length, 1)
            })
    
            const testingObj = {
                mounted () {
    
                },
    
                destroy () {
    
                },
                
                text: 'some text...'
            }
            panel.getCheckBox(testingObj);
    
            it("get random checkbox", () => {
                assert.equal($(containerForSlider).find(".slider_settings").find('input[type="checkbox"]').length, 1);
            })
    
            panel.getInput(testingObj);
    
            it("get random input", () => {
                assert.equal($(containerForSlider).find(".slider_settings").find('input[type="text"]').length, 1);
            })
    
            panel.getRadio(testingObj);
    
            it("get random radio button", () => {
                assert.equal($(containerForSlider).find(".slider_settings").find('input[type="text"]').length, 1);
            })
    
            //it work but... :D 
            // view.settingsPanel.destroyPanel();
    
            // it("destroying settings panel", () => {
            //     assert.equal($(containerForSlider).find(".slider_settings").length, 0);
            // })
        })
    
        it ("and now we will destroy slider body", () => {
            view.sliderBodyExemplar.destroy();
            assert.equal($(containerForSlider).find('.slider__body').length, 0);
        })
    })   
}