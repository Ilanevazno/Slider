import Controller from '../src/plugin/components/Controller/Controller';
import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import { availableOptions } from '../src/plugin/components/types/types';

const mockModelOptions: availableOptions = {
  stepSize: 1,
  minAvailableValue: 1,
  maxAvailableValue: 100,
  minValueCurrent: 30,
  maxValueCurrent: 70,
  axis: 'X',
  withLabels: false,
  withTooltip: false,
  valueType: 'single',
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

  it('Подписка на события', () => {
    spyOn(controllerSpec, 'subscribeToChangeState').and.callThrough();
    const callback = (_) => true;
    controllerSpec.subscribeToChangeState(callback);
    expect(controllerSpec.subscribeToChangeState).toBeCalled();
  });

  it('Запрос на изменение состояния по имени', () => {
    spyOn(controllerSpec, 'changeStateByItemName');
    controllerSpec.changeStateByItemName('minValue', 50);
    expect(controllerSpec.changeStateByItemName).toBeCalledWith('minValue', 50);
  });

  it('Запрос на изменение типа вида', () => {
    spyOn(controllerSpec, 'setValueType');
    controllerSpec.setValueType('double');
    expect(controllerSpec.setValueType).toBeCalledWith('doubleValue');
  });

  it('Запрос на включение индикатора шагов', () => {
    spyOn(controllerSpec, 'showLabels');
    controllerSpec.showLabels();
    expect(controllerSpec.showLabels).toBeCalled();
  });

  it('Запрос на отключение индикатора шагов', () => {
    spyOn(controllerSpec, 'hideLabels');
    controllerSpec.hideLabels();
    expect(controllerSpec.hideLabels).toBeCalled();
  });

  it('Запрос на включение Tooltip', () => {
    spyOn(controllerSpec, 'setTooltipActivity');
    controllerSpec.setTooltipActivity(true);
    expect(controllerSpec.setTooltipActivity).toBeCalled();
  });

  it('Изменение направления', () => {
    spyOn(controllerSpec, 'setAxis');
    controllerSpec.setAxis('Y');
    expect(controllerSpec.setAxis).toBeCalledWith('Y');
  });
});
