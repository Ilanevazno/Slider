import HandlerView from '../src/plugin/components/View/HandlerView/HandlerView';
import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import { ValueType, AvailableOptions } from '../src/plugin/components/types/types';

const mockModelOptions: AvailableOptions = {
  stepSize: 1,
  minAvailableValue: 1,
  maxAvailableValue: 100,
  minCurrentValue: 30,
  maxCurrentValue: 70,
  axis: 'X',
  withLabels: false,
  withTooltip: true,
  valueType: ValueType.SINGLE,
};

const dummyHtmlElement = document.createElement('div');
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

const model = new Model(mockModelOptions);
const mainView = new MainView(model, dummyHtmlElement);
const handlerView = new HandlerView(mainView);

describe('Проверка класса HandlerView', () => {
  it('Произошла инициализация класса', () => {
    expect(handlerView).toBeDefined();
    expect(handlerView).toBeInstanceOf(HandlerView);
  });

  describe('Проверяем методы класса', () => {
    const mockHandlerWidth = 200;
    handlerView.$handler.css('width', `${mockHandlerWidth}px`);

    it(`Получение ширины handler'a, она должна быть ${mockHandlerWidth}`, () => {
      spyOn(handlerView, 'getWidth').and.callThrough();

      const handlerWidth = handlerView.getWidth();

      expect(handlerWidth).toBe(mockHandlerWidth);
      expect(handlerView.getWidth).toBeCalled();
    });

    describe('move handler', () => {
      const dataForMoving = {
        minPercent: mockModelOptions.minAvailableValue,
        maxPercent: mockModelOptions.maxAvailableValue,
        currentValue: 50,
        maxContainerSize: 800,
      };

      it('new handler position not equal previous', () => {
        const oldPosition = handlerView.$handler.css('left');

        expect(handlerView.$handler.css('left')).toEqual(oldPosition);

        handlerView.move(dataForMoving);

        expect(handlerView.$handler.css('left')).not.toEqual(oldPosition);
      });
    });

    describe('tooltip availability', () => {
      it('enable and disable', () => {
        expect(handlerView.$handler.find('.slider__tooltip').length).toEqual(0);
        handlerView.setTooltipAvailability(true);
        expect(handlerView.$handler.find('.slider__tooltip').length).toEqual(1);
        handlerView.setTooltipAvailability(false);
        expect(handlerView.$handler.find('.slider__tooltip').length).toEqual(0);
      });
    });

    describe('tooltip value', () => {
      it('set new value', () => {
        handlerView.setTooltipAvailability(true);

        [1, 10, 15, 30, 47, 77, 90, 100].forEach((number) => {
          expect(Number(handlerView.$handler.find('.slider__tooltip').text())).not.toEqual(number);

          handlerView.setTooltipValue(number);

          expect(Number(handlerView.$handler.find('.slider__tooltip').text())).toEqual(number);
        });
      });
    });

    describe('тестируем эвенты', () => {
      let subscribeSpy;
      let broadcastSpy;

      beforeEach(() => {
        subscribeSpy = spyOn(handlerView.observer, 'subscribe').and.callThrough;
        broadcastSpy = spyOn(handlerView.observer, 'broadcast');
      });

      it('mousedown event', () => {
        const mousedown = $.Event('mousedown');
        mousedown.clientX = 800;

        handlerView.$handler.trigger(mousedown);

        expect(handlerView.observer.broadcast).toBeCalledWith({ type: 'HANDLER_MOUSEDOWN', data: mousedown });
      });

      it('mousemove event', () => {
        const mousemove = $.Event('mousemove');
        mousemove.clientX = 800;

        $(document).trigger('mousemove');
      });

      it('mouseup event', () => {
        $(document).trigger('mouseup');
      });
    });
  });
});
