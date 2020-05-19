import HandlerView from '../View/HandlerView/HandlerView';
import TooltipView from '../View/TooltipView/TooltipView';

export type initSlider = {
  stepSize: number;
  minValue: number;
  maxValue: number;
  axis: string;
  isShowLabels: boolean;
  isEnabledTooltip: boolean;
  valueType: string;
}

export type modelOptions = {
  isShowLabels: boolean;
  isEnabledTooltip: boolean;
  axis: string;
  valueType: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
}

export type sliderBreakpoint = {
  currentPercent: number;
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

export type handlerData = {
  $handler: JQuery<HTMLElement>;
  name: string;
  value: number;
}

export type breakpointsData = {
  breakpoints: number[] | boolean;
  isActiveBreakpoints: boolean | void;
}

export type stateListener = {
  state: object;
}

export type modelListener = {
  state: stateListener;
  axis: string;
  isEnabledTooltip: boolean;
}

export type observerEvent<T> = {
  type: string;
  data: T;
}

export type percentToPixelConverting = {
  minPercent: number;
  maxPercent: number;
  currentPercent: number;
  maxContainerWidth: number;
}

export type pixelToPercentConverting = {
  currentPixel: number;
  containerWidth: number;
  minPercent: number;
  maxPercent: number;
}

export type modelRequestOption = {
  response: string;
  message: string;
}
