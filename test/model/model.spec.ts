/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import $ from 'jquery';
import View from '../../src/plugin/components/MVC/View';
import Model from '../../src/plugin/components/MVC/Model';
import { ObserverInterface } from '../../src/plugin/components/Observer/Observer';
import Controller from '../../src/plugin/components/MVC/Controller';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace modelTest {
  const containerForSlider = document.createElement('div');

  document.body.appendChild(containerForSlider);
  containerForSlider.classList.add('example-slider');

  const observer = new ObserverInterface.Observer();
  const model = new Model(observer);
  const view = new View(model);
  const controller = new Controller(model, view, observer);

  describe('settings slider type test', () => {
    it('will getting 1 pointer for single value type', () => {
      expect(model.getPointerCount('singleValue')).to.be.equal(1);
    });
    it('will getting 2 pointers for double value type', () => {
      expect(model.getPointerCount('doubleValue')).to.be.equal(2);
    });
  });

  describe('init state', () => {
    controller.setViewType('horizontal');
    controller.setStepSize(1);
    controller.setSliderType('singleValue');
    controller.generateSlider($(containerForSlider));

    const sliderParams = 470;
    const imitationState = model.initState({
      sliderViewType: 'horizontal',
      sliderWidth: sliderParams,
      pointerList: controller.view.pointerList,
    });

    it('state will be initialized', () => {
      imitationState.map((stateItem) => {
        expect(stateItem).to.have.all.keys('pointerName', 'pointerItem', 'pointerValue');
        return stateItem;
      });
    });
  });

  describe('collsion method test', () => {
    const imitationArgument = [
      { pointerValue: 1 },
      { pointerValue: 20 },
    ];

    it('will return false because first value > than second value', () => {
      imitationArgument[0].pointerValue = 10;
      expect(model.checkCollision(imitationArgument)).to.be.false;
    });

    it('but if first value be more then this method will return true', () => {
      imitationArgument[0].pointerValue = 30;
      expect(model.checkCollision(imitationArgument)).to.be.true;
    });
  });

  describe('checking slider area', () => {
    it('will return max slider value (100)', () => {
      expect(model.checkSliderArea(333, 100)).to.be.equal(100);
    });

    it('will return min slider value (0)', () => {
      expect(model.checkSliderArea(-233, 100)).to.be.equal(0);
    });

    it('will return first argument value', () => {
      expect(model.checkSliderArea(63, 100)).to.be.equal(63);
    });
  });

  describe('testing math methods getting active percent', () => {
    it('try to get 25%', () => {
      expect(model.getValuePercent(400, 100)).to.be.equal(25);
    });

    it('try to get 50%', () => {
      expect(model.getValuePercent(400, 200)).to.be.equal(50);
    });

    it('try to get 100%', () => {
      expect(model.getValuePercent(400, 400)).to.be.equal(100);
    });
  });

  describe('testing math methods, this should convert % to px', () => {
    it('try to get 100px', () => {
      expect(model.PercentToPx(400, 25)).to.be.equal(100);
    });

    it('try to get 200px', () => {
      expect(model.PercentToPx(400, 50)).to.be.equal(200);
    });

    it('try to get 400px', () => {
      expect(model.PercentToPx(400, 100)).to.be.equal(400);
    });
  });
}

export default {
  modelTest,
};
