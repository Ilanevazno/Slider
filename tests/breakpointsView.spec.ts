import MainView from '../src/plugin/components/View/MainView';
import BreakpointsView from '../src/plugin/components/View/BreakpointsView/BreakpointsView';
import SliderBodyView from '../src/plugin/components/View/SliderBodyView/SliderBodyView';

jest.mock('../src/plugin/components/Model/Model');
jest.mock('../src/plugin/components/View/MainView');
jest.mock('../src/plugin/components/View/BreakpointsView/BreakpointsView');
jest.mock('../src/plugin/components/View/SliderBodyView/SliderBodyView');

interface Mock<T> extends SliderBodyView {
  new(...args: any[]): T;
}

let breakpointsView: BreakpointsView;

describe('Тестирование класса BreakpointsView', () => {
  beforeEach(() => {
    breakpointsView = new BreakpointsView('X', MainView as Mock<MainView>);
  });

  it('Произошла инициализация', () => {
    expect(breakpointsView).toBeInstanceOf(BreakpointsView);
  });

  it('Successfully drawing', () => {
    spyOn(breakpointsView, 'draw').and.callThrough();

    const breakpointsData = {
      axis: 'X',
      offsetHandlerWidth: 10,
      currentBreakpointList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      minAvailableValue: 0,
      maxAvailableValue: 10,
    };

    breakpointsView.draw(breakpointsData);

    expect(breakpointsView.draw).toBeCalledWith(breakpointsData);
  });

  it('Successfully removed', () => {
    spyOn(breakpointsView, 'remove').and.callThrough();

    breakpointsView.remove();

    expect(breakpointsView.remove).toBeCalled();
  });
});
