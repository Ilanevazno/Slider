import ValidateView from '../src/plugin/components/View/ValidateView/ValidateView';

const validateView = new ValidateView();

describe('Проверка класса ValidateView', () => {
  it('Получаем инстанс класса', () => {
    expect(validateView).toBeInstanceOf(ValidateView);
    expect(validateView).toBeDefined();
  })

  describe('Устанавливаем новый shift для handler', () => {
    const newPointerShift = 100;

    beforeEach(() => {
      spyOn(validateView, 'setPointerShift').and.callThrough();
      validateView.setPointerShift(newPointerShift);
    });

    it(`Установка значения должна быть вызвана со значением ${newPointerShift}`, () => {
      expect(validateView.setPointerShift).toHaveBeenCalledWith(newPointerShift);
    })

    it(`Полученное значение должно так же равняться ${newPointerShift}`, () => {
      const currentPointerShift = validateView.getPointerShift();
      expect(currentPointerShift).toBe(newPointerShift);
    })
  });

  describe('Конверторы пикселей и процентов', () => {
    const minBlockWidth = 100;
    const maxBlockWidth = 800;
    let currentPercent = 0;

    it(`получение текущего процента в ${minBlockWidth} пикселей с шириной контейнера в ${maxBlockWidth} пикселей`, () => {
      spyOn(validateView, 'convertPixelToPercent').and.callThrough();

      const data = {
        currentPixel: minBlockWidth,
        containerWidth: maxBlockWidth,
        maxPercent: 100,
        minPercent: 0,
      };

      currentPercent = validateView.convertPixelToPercent(data);

      expect(validateView.convertPixelToPercent).toHaveBeenCalledWith(data);
      expect(currentPercent).toBe(13);
    })

    it(`Получившиеся проценты ${currentPercent}, переводим в пиксели`, () => {
      spyOn(validateView, 'convertPercentToPixel').and.callThrough();

      const data = {
        minPercent: 0,
        maxPercent: 100,
        currentPercent: currentPercent,
        maxContainerWidth: maxBlockWidth,
      };

      const currentPixel = validateView.convertPercentToPixel(data);

      expect(validateView.convertPercentToPixel).toHaveBeenCalledWith(data);
      expect(currentPixel).toBe(104);
    })
  })
});