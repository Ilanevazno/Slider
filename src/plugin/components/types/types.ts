import HandlerView from '../View/HandlerView/HandlerView';
import { JQueryExtendedEvent } from '../interfaces/interfaces';

export type availableOptions = {
  stepSize: number;
  minValue: number;
  maxValue: number;
  minValueCurrent: number;
  maxValueCurrent: number;
  axis: 'X' | 'Y';
  withLabels: boolean;
  withTooltip: boolean;
  valueType: 'single' | 'double';
}

export type sliderBreakpoint = {
  currentValue: number;
  pixelPosition: number;
}

export type handlerEvent = {
  $handler: JQuery<HTMLElement>;
  event: JQueryExtendedEvent;
  name: string;
  offset: number;
}

export type stateHandler = {
  handler?: HandlerView;
  $handler?: JQuery<HTMLElement>;
  name: string;
  statePercent?: number;
  value?: number;
}

export type breakpointsData = {
  breakpoints: number[] | null;
  isActiveBreakpoints: boolean;
}

export type modelListener = {
  state: stateHandler;
  axis: string;
  withTooltip: boolean;
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
