import Model from '../src/plugin/components/Model/Model';
import { availableOptions, Values } from '../src/plugin/components/types/types';

const modelSpecOptions: availableOptions = {
  stepSize: 1,
  minAvailableValue: 1,
  maxAvailableValue: 100,
  minValueCurrent: 30,
  maxValueCurrent: 70,
  axis: 'X',
  withLabels: false,
  withTooltip: false,
  valueType: Values.SINGLE,
};

const modelSpec = new Model(modelSpecOptions);


describe('Проверка класса Model', () => {
  it('Произошла инициализация класса Model', () => {
    expect(modelSpec).toBeDefined();
    expect(modelSpec).toBeInstanceOf(Model);
  });

  describe('Тест методов взаимодействия с опциями', () => {
    it('Установка типа слайдера на двойное значение', () => {
      modelSpec.setValueType(Values.DOUBLE);

      expect(modelSpec.valueType).toBe('double');
    });

    it('Установка направления по оси Y', () => {
      modelSpec.setAxis('Y');

      expect(modelSpec.axis).toBe('Y');
    });

    it('Включение нижней подсказки с шагами', () => {
      modelSpec.setLabelsActivity(true);

      expect(modelSpec.withLabels).toBe(true);
    });

    it('Включение тултипа', () => {
      modelSpec.setTooltipActivity(true);

      expect(modelSpec.withTooltip).toBe(true);
    });

    it('Получение всех возможных опций', () => {
      const options = ['axis', 'valueType', 'minValue', 'maxValue', 'stepSize', 'breakpoints', 'withTooltip', 'withLabels'];

      options.map((option: string) => {
        const caughtOption = modelSpec.getOption(option);
        expect(caughtOption).toBeDefined();
        return option;
      });
    });

    it('Получение state', () => {
      const state = modelSpec.getState();
      expect(state).toBeDefined();
      expect(typeof state).toBe('object');
    });

    describe('Установка минимального значения', () => {
      it('Должно вернуть ошибку, т.к значение больше максимального', () => {
        const newMinValue = modelSpec.setMinAvailableValue(modelSpecOptions.maxAvailableValue + 1);

        expect(newMinValue.response).toBe('ERROR');
      });

      it('Установка минимального значения должна быть без ошибок', () => {
        const newMinValue = modelSpec.setMinAvailableValue(modelSpecOptions.maxAvailableValue - 10);

        expect(newMinValue.response).toBe('SUCCESS');
      });
    });

    describe('Установка максимального значения', () => {
      it('Должно вернуть ошибку, т.к значение меньше минимального', () => {
        const newMaxValue = modelSpec.setMaxAvailableValue(modelSpecOptions.minAvailableValue + -10);

        expect(newMaxValue.response).toBe('ERROR');
      });

      it('Установка минимального значения должна быть без ошибок', () => {
        const newMaxValue = modelSpec.setMaxAvailableValue(modelSpecOptions.maxAvailableValue + 10);

        expect(newMaxValue.response).toBe('SUCCESS');
      });
    });

    describe('Установка шага', () => {
      it('Должна быть возвращена ошибка, новое значение больше чем максимальное', () => {
        const newStepSize = modelSpec.setStepSize(modelSpecOptions.maxAvailableValue * 2);
        expect(newStepSize.response).toBe('ERROR');
      });

      it(`Новое новый шаг должен быть установлен на ${modelSpecOptions.maxAvailableValue / 2}`, () => {
        const newStepSize = modelSpec.setStepSize(modelSpecOptions.maxAvailableValue / 2);
        expect(newStepSize.response).toBe('SUCCESS');
      });

      it('Отрицательные значения должны работать', () => {
        const newStepSize = modelSpec.setStepSize(-modelSpecOptions.maxAvailableValue);
        expect(newStepSize.response).toBe('SUCCESS');
      });

      it('Дробные значения должны работать', () => {
        const newStepSize = modelSpec.setStepSize(modelSpecOptions.maxAvailableValue / 2.5);
        expect(newStepSize.response).toBe('SUCCESS');
      });
    });

    it('Был вызван метод обновления брейкпоинтов', () => {
      spyOn(modelSpec, 'updateBreakpointList').and.callThrough();

      modelSpec.updateBreakpointList();

      expect(modelSpec.updateBreakpointList).toBeCalled();
    });

    describe('Работа со state', () => {
      const dummyHtmlElement = $(document.createElement('div'));
      document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

      const handler = {
        $handler: dummyHtmlElement,
        name: 'min-value',
        value: modelSpecOptions.minAvailableValue,
      };

      beforeEach(() => {
        spyOn(modelSpec, 'setState').and.callThrough();
        modelSpec.setState(handler);
      });


      it('Установка state', () => {
        expect(modelSpec.state[0]).toEqual(expect.objectContaining(handler));
        expect(modelSpec.setState).toBeCalledWith(handler);
      });

      it('Изменение состояния по имени хандлера', () => {
        const newHandlerValue = 50;

        spyOn(modelSpec, 'changeStateByItemName').and.callThrough();
        modelSpec.changeStateByItemName('min-value', newHandlerValue);

        expect(modelSpec.changeStateByItemName).toBeCalledWith('min-value', newHandlerValue);
      });

      it('Обновить состояние', () => {
        spyOn(modelSpec, 'refreshState').and.callThrough();
        modelSpec.refreshState();
        expect(modelSpec.refreshState).toBeCalled();
      });

      it('Очистка состояния', () => {
        spyOn(modelSpec, 'clearState').and.callThrough();
        modelSpec.clearState();

        expect(modelSpec.clearState).toBeCalled();
        expect(Object.values(modelSpec.state)).toHaveLength(0);
      });
    });
  });
});
