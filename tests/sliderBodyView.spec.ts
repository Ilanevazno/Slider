import SliderBodyView from '../src/plugin/components/View/SliderBodyView/SliderBodyView';
import { Axis } from '../src/plugin/components/types/types';

const $dummyHtmlElement = $(document.createElement('div'));
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue($dummyHtmlElement);

const currentAxis: Axis = 'Y' as unknown as Axis;
const sliderBody = new SliderBodyView($dummyHtmlElement, currentAxis);

describe('Проверка класса SliderBodyView', () => {
  it('Произошла инициализация класса MainView', () => {
    expect(sliderBody).toBeDefined();
    expect(sliderBody).toBeInstanceOf(SliderBodyView);
  });

  describe('Установка направления тела слайдера и получение его параметров', () => {
    beforeEach(() => {
      spyOn(sliderBody, 'setAxis').and.callThrough();
      sliderBody.setAxis(currentAxis);
    });

    it('метод setAxis', () => {
      expect(sliderBody.setAxis).toBeCalledWith(currentAxis);
    });

    it('метод getSliderBodyParams', () => {
      spyOn(sliderBody, 'getSliderBodyParams').and.callThrough();

      const sliderBodyCurrentParams = sliderBody.getSliderBodyParams();

      expect(sliderBody.getSliderBodyParams).toBeCalled();
      expect(sliderBodyCurrentParams).toBe(0);
    });
  });

  describe('Рисуем полосу со значениями', () => {
    const mockBreakpoints = Array(10).fill('').map((_element, index) => Object({ currentPercent: index, pixelPosition: index * 100 }));
    sliderBody.drawBreakPoints(mockBreakpoints);

    it('метод drawBreakPoints, в тестовом элементе должны быть сгенерированы брейкпоинты.', () => {
      expect($dummyHtmlElement.find('.slider__breakpoint').length).toBeGreaterThan(0);
    });

    it('Затем, удаляем элементы, и при поиске у нас должен быть результат - 0 элементов.', () => {
      sliderBody.removeBreakpoints();
      expect($dummyHtmlElement.find('.slider__breakpoint')).toHaveLength(0);
    });
  });
});
