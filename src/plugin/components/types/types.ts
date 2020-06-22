import HandlerView from '../View/HandlerView/HandlerView';

export type availableOptions = {
  stepSize: number;
  minAvailableValue: number;
  maxAvailableValue: number;
  minValueCurrent?: number;
  maxValueCurrent?: number;
  axis: Axis;
  withLabels: boolean;
  withTooltip: boolean;
  valueType: ValueType;
  breakpoints?: any[];
}

export type unconvertedStateItem = {
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

export type ViewHandlerData = {
  handler?: HandlerView;
  $handler?: JQuery<HTMLElement>;
  name: string;
  statePercent?: number;
  value?: number;
}

export type ModelListener = {
  state: ViewHandlerData;
  axis: Axis;
  withTooltip: boolean;
}

export type ObserverEvent<T> = {
  type: string;
  data: T;
}

export type BodyBreakpointsData = {
  axis: string;
  offsetHandlerWidth: number;
  currentBreakpointList: number[];
  minAvailableValue: number;
  maxAvailableValue: number;
}

export type ConvertingData = {
  minPercent: number;
  maxPercent: number;
  currentValue: number;
  maxValue: number;
}

export type ModelResponse<T> = {
  readonly response: Response;
  message: string;
  newValue?: T;
}

export enum Values {
  SINGLE = 'single',
  DOUBLE = 'double'
}

export type ValueType = Values.SINGLE | Values.DOUBLE;

export type Axis = 'X' | 'Y';

export interface JqueryPluginElement extends JQuery<HTMLElement> {
  sliderPlugin?: Function;
}

export interface JQueryExtendedEvent extends JQueryEventObject {
  touches?: TouchEvent;
}

export enum Response {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum CustomEvents {
  BREAKPOINT_CLICKED = 'BREAKPOINT_CLICKED',
  BODY_CLICKED = 'BODY_CLICKED',
  HANDLER_MOUSEDOWN = 'HANDLER_MOUSEDOWN',
  HANDLER_MOUSEMOVE = 'HANDLER_MOUSEMOVE',
  HANDLER_TOUCHMOVE = 'HANDLER_TOUCHMOVE',
  WINDOW_RESIZED = 'WINDOW_RESIZED',
  TOOLTIP_ACTIVITY_CHANGED = 'TOOLTIP_ACTIVITY_CHANGED',
  LABELS_ACTIVITY_CHANGED = 'LABELS_ACTIVITY_CHANGED',
  TOOLTIP_VALUE_CHANGED = 'TOOLTIP_VALUE_CHANGED',
  MIN_AVAILABLE_VALUE_CHANGED = 'MIN_AVAILABLE_VALUE_CHANGED',
  MAX_AVAILABLE_VALUE_CHANGED = 'MAX_AVAILABLE_VALUE_CHANGED',
  STATE_CHANGED = 'STATE_CHANGED',
  STATE_CLEARED = 'STATE_CLEARED',
  STATE_REFRESHED = 'STATE_REFRESHED',
  VALUE_TYPE_CHANGED = 'VALUE_TYPE_CHANGED',
  STEP_SIZE_CHANGED = 'STEP_SIZE_CHANGED',
  AXIS_CHANGED = 'AXIS_CHANGED',
}
