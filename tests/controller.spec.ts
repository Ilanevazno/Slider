import Controller from '../src/plugin/components/Controller/Controller';
import Model from '../src/plugin/components/Model/Model';
import MainView from '../src/plugin/components/View/MainView';
import { Options, ValueType, Axis } from '../src/plugin/components/types/types';

const mockModelOptions: Options = {
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
    spyOn(controllerSpec, 'changeStateByHandlerName');
    controllerSpec.changeStateByHandlerName('minValue', 50);
    expect(controllerSpec.changeStateByHandlerName).toBeCalledWith('minValue', 50);
  });

  it('Запрос на изменение типа вида', () => {
    spyOn(controllerSpec, 'setValueType');
    controllerSpec.setValueType('doubleValue' as unknown as ValueType);
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
    spyOn(controllerSpec, 'showTooltip');
    controllerSpec.showTooltip();
    expect(controllerSpec.showTooltip).toBeCalled();
  });

  it('Запрос на отключение Tooltip', () => {
    spyOn(controllerSpec, 'hideTooltip');
    controllerSpec.hideTooltip();
    expect(controllerSpec.hideTooltip).toBeCalled();
  });

  it('Изменение направления', () => {
    spyOn(controllerSpec, 'setAxis');
    controllerSpec.setAxis('Y' as unknown as Axis);
    expect(controllerSpec.setAxis).toBeCalledWith('Y');
  });
});
