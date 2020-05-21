import HandlerView from '../View/HandlerView/HandlerView';
import TooltipView from '../View/TooltipView/TooltipView';

export type availableOptions = {
  stepSize: number;
  minValue: number;
  maxValue: number;
  axis: 'X' | 'Y';
  isShowLabels: boolean;
  isEnabledTooltip: boolean;
  valueType: 'single' | 'double';
}

export type sliderBreakpoint = {
  currentValue: number;
  pixelPosition: number;
}

export type handlerInstance = {
  instances: {
    handler?: HandlerView;
    tooltip?: TooltipView;
  };
  name: string;
  statePercent?: number;
}

export type stateHandler = {
  $handler: JQuery<HTMLElement>;
  name: string;
  value: number;
}

export type breakpointsData = {
  breakpoints: number[] | null;
  isActiveBreakpoints: boolean;
}

export type modelListener = {
  state: stateHandler;
  axis: string;
  isEnabledTooltip: boolean;
}

export type observerEvent<T> = {
  type: string;
  data: T;
}

export type convertingData = {
  minPercent: number;
  maxPercent: number;
  currentValue: number;
  htmlContainerWidth: number;
}

export type modelResponse = {
  readonly response: 'SUCCESS' | 'ERROR';
  message: string;
}
