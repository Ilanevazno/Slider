import HandlerView from '../View/HandlerView/HandlerView';
import { JQueryExtendedEvent } from '../interfaces/interfaces';

export type Options = {
  stepSize: number;
  minValue: number;
  maxValue: number;
  minValueCurrent?: number;
  maxValueCurrent?: number;
  axis: 'X' | 'Y';
  withLabels: boolean;
  withTooltip: boolean;
  valueType: 'single' | 'double';
  breakpoints?: any[];
}

export type SliderBreakpoint = {
  currentValue: number;
  pixelPosition: number;
}

export type HandlerEvent = {
  $handler: JQuery<HTMLElement>;
  event: JQueryExtendedEvent;
  name: string;
  offset: number;
}

export type StateHandler = {
  handler?: HandlerView;
  $handler?: JQuery<HTMLElement>;
  name: string;
  statePercent?: number;
  value?: number;
}

export type BreakpointsData = {
  breakpoints: number[] | null;
  isActiveBreakpoints: boolean;
}

export type ModelListener = {
  state: StateHandler;
  axis: string;
  withTooltip: boolean;
}

export type ObserverEvent<T> = {
  type: string;
  data: T;
}

export type ConvertingData = {
  minPercent: number;
  maxPercent: number;
  currentValue: number;
  htmlContainerWidth: number;
}

export type ModelResponse = {
  readonly response: 'SUCCESS' | 'ERROR';
  message: string;
}
