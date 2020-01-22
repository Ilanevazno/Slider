import {expect} from "chai";
import { View } from "../../src/MVC/view";
import { Model } from '../../src/MVC/model';
import { ObserverInterface } from '../../src/components/observer';
import $ from 'jquery';
import { Controller } from "../../src/MVC/controller";
const assert = require('assert');

namespace controllerTest {
    let containerForSlider: any = document.createElement("div");

    document.body.appendChild(containerForSlider);
    containerForSlider.classList.add("example-slider")
    
    const observer = new ObserverInterface.Observer;
    let model = new Model(observer);
    let view = new View(model);
    let controller = new Controller(model, view, observer);

    $(containerForSlider).css({
        "width": '900px'
    })
    
    describe ('generating slider', () => {
        controller.setViewType('horizontal');

        it ("trying generate horizontal slider", () => {
            expect(controller.view.viewType).to.have.string('horizontal');
        })

        controller.setStepSize(1);
        
        it ('step size is 1', () => {
            controller.setStepSize(5);
            expect(controller.model.pointerStepSize).to.equal(5)
        })

        controller.setSliderType('doubleValue')

        it ("slider type to be an double value", () => {
            expect(controller.sliderType).to.have.string('doubleValue')
        })

        controller.generateSlider($(containerForSlider)[0])

    
        describe('generated slider', () => {
            it("fully prepared slider will be in page", () => {
                expect($(controller.view.sliderBodyHtml)).to.have.lengthOf(1)
                expect(controller.view.pointerList).to.have.lengthOf(2)
            })
        
            it ('should have state', () => {
                const testingState = controller.model.getState();
                testingState.map(stateItem => {
                    expect(stateItem).to.have.all.keys('pointerName', 'pointerItem', 'pointerValue');
                })
            })
        })

        describe('checking step size method', () => {
            const getBreakPoints = () => {
                const result = [];
                let from = Number(controller.model.valueFrom);
                
                while(from <= controller.model.valueTo) {
                    result.push(Math.floor(from));
                    from = from + Number(controller.model.pointerStepSize);
    
                }
                return result;
            }

            it ('emit checkStep method', () => {
                controller.model.setStepSize(10);
                expect(getBreakPoints()).to.include.members([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
                controller.model.setStepSize(50);
                expect(getBreakPoints()).to.include.members([0, 50, 100]);
                controller.model.setStepSize(25);
                expect(getBreakPoints()).to.include.members([0, 25, 50, 75, 100]);
                // we can use 'string' values cuz anyway we use 'Number'
                controller.model.setStepSize('33');
                expect(getBreakPoints()).to.include.members([0, 33, 66, 99]);
                // use string but not a number
                controller.model.setStepSize('test word');
                expect(getBreakPoints()).to.include.members([0]);
            })
        })
        describe ('use move method', () => {
            controller.targetedPointer = controller.view.pointerList[0].sliderPointer;
            //test move targeted pointer 5 times
            for (let i = 0; i <= 500; i = i + 100) {
                controller.moveCurrentPointer('left', 0, i);
                expect(controller.targetedPointer[0].style.left).to.have.string(`${i}px`);
            }
        })

        describe ('init settings method from controller', () => {
            controller.initSettings(true);
            expect($(controller.sliderExemplar).find('.slider_settings').length).to.equal(1);
        })
    })
}