import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import { availableOptions, ValueType, Axis } from '../src/plugin/components/types/types';

const mockModelOptions: availableOptions = {
  stepSize: 1,
  minValue: 1,
  maxValue: 100,
  minValueCurrent: 30,
  maxValueCurrent: 70,
  axis: 'X' as unknown as Axis,
  withLabels: false,
  withTooltip: false,
  valueType: 'single' as unknown as ValueType,
};

const dummyHtmlElement = document.createElement('div');
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

const model = new Model(mockModelOptions);
const view = new MainView(model, dummyHtmlElement);

describe('Тестирование класса MainView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(view).toBeDefined();
    expect(view).toBeInstanceOf(MainView);
  });

  it('Произошла инициализация класса Model', () => {
    expect(model).toBeDefined();
    expect(model).toBeInstanceOf(Model);
  });

  describe('Проверяем обновление визуального состояния', () => {
    it('Обновить визуальное состояние', () => {
      spyOn(view, 'refreshView').and.callThrough();

      view.eventObserver.subscribe((event) => {
        const refreshStateEvents = ['CLEAR_STATE', 'REFRESH_STATE'];
        expect(typeof event).toBe('object');
        expect(refreshStateEvents).toContain(event.type);
      });

      view.refreshView();

      expect(view.refreshView).toHaveBeenCalled();
    });

    it('Обновляем необходимость рендера брейкпоинтов', () => {
      spyOn(view, 'changeBreakpointsActivity');
      view.changeBreakpointsActivity();
      expect(view.changeBreakpointsActivity).toHaveBeenCalled();
    });

    it('Смена направления слайдера на указанное значение', () => {
      spyOn(view, 'changeSliderBodyAxis').and.callThrough();

      const currentAxis: Axis = 'Y' as unknown as Axis;
      const newSliderBodyAxis = view.changeSliderBodyAxis(currentAxis);

      expect(view.changeSliderBodyAxis).toHaveBeenCalledWith(currentAxis);
    });
  });

  describe('Попытка смены положения хандлера, метод prepareToMoveHandler', () => {
    it('Вызываем метод', () => {
      spyOn(view, 'prepareToMoveHandler').and.callThrough();
      const currentState = [];

      const currentHandler = {
        $handler: view.minValueHandler.handler.$html,
        name: view.minValueHandler.name,
        value: 50,
      };

      currentState[0] = currentHandler;

      view.prepareToMoveHandler(currentState);
      expect(view.prepareToMoveHandler).toHaveBeenCalledWith(currentState);
    });
  });

  describe('Попытка включить tooltip', () => {
    it('Вызываем метод смены состояния tooltip', () => {
      spyOn(view, 'setTooltipActivity').and.callThrough();

      view.setTooltipActivity(true);

      expect(view.setTooltipActivity).toHaveBeenCalledWith(true);
    });
  });
});
