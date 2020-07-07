// import Controller from '../src/plugin/components/Controller/Controller';
// import Model from '../src/plugin/components/Model/Model';
// import MainView from '../src/plugin/components/View/MainView';
// import { AvailableOptions, ValueType } from '../src/plugin/components/types/types';

// const mockModelOptions: AvailableOptions = {
//   stepSize: 1,
//   minAvailableValue: 1,
//   maxAvailableValue: 100,
//   minCurrentValue: 30,
//   maxCurrentValue: 70,
//   axis: 'X',
//   withLabels: false,
//   withTooltip: false,
//   valueType: ValueType.SINGLE,
// };

// const dummyHtmlElement = document.createElement('div');
// document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

// const modelForControllerSpec = new Model(mockModelOptions);
// const viewForControllerSpec = new MainView(modelForControllerSpec, dummyHtmlElement);
// const controllerSpec = new Controller(modelForControllerSpec, viewForControllerSpec);

// describe('Проверка класса Controller', () => {
//   it('Произошла инициализация класса Controller', () => {
//     expect(controllerSpec).toBeDefined();
//     expect(controllerSpec).toBeInstanceOf(Controller);
//   });

//   it('Подписка на события', () => {
//     spyOn(controllerSpec, 'subscribeToChangeState').and.callThrough();
//     const callback = (_) => true;
//     controllerSpec.subscribeToChangeState(callback);
//     expect(controllerSpec.subscribeToChangeState).toBeCalled();
//   });

//   it('Запрос на изменение состояния по имени', () => {
//     spyOn(controllerSpec, 'changeStateByItemName');
//     controllerSpec.changeStateByItemName('minValue', 50);
//     expect(controllerSpec.changeStateByItemName).toBeCalledWith('minValue', 50);
//   });

//   it('Запрос на изменение типа вида', () => {
//     spyOn(controllerSpec, 'setValueType');
//     controllerSpec.setValueType(ValueType.DOUBLE);
//     expect(controllerSpec.setValueType).toBeCalledWith('doubleValue');
//   });

//   it('Запрос на включение индикатора шагов', () => {
//     spyOn(controllerSpec, 'setLabelsAvailability');
//     controllerSpec.setLabelsAvailability(true);
//     expect(controllerSpec.setLabelsAvailability).toBeCalled();
//   });

//   it('Запрос на включение Tooltip', () => {
//     spyOn(controllerSpec, 'setTooltipAvailability');
//     controllerSpec.setTooltipAvailability(true);
//     expect(controllerSpec.setTooltipAvailability).toBeCalled();
//   });

//   it('Изменение направления', () => {
//     spyOn(controllerSpec, 'setAxis');
//     controllerSpec.setAxis('Y');
//     expect(controllerSpec.setAxis).toBeCalledWith('Y');
//   });
// });
