import HandlerView from '../src/plugin/components/View/HandlerView/HandlerView';

const $dummyHtmlElement = $(document.createElement('div'));
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue($dummyHtmlElement);

const currentAxis = 'Y';

const handlerView = new HandlerView($dummyHtmlElement, currentAxis);

describe('Проверка класса SliderBodyView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(handlerView).toBeDefined();
    expect(handlerView).toBeInstanceOf(HandlerView);
  });

  describe('Проверяем метод получения ширины хандлера', () => {
    const mockHandlerWidth = 200;
    handlerView.$html.css('width', `${mockHandlerWidth}px`);

    it(`Ширина слайдера должна быть ${mockHandlerWidth}`, () => {
      spyOn(handlerView, 'getHandlerWidth').and.callThrough();

      const handlerWidth = handlerView.getHandlerWidth();

      expect(handlerWidth).toBe(mockHandlerWidth);
      expect(handlerView.getHandlerWidth).toBeCalled();
    });
  });

  describe('Попытаемся переместить хандлер на другую позицию', () => {
    const newHandlerPosition = 150;

    it(`handler должнен сместиться на ${newHandlerPosition} пикселей позиции top`, () => {
      spyOn(handlerView, 'moveHandler').and.callThrough();

      handlerView.moveHandler(newHandlerPosition);

      expect(handlerView.$html.css('top')).toBe(`${newHandlerPosition}px`);
      expect(handlerView.moveHandler).toBeCalledWith(newHandlerPosition);
    });
  });
});
