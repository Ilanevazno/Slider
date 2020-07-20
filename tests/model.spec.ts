import Model from '../src/plugin/components/Model/Model';
import { AvailableOptions, ValueType, UnconvertedStateItem } from '../src/plugin/components/types/types';

const modelSpecOptions: AvailableOptions = {
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

const modelSpec = new Model(modelSpecOptions);


describe('Проверка класса Model', () => {
  it('Произошла инициализация класса Model', () => {
    expect(modelSpec).toBeDefined();
    expect(modelSpec).toBeInstanceOf(Model);
  });

  describe('Тест методов взаимодействия с опциями', () => {
    it('Установка типа слайдера на двойное значение', () => {
      modelSpec.setValueType(ValueType.DOUBLE);

      expect(modelSpec.valueType).toBe('double');
    });

    it('Установка направления по оси Y', () => {
      modelSpec.setAxis('Y');

      expect(modelSpec.axis).toBe('Y');
    });

    it('Включение нижней подсказки с шагами', () => {
      modelSpec.setLabelsAvailability(true);

      expect(modelSpec.withLabels).toBe(true);
    });

    it('Включение тултипа', () => {
      modelSpec.setTooltipAvailability(true);

      expect(modelSpec.withTooltip).toBe(true);
    });

    it('Получение всех возможных опций', () => {
      const options = ['axis', 'valueType', 'minAvailableValue', 'maxAvailableValue', 'stepSize', 'breakpoints', 'withTooltip', 'withLabels'];

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
      it('Должно выбросить ошибку, т.к значение больше максимального', () => {
        try {
          modelSpec.setMinAvailableValue(modelSpecOptions.maxAvailableValue + 1);
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });

      it('Установка минимального значения должна быть без ошибок', () => {
        modelSpec.setMinAvailableValue(modelSpecOptions.maxAvailableValue - 10);

        expect(modelSpec.minAvailableValue).toEqual(modelSpecOptions.maxAvailableValue - 10);
      });
    });

    describe('Установка максимального значения', () => {
      it('Должно вернуть ошибку, т.к значение меньше минимального', () => {
        try {
          modelSpec.setMaxAvailableValue(modelSpecOptions.maxAvailableValue + 10);
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });

      it('Установка минимального значения должна быть без ошибок', () => {
        modelSpec.setMaxAvailableValue(modelSpecOptions.maxAvailableValue + 10);

        expect(modelSpec.maxAvailableValue).toEqual(modelSpecOptions.maxAvailableValue + 10);
      });
    });

    describe('Установка шага', () => {
      it('Должна быть возвращена ошибка, новое значение больше чем максимальное', () => {
        try {
          modelSpec.setStepSize(modelSpecOptions.maxAvailableValue * 2);
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });

      it(`Новое новый шаг должен быть установлен на ${modelSpecOptions.maxAvailableValue / 2}`, () => {
        modelSpec.setStepSize(modelSpecOptions.maxAvailableValue / 2);
        expect(modelSpec.stepSize).toEqual(modelSpecOptions.maxAvailableValue / 2);
      });

      it('Дробные значения так же должны работать', () => {
        modelSpec.setStepSize(modelSpecOptions.maxAvailableValue / 2.5);
        expect(modelSpec.stepSize).toEqual(modelSpecOptions.maxAvailableValue / 2.5);
      });
    });

    it('Был вызван метод обновления брейкпоинтов', () => {
      spyOn(modelSpec, 'updateBreakpointList').and.callThrough();

      modelSpec.updateBreakpointList();

      expect(modelSpec.updateBreakpointList).toBeCalled();
    });

    describe('Работа со state', () => {
      const handler: UnconvertedStateItem = {
        name: 'minValue',
        value: 90,
      };

      it('Установка state', () => {
        spyOn(modelSpec, 'setState').and.callThrough();
        modelSpec.setState(handler);

        expect(modelSpec.state[handler.name]).toEqual(handler.value);
        expect(modelSpec.setState).toBeCalledWith(handler);
      });
    });
  });
});
