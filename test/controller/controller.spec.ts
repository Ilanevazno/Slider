import { expect } from 'chai';
import $ from 'jquery';
import View from '../../src/plugin/components/MVC/View';
import Model from '../../src/plugin/components/MVC/Model';
import { ObserverInterface } from '../../src/plugin/components/Observer/Observer';
import Controller from '../../src/plugin/components/MVC/Controller';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace controllerTest {
  const containerForSlider: any = document.createElement('div');

  document.body.appendChild(containerForSlider);
  containerForSlider.classList.add('example-slider');

  const observer = new ObserverInterface.Observer();
  const model = new Model(observer);
  const view = new View(model);
  const controller = new Controller(model, view, observer);

  $(containerForSlider).css({
    width: '900px',
  });

  describe('generating slider', () => {
    controller.setViewType('horizontal');

    it('trying generate horizontal slider', () => {
      expect(controller.view.viewType).to.have.string('horizontal');
    });

    controller.setStepSize(1);

    it('step size is 1', () => {
      controller.setStepSize(5);
      expect(controller.model.pointerStepSize).to.equal(5);
    });

    controller.setSliderType('doubleValue');

    it('slider type to be an double value', () => {
      expect(controller.sliderType).to.have.string('doubleValue');
    });

    controller.generateSlider($(containerForSlider)[0]);


    describe('generated slider', () => {
      it('fully prepared slider will be in page', () => {
        expect($(controller.view.sliderBodyHtml)).to.have.lengthOf(1);
        expect(controller.view.pointerList).to.have.lengthOf(2);
      });

      it('should have state', () => {
        const testingState = controller.model.getState();
        testingState.map((stateItem) => {
          expect(stateItem).to.have.all.keys('pointerName', 'pointerItem', 'pointerValue');
          return testingState;
        });
      });
    });

    describe('checking step size method', () => {
      const getBreakPoints = () => {
        const result: number[] = [];
        let from = Number(controller.model.valueFrom);

        while (from <= controller.model.valueTo) {
          result.push(Math.floor(from));
          from += Number(controller.model.pointerStepSize);
        }
        return result;
      };

      it('emit checkStep method', () => {
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
      });
    });
    describe('use move method', () => {
      controller.targetedPointer = controller.view.pointerList[0].sliderPointer;
      // test move targeted pointer 5 times
      for (let i = 0; i <= 500; i += 100) {
        const movingData = {
          direction: 'left',
          currentPointer: 0,
          expression: i,
        };

        controller.moveCurrentPointer(movingData);
        expect(controller.targetedPointer[0].style.left).to.have.string(`${i}px`);
      }
    });

    describe('init settings method from controller', () => {
      controller.initSettings(true);
      expect($(controller.sliderExemplar).find('.slider_settings').length).to.equal(1);
    });
  });
}

export default {
  controllerTest,
};
