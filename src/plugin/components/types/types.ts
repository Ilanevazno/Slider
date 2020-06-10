import HandlerView from '../View/HandlerView/HandlerView';
import { JQueryExtendedEvent } from '../interfaces/interfaces';

export type availableOptions = {
  stepSize: number;
  minValue: number;
  maxValue: number;
  minValueCurrent?: number;
  maxValueCurrent?: number;
  axis: Axis;
  withLabels: boolean;
  withTooltip: boolean;
  valueType: ValueType;
  breakpoints?: any[];
}

export type modelState = {
  name: string;
  value: number;
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
  axis: Axis;
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

export type ValueType = 'single' | 'double';

export type Axis = 'X' | 'Y';
