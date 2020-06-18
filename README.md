# SliderPlugin

Homework by fullstack development. Here we make JQuery plugin called as "slider".

## Here we use

* [x] Typescript
* [x] Javascript
* [x] PUG
* [x] SCSS
* [x] BEM methodology
* [x] Webpack
* [x] unit (jest)
* [x] jQuery
* [x] modular architecture

## Demo page

You can enter to [Demo page](https://ilanevazno.github.io/Slider/ "Demo page") for looking at this project.

## Git

clone this repository with:
` `  ` git clone https://github.com/Ilanevazno/Slider.git `  ` `

## NPM scripts

#### Install project
` `  ` npm install `  ` ` installing dependencies before running

#### To start locally

` `  ` npm run dev `  ` ` for development environment in watch mode

#### To build project

` `  ` npm run build `  ` ` will create build folder in the project folder

#### To deploy

` `  ` npm run deploy `  ` ` deploying build folder from project to github pages

#### Eslint

` `  ` npm run eslint `  ` ` checking all .js files in 'plugin' folder on esLint with airBnb preset

#### Tests

` `  ` npm run tests `  ` ` start unit tests one time

## About this plugin and API documentation

There are various options such as multiple handles and ranges.
To start you need make HTML container, for example:

``` html
<div id="slider"></div>
```

Then you can initialize plugin uses:

``` javascript
$("#slider").sliderPlugin({ options })
```

#### Option list

**Using:** ` `  ` const slider = $("#second_slider").sliderPlugin('method', ...args) `  ` ` 

| Option  | Values | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| stepSize  | -∞ -  +∞  | Number  | 1  | Setting step size value  |
| minValue  | -∞ - +∞  | Number  | 0  | Set slider min value   |
| maxValue  | -∞ -  +∞ | Number  | 100  | Set slider max value   |
| axis  | X/Y  | String  | X  | Change slider axis  |
| valueType  | singleValue/doubleValue  | String  | singleValue  | Setting type of slider  |
| withLabels  | true/false  | Boolean  | false  | show/hide number values under slider body   |
| withTooltip  | true/false  | Boolean  | false  | show/hide tooltip   |

## Methods

| Method  | Arguments | Arguments examples | Description |
| ------------- | ------------- | ------------- | ------------- |
| sliderPlugin  |options: object|{ stepSize: number, minValue: number, maxValue: number, axis: string, withLabels: boolean, withTooltip: boolean, valueType: string, } | generage slider plugin into HTML container|
| showLabels ||| Show labels under slider body|
| hideLabels ||| Hide labels under slider body|
| setStepSize| stepSize: number | -∞ -  +∞ | Hide labels under slider body|
| setMinValue| value: number | -∞ -  +∞ | Set min slider value|
| setMaxValue| value: number | -∞ -  +∞ | Set max slider value|
| setAxis| axis: string | 'X', 'Y' | change slider axis|
| showTooltip||| show tooltip with current value |
| hideTooltip||| hide tooltip with current value |
| changeStateByItemName|handlerName: string, newValue: number|'min-value', -∞ -  +∞ or 'max-value', -∞ -  +∞| hide tooltip with current value |
| setValueType |valueType: string|singleValue, doubleValue| change slider value type|

## Architecture description

Архитектура данного приложения разбита на 3 слоя:

* Слой Model
* Слой View
* Слой Controller

За инициализацию плагина отвечает метод sliderPlugin(), который предоставлен с помощью интерфейса пользователю, при его вызове происходит цепной вызов функций которые производят первичную настройку слайдера:

* Инициализируются все классы приложения; 
* Устанавливается вариант отображения; 
* Устанавливается тип слайдера (одиночное / интервал); 
* Инициализиуется визуальная панель управления; 
* По необходимости вызывается отображения активного значения и значений под 'телом' слайдера.

Основные слои приложения реализованы следующим образом:

#### Controller

Является проводником между MainView и Model, посредством использования паттерна Observer; 

#### Model

Данный слой необходим для выполнения расчётов связанных исключительно с бизнес логикой. Слой не связан с Controller и MainView, 'общение' с контроллером происходит исключительно посредством паттерна Observer, 

#### MainView 

Главный View слой приложений, который выполняет расчёты необходимые для отображения, а так же является связующим звеном всех вьюх, настраивает 'общение' между классами 'HandlerView, SliderBodyView, TooltipView', и отправляет необходимые данные и запросы на изменения данных в собственный Observer.

Ниже предоставлена диаграмма компонентов для визуального представления взаимодействия слоёв приложения:

## Диаграмма классов приложения:

![enter image description here](https://i.ibb.co/7g00djQ/Untitled-Diagram.jpg)

* *Observer* позволяет передавать и принимать события между классами; 
* *Model* Отвечает за расчёты внутри бизнес логики
* *View* Отвечает за визуальную часть приложения
* *Controller* Отвечает за взаимодействие между Model и View
* *HandlerView* - Компонент для слайдера (бегунок)
* *TooltipView* - Отображаемое значения 'бегунка'
* *SliderBodyView* - "тело" слайдера
