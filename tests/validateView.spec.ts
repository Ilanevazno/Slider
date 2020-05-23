// /* eslint-disable @typescript-eslint/unbound-method */
// import ValidateView from '../src/plugin/components/View/ValidateView/ValidateView';

// const validateView = new ValidateView();

// describe('Проверка класса ValidateView', () => {
//   it('Получаем инстанс класса', () => {
//     expect(validateView).toBeInstanceOf(ValidateView);
//     expect(validateView).toBeDefined();
//   });

//   describe('Устанавливаем новый shift для handler', () => {
//     const newPointerShift = 100;

//     beforeEach(() => {
//       spyOn(validateView, 'setHandlerShift').and.callThrough();
//       validateView.setHandlerShift(newPointerShift);
//     });

//     it(`Установка значения должна быть вызвана со значением ${newPointerShift}`, () => {
//       expect(validateView.setHandlerShift).toHaveBeenCalledWith(newPointerShift);
//     });

//     it(`Полученное значение должно так же равняться ${newPointerShift}`, () => {
//       const currentPointerShift = validateView.getHandlerShift();
//       expect(currentPointerShift).toBe(newPointerShift);
//     });
//   });

//   describe('Конверторы пикселей и процентов', () => {
//     const minBlockWidth = 100;
//     const maxBlockWidth = 800;
//     let currentValue = 0;

//     it(`получение текущего процента в ${minBlockWidth} пикселей с шириной контейнера в ${maxBlockWidth} пикселей`, () => {
//       spyOn(validateView, 'convertPixelToPercent').and.callThrough();

//       const data = {
//         maxPercent: 100,
//         minPercent: 0,
//         currentValue: minBlockWidth,
//         htmlContainerWidth: maxBlockWidth,
//       };

//       currentValue = validateView.convertPixelToPercent(data);

//       expect(validateView.convertPixelToPercent).toHaveBeenCalledWith(data);
//       expect(currentValue).toBe(13);
//     });
//     it(`Получившиеся проценты ${currentValue}, переводим в пиксели`, () => {
//       spyOn(validateView, 'convertPercentToPixel').and.callThrough();

//       const data = {
//         minPercent: 0,
//         maxPercent: 100,
//         currentValue,
//         htmlContainerWidth: maxBlockWidth,
//       };

//       const currentPixel = validateView.convertPercentToPixel(data);

//       expect(validateView.convertPercentToPixel).toHaveBeenCalledWith(data);
//       expect(currentPixel).toBe(104);
//     });
//   });
// });
