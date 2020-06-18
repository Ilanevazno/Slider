import TooltipView from '../src/plugin/components/View/TooltipView/TooltipView';
import { Axis } from '../src/plugin/components/types/types';

const dummyHtmlElement = document.createElement('div');
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

const currentAxis: Axis = 'X';

const tooltipView = new TooltipView(dummyHtmlElement, currentAxis);

describe('Проверка класса ValidateView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(tooltipView).toBeDefined();
    expect(tooltipView).toBeInstanceOf(TooltipView);
  });

  describe('Создание и удаление HTML элемента', () => {
    let tooltip: JQuery<HTMLElement> | undefined;

    beforeEach(() => {
      spyOn(tooltipView, 'draw').and.callThrough();
      tooltip = tooltipView.draw();
      expect(tooltipView.draw).toBeCalled();
    });

    it('Создание элемента', () => {
      expect(tooltip).toBeDefined();
    });

    it('Удаление элемента', () => {
      spyOn(tooltipView, 'remove').and.callThrough();

      tooltipView.remove();

      expect(tooltipView.remove).toBeCalled();
    });
  });

  describe('Установка текущего значения', () => {
    it('метод setValue', () => {
      spyOn(tooltipView, 'setValue');

      tooltipView.setValue(10);

      expect(tooltipView.setValue).toBeCalledWith(10);
    });
  });
});
