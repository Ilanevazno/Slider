import HandlerView from '../src/plugin/components/View/HandlerView/HandlerView';
import { Axis } from '../src/plugin/components/types/types';

const $dummyHtmlElement = $(document.createElement('div'));
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue($dummyHtmlElement);

const currentAxis: Axis = 'Y';

const handlerView = new HandlerView($dummyHtmlElement, currentAxis);

describe('Проверка класса SliderBodyView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(handlerView).toBeDefined();
    expect(handlerView).toBeInstanceOf(HandlerView);
  });

  describe('Проверяем метод получения ширины хандлера', () => {
    const mockHandlerWidth = 200;
    handlerView.$handler.css('width', `${mockHandlerWidth}px`);

    it(`Ширина слайдера должна быть ${mockHandlerWidth}`, () => {
      spyOn(handlerView, 'getWidth').and.callThrough();

      const handlerWidth = handlerView.getWidth();

      expect(handlerWidth).toBe(mockHandlerWidth);
      expect(handlerView.getWidth).toBeCalled();
    });
  });

  describe('Попытаемся переместить хандлер на другую позицию', () => {
    const newHandlerPosition = 150;

    it(`handler должнен сместиться на ${newHandlerPosition} пикселей позиции top`, () => {
      spyOn(handlerView, 'move').and.callThrough();

      handlerView.move(newHandlerPosition);

      expect(handlerView.$handler.css('top')).toBe(`${newHandlerPosition}px`);
      expect(handlerView.move).toBeCalledWith(newHandlerPosition);
    });
  });
});
