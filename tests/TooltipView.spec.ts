import TooltipView from '../src/plugin/components/View/TooltipView/TooltipView';
import { Axis } from '../src/plugin/components/types/types';

const dummyHtmlElement = document.createElement('div');
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyHtmlElement);

const currentAxis: Axis = 'X';

const tooltipView = new TooltipView(dummyHtmlElement, currentAxis);

describe('Проверка класса tooltipView', () => {
  it('Произошла инициализация', () => {
    expect(tooltipView).toBeDefined();
    expect(tooltipView).toBeInstanceOf(TooltipView);
  });

  describe('Создание и удаление HTML элемента', () => {
    let $tooltip: JQuery<HTMLElement> | undefined;

    beforeEach(() => {
      $tooltip = tooltipView.draw();
    });

    afterEach(() => {
      $tooltip = tooltipView.remove();
    });

    it('Создание DOM элемента через метод draw()', () => {
      expect($tooltip).toBeDefined();
      expect($tooltip[0]).toBeInstanceOf(window.HTMLElement);
    });

    it('Удаление DOM элемента через метод remove()', () => {
      expect($(dummyHtmlElement).find('.slider__tooltip')).toHaveLength(1);

      $tooltip = tooltipView.remove();

      expect($(dummyHtmlElement).find('.slider__tooltip')).toHaveLength(0);
    });
  });

  describe('Установка текущего value', () => {
    it('Установим рандомные значения', () => {
      const $tooltip = tooltipView.draw();

      [1, 3, 13, 27, 45, 67, 80, 93, 100].forEach((number) => {
        expect(Number($(dummyHtmlElement).find('.slider__tooltip').text())).not.toEqual(number);

        tooltipView.setValue(number);

        expect(Number($(dummyHtmlElement).find('.slider__tooltip').text())).toEqual(number);
      });
    });
  });
});
