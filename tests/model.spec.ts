import Model from '../src/plugin/components/Model/Model';

const modelSpecOptions = {
  stepSize: 1,
  minValue: 1,
  maxValue: 100,
  axis: 'X',
  isShowLabels: false,
  isEnabledTooltip: false,
  valueType: 'singleValue',
}

const modelSpec = new Model(modelSpecOptions);


describe('Проверка класса Model', () => {
  it('Произошла инициализация класса Model', () => {
    expect(modelSpec).toBeDefined();
    expect(modelSpec).toBeInstanceOf(Model);
  })

  describe('Тест методов взаимодействия с опциями', () => {
    it('Установка типа слайдера на двойное значение', () => {
      modelSpec.setValueType('doubleValue');

      expect(modelSpec.valueType).toBe('doubleValue');
    });

    it('Установка направления по оси Y', () => {
      modelSpec.setAxis('Y');

      expect(modelSpec.axis).toBe('Y');
    })

    it('Включение нижней подсказки с шагами', () => {
      modelSpec.setLabelsActivity(true);

      expect(modelSpec.isShowLabels).toBe(true);
    })

    it('Включение тултипа', () => {
      modelSpec.showTooltip();

      expect(modelSpec.isEnabledTooltip).toBe(true);
    })

    it('Отключение тултипа', () => {
      modelSpec.hideTooltip();

      expect(modelSpec.isEnabledTooltip).toBe(false);
    })

    it('Отключение тултипа', () => {
      modelSpec.hideTooltip();

      expect(modelSpec.isEnabledTooltip).toBe(false);
    })

    it('Получение всех возможных опций', () => {
      const options = ['axis', 'valueType', 'minValue', 'maxValue', 'stepSize', 'breakpoints', 'isEnabledTooltip', 'isShowLabels'];

      options.map((option: string) => {
        const caughtOption = modelSpec.getOption(option);
        expect(caughtOption).toBeDefined();
      })
    })

    it('Получение state', () => {
      const state = modelSpec.getState();
      expect(state).toBeDefined();
      expect(typeof state).toBe('object');
    })

    describe('Установка минимального значения', () => {
      it('Должно вернуть ошибку, т.к значение больше максимального', () => {
        const newMinValue: any = modelSpec.setMinValue(modelSpecOptions.maxValue + 1);

        expect(newMinValue.response).toBe('error');
      })

      it('Установка минимального значения должна быть без ошибок', () => {
        const newMinValue: any = modelSpec.setMinValue(modelSpecOptions.maxValue - 10);

        expect(newMinValue.response).toBe('success');
      })
    })

    describe('Установка максимального значения', () => {
      it('Должно вернуть ошибку, т.к значение меньше минимального', () => {
        const newMaxValue: any = modelSpec.setMaxValue(modelSpecOptions.minValue + -10);

        expect(newMaxValue.response).toBe('error');
      })

      it('Установка минимального значения должна быть без ошибок', () => {
        const newMaxValue: any = modelSpec.setMaxValue(modelSpecOptions.maxValue + 10);

        expect(newMaxValue.response).toBe('success');
      })
    })

    describe('Установка шага', () => {
      it('Должна быть возвращена ошибка, новое значение больше чем максимальное', () => {
        const newStepSize: any = modelSpec.setStepSize(modelSpecOptions.maxValue * 2);
        expect(newStepSize.response).toBe('error');
      })

      it(`Новое новый шаг должен быть установлен на ${modelSpecOptions.maxValue / 2}`, () => {
        const newStepSize: any = modelSpec.setStepSize(modelSpecOptions.maxValue / 2);
        expect(newStepSize.response).toBe('success');
      })

      it('Отрицательные значения должны работать', () => {
        const newStepSize: any = modelSpec.setStepSize(-modelSpecOptions.maxValue);
        expect(newStepSize.response).toBe('success');
      })

      it('Дробные значения должны работать', () => {
        const newStepSize: any = modelSpec.setStepSize(modelSpecOptions.maxValue / 2.5);
        expect(newStepSize.response).toBe('success');
      })
    })

    it('Был вызван метод обновления брейкпоинтов', () => {
      spyOn(modelSpec, 'updateBreakpointList').and.callThrough();

      modelSpec.updateBreakpointList();

      expect(modelSpec.updateBreakpointList).toBeCalled();
    })

    describe('Работа со state', () => {
      const dummyHtmlElement = $(document.createElement('div'));
      document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

      const handler = {
        $handler: dummyHtmlElement,
        name: 'min-value',
        value: modelSpecOptions.minValue,
      }

      beforeEach(() => {
        spyOn(modelSpec, 'setState').and.callThrough();
        modelSpec.setState(handler);
      });


      it('Установка state', () => {
        expect(modelSpec.state[0]).toEqual(expect.objectContaining(handler));
        expect(modelSpec.setState).toBeCalledWith(handler);
      })

      it('Изменение состояния по имени хандлера', () => {
        const newHandlerValue = 50;

        spyOn(modelSpec, 'changeStateByHandlerName').and.callThrough();
        modelSpec.changeStateByHandlerName('min-value', newHandlerValue);

        expect(modelSpec.changeStateByHandlerName).toBeCalledWith('min-value', newHandlerValue);
      })

      it('Обновить состояние', () => {
        spyOn(modelSpec, 'refreshState').and.callThrough();
        modelSpec.refreshState();
        expect(modelSpec.refreshState).toBeCalled();
      })

      it('Очистка состояния', () => {
        spyOn(modelSpec, 'clearState').and.callThrough();
        modelSpec.clearState();

        expect(modelSpec.clearState).toBeCalled();
        expect(Object.values(modelSpec.state)).toHaveLength(0);
      })
    })
  })
})
