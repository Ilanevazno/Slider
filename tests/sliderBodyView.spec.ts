import SliderBodyView from '../src/plugin/components/View/SliderBodyView/SliderBodyView';
import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import HandlerView from '../src/plugin/components/View/HandlerView/HandlerView';
import {
  AvailableOptions, ValueType, CustomEvents, ObserverEvent, InteractiveComponentEvent, UnconvertedStateItem,
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

let model = new Model(mockModelOptions);
let mainView = new MainView(model, dummyHtmlElement);

// mainView.minValueHandler = {
//   name: 'minValue',
//   handler: new HandlerView(mainView),
// };

// this.initHandlerEvents(this.minValueHandler);

mainView.sliderBody.remove();

let sliderBody = new SliderBodyView(mainView);

describe('Проверка класса SliderBodyView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(sliderBody).toBeDefined();
    expect(sliderBody).toBeInstanceOf(SliderBodyView);
  });

  describe('getting params (width or height)', () => {
    it('should return 500 width', () => {
      sliderBody.$sliderBody.width('500px');

      expect(sliderBody.getSliderBodyParams()).toEqual(500);
    });

    it('should return 666 height', () => {
      model = new Model({ ...mockModelOptions, axis: 'Y' });
      mainView = new MainView(model, dummyHtmlElement);
      sliderBody = new SliderBodyView(mainView);

      sliderBody.$sliderBody.height('666px');

      expect(sliderBody.getSliderBodyParams()).toEqual(666);
    });
  });

  describe('find closest array value', () => {
    it('should return closest value', () => {
      const array = [10, 30, 66, 75, 100];

      expect(sliderBody.findTheClosestArrayValue(array, 50)).toEqual(66);
      expect(sliderBody.findTheClosestArrayValue(array, 37)).toEqual(30);
      expect(sliderBody.findTheClosestArrayValue(array, 85)).toEqual(75);
      expect(sliderBody.findTheClosestArrayValue(array, 3)).toEqual(10);
      expect(sliderBody.findTheClosestArrayValue(array, 24)).toEqual(30);
    });
  });

  describe('change breakpoints activity', () => {
    const mockedBreakpoints = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
    it('test breakpoints activity', () => {
      const BodyBreakpointsData = {
        axis: mockModelOptions.axis,
        offsetHandlerWidth: 25,
        currentBreakpointList: mockedBreakpoints,
        minAvailableValue: mockModelOptions.minAvailableValue,
        maxAvailableValue: mockModelOptions.maxAvailableValue,
      };

      sliderBody.changeBreakpointsAvailability(true, BodyBreakpointsData);

      expect($(dummyHtmlElement).find('.slider__breakpoint').length).toEqual(mockedBreakpoints.length);

      sliderBody.changeBreakpointsAvailability(false, BodyBreakpointsData);

      expect($(dummyHtmlElement).find('.slider__breakpoint').length).toEqual(0);
    });
  });

  describe('DOM events', () => {
    it('window resize event', () => {
      sliderBody.eventObserver.subscribe((data: ObserverEvent<InteractiveComponentEvent>) => data);
      spyOn(sliderBody.eventObserver, 'broadcast');

      const resize = $.Event('resize');

      $(window).trigger(resize);

      expect(sliderBody.eventObserver.broadcast).toBeCalledWith({ type: CustomEvents.WINDOW_RESIZED });
    });

    it('body click area was clicked', () => {
      const click = $.Event('click');
      click.offsetX = 700;
      let clickCounter = 0;

      sliderBody.$sliderBody.find('.slider__click-area').on('click', () => {
        clickCounter += 1;
      });

      sliderBody.$sliderBody.find('.slider__click-area').trigger(click);

      expect(clickCounter).toBe(1);

      sliderBody.$sliderBody.find('.slider__click-area').trigger(click);

      sliderBody.$sliderBody.find('.slider__click-area').trigger(click);

      expect(clickCounter).toBe(3);
    });
  });


  describe('observer events', () => {
    let broadcastSpy;

    beforeEach(() => {
      mainView.eventObserver.subscribe((data: ObserverEvent<UnconvertedStateItem>) => data);
      broadcastSpy = spyOn(mainView.eventObserver, 'broadcast');
    });

    it('body clicked event', () => {
      const data = {
        type: CustomEvents.BODY_CLICKED,
        data: { oldValue: 10, newValue: 50 },
      };

      mainView.eventObserver.broadcast(data);

      expect(mainView.eventObserver.broadcast).toBeCalledWith(data);
    });
  });

  describe('getting range values', () => {
    it('should return minValue as 50', () => {
      mainView.minValueHandler.handler.value = 50;

      expect(sliderBody.getRangeValues()[0]).toBe(50);
    });
  });

  describe('test calling range view', () => {
    it('0 elements length before init', () => {
      expect(sliderBody.$sliderBody.find('.slider__range').length).toBe(0);
    });

    it('1 elem length after init', () => {
      sliderBody.getRangeView();
      expect(sliderBody.$sliderBody.find('.slider__range').length).toBe(1);
    });

    it('updating range view', () => {
      sliderBody.getRangeView();
      sliderBody.updateRange();
    });
  });
});
