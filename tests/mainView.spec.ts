import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import SliderBodyView from '../src/plugin/components/View/SliderBodyView/SliderBodyView';
import {
  AvailableOptions, ValueType, CustomEvents, ObserverEvent, ViewHandlerData,
} from '../src/plugin/components/types/types';

const mockModelOptions: AvailableOptions = {
  stepSize: 1,
  minAvailableValue: 1,
  maxAvailableValue: 100,
  minCurrentValue: 30,
  maxCurrentValue: 70,
  axis: 'X',
  withLabels: false,
  withTooltip: false,
  valueType: ValueType.SINGLE,
};

const dummyHtmlElement = document.createElement('div');
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

let model: Model;
let mainView: MainView;

jest.mock('../src/plugin/components/View/TooltipView/TooltipView');

describe('Тестирование класса MainView', () => {
  beforeEach(() => {
    model = new Model(mockModelOptions);
    mainView = new MainView(model, dummyHtmlElement);
  });

  it('Успешная инициализация', () => {
    expect(mainView).toBeDefined();
    expect(mainView).toBeInstanceOf(MainView);
  });

  describe('Проверка observer', () => {
    let broadcastSpy;

    beforeEach(() => {
      mainView.eventObserver.subscribe((data) => data);
      broadcastSpy = spyOn(mainView.eventObserver, 'broadcast');
    });

    it('Проверка эвента handler will mount', () => {
      const data = jest.fn((_) => ({
        type: CustomEvents.HANDLER_WILL_MOUNT,
        data: {
          name: 'minValue',
          value: 66,
        },
      }));

      mainView.eventObserver.broadcast(data);

      expect(mainView.eventObserver.broadcast).toBeCalledWith(data);
    });

    it('Эвент mousemove', () => {
      const data = {
        type: CustomEvents.HANDLER_MOUSEMOVE,
        data: {
          name: 'minValue',
          value: 50,
        },
      };
      mainView.minValueHandler.handler.observer.broadcast(data);

      expect(broadcastSpy).toBeCalledWith(data);
    });

    it('Рандомный эвент должен ничего не делать', () => {
      const data = {
        type: 'MOUSE_NOTHING',
        data: {
          name: 'minValue',
          value: 50,
        },
      };
      mainView.minValueHandler.handler.observer.broadcast(data);

      expect(broadcastSpy).toBeCalledTimes(0);
    });
  });


  describe('refreshView method', () => {
    it('sliderBody has been called', () => {
      const removingBodyMethod = spyOn(mainView.sliderBody, 'remove');

      mainView.refreshView();

      expect(removingBodyMethod).toBeCalled();
    });
  });

  describe('setBreakpointsAvailability method', () => {
    it('breakpoint availability changed', () => {
      spyOn(mainView.sliderBody, 'changeBreakpointsAvailability');

      mainView.setBreakpointsAvailability();

      expect(mainView.sliderBody.changeBreakpointsAvailability).toBeCalledWith(mockModelOptions.withLabels, {
        axis: mockModelOptions.axis,
        offsetHandlerWidth: mainView.minValueHandler.handler.getWidth(),
        currentBreakpointList: mainView.model.getOption<number[]>('breakpoints'),
        minAvailableValue: mockModelOptions.minAvailableValue,
        maxAvailableValue: mockModelOptions.maxAvailableValue,
      });
    });
  });

  describe('setTooltipAvailability method', () => {
    beforeEach(() => {
      spyOn(mainView.minValueHandler.handler, 'setTooltipAvailability');
    });

    it('enable handler', () => {
      mainView.setTooltipAvailability(true);

      expect(mainView.minValueHandler.handler.setTooltipAvailability).toBeCalledWith(true);
    });

    it('disable handler', () => {
      mainView.setTooltipAvailability(false);

      expect(mainView.minValueHandler.handler.setTooltipAvailability).toBeCalledWith(false);
    });
  });

  describe('now... we can try moving this dummy handler', () => {
    it('changed handler percent values', () => {
      [10, 30, 70, 99, 100].forEach((minValue) => {
        mainView.moveHandler({ minValue });

        expect(mainView.minValueHandler.handler.value).toBe(minValue);
      });
    });

    it('DOM moving handler checking', () => {
      [10, 30, 70, 99, 100].forEach((value) => {
        const oldHandlerPosition = mainView.minValueHandler.handler.$handler.css('left');

        mainView.minValueHandler.handler.move({
          currentValue: value,
          minPercent: mockModelOptions.minAvailableValue,
          maxPercent: mockModelOptions.maxAvailableValue,
          maxContainerSize: 800,
        });

        const newHandlerPosition = mainView.minValueHandler.handler.$handler.css('left');

        expect(oldHandlerPosition).not.toEqual(newHandlerPosition);
      });
    });
  });
});
