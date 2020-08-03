import Controller from '../src/plugin/components/Controller/Controller';
import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import { AvailableOptions, ValueType, Axis } from '../src/plugin/components/types/types';

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

const modelForControllerSpec = new Model(mockModelOptions);
const viewForControllerSpec = new MainView(modelForControllerSpec, dummyHtmlElement);
const controllerSpec = new Controller(modelForControllerSpec, viewForControllerSpec);

describe('Проверка класса Controller', () => {
  it('Произошла инициализация класса Controller', () => {
    expect(controllerSpec).toBeDefined();
    expect(controllerSpec).toBeInstanceOf(Controller);
  });

  describe('Проверка основных методов', () => {
    it('Подписка на события', () => {
      spyOn(controllerSpec, 'subscribeToChangeState').and.callThrough();
      const callback = (_: string) => true;
      controllerSpec.subscribeToChangeState(callback);
      expect(controllerSpec.subscribeToChangeState).toBeCalledWith(callback);
    });

    it('Запрос на изменение состояния по имени', () => {
      controllerSpec.changeStateByItemName('minValue', 50);
      expect(modelForControllerSpec.state.minValue = 50);

      controllerSpec.changeStateByItemName('minValue', 77);
      expect(modelForControllerSpec.state.minValue = 77);
    });

    it('Запрос на изменение типа вида', () => {
      expect(modelForControllerSpec.valueType).toBe(ValueType.SINGLE);
      controllerSpec.setValueType(ValueType.DOUBLE);
      expect(modelForControllerSpec.valueType).toBe(ValueType.DOUBLE);
      controllerSpec.setValueType(ValueType.SINGLE);
      expect(modelForControllerSpec.valueType).toBe(ValueType.SINGLE);
    });

    it('Запрос на включение индикатора шагов', () => {
      expect(modelForControllerSpec.withLabels).toBeFalsy();
      controllerSpec.setLabelsAvailability(true);
      expect(modelForControllerSpec.withLabels).toBeTruthy();
      controllerSpec.setLabelsAvailability(false);
      expect(modelForControllerSpec.withLabels).toBeFalsy();
    });

    it('Запрос на включение Tooltip', () => {
      expect(modelForControllerSpec.withTooltip).toBeFalsy();
      controllerSpec.setTooltipAvailability(true);
      expect(modelForControllerSpec.withTooltip).toBeTruthy();
      controllerSpec.setTooltipAvailability(false);
      expect(modelForControllerSpec.withTooltip).toBeFalsy();
    });

    it('Изменение направления', () => {
      expect(modelForControllerSpec.axis).not.toEqual('Y');
      controllerSpec.setAxis('Y');
      expect(modelForControllerSpec.axis).toEqual('Y');
      controllerSpec.setAxis('X');
      expect(modelForControllerSpec.axis).toEqual('X');

      let errorsCount = 0;

      try {
        controllerSpec.setAxis('KEK' as Axis);
      } catch (err) {
        errorsCount += 1;
      }

      expect(errorsCount).toBe(1);
    });

    it('Изменение шага', () => {
      expect(modelForControllerSpec.stepSize).not.toEqual(20);
      controllerSpec.setStepSize(20);
      expect(modelForControllerSpec.stepSize).toEqual(20);

      let errorsCount = 0;

      try {
        controllerSpec.setStepSize(90000);
      } catch (err) {
        errorsCount += 1;
      }

      expect(errorsCount).toBe(1);
    });

    it('set max available value', () => {
      expect(modelForControllerSpec.maxAvailableValue).not.toBe(444);
      controllerSpec.setMaxAvailableValue(444);
      expect(modelForControllerSpec.maxAvailableValue).toBe(444);
    });

    it('set min available value', () => {
      expect(modelForControllerSpec.minAvailableValue).not.toBe(333);
      controllerSpec.setMinAvailableValue(333);
      expect(modelForControllerSpec.minAvailableValue).toBe(333);
    });
  });
});
