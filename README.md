# NSlider
Homework by fullstack development. Here we make JQuery plugin called as "slider".
## Here we use
- [x] Typescript
- [x] Javascript
- [x] PUG
- [x] SCSS
- [x] BEM methodology
- [x] Webpack
- [x] unit tests (i will use phantomjs)
- [x] jQuery
- [x] modular architecture

## Demo page
You can enter to [Demo page](https://ilanevazno.github.io/Slider/ "Demo page") for looking at this project.

## Git
clone this repository with:
```git clone https://github.com/Ilanevazno/Slider.git```

## NPM scripts

#### Install project
```npm install``` installing dependencies before running

#### To start locally 
```npm run dev``` for development environment in watch mode

#### To build project 
```npm run build``` will create build folder in the project folder

#### To deploy
```npm run deploy``` building and deploying project to github pages

#### Eslint
```npm run eslint``` checking all .js files in 'components' folder on esLint with airBnb preset

#### Tests
```npm run test:single``` start unit tests one time 
```npm run test:watch``` start unit tests in watch mode

## About this plugin and API documentation
There are various options such as multiple handles and ranges.
To start you need make HTML container, for example:
```html
<div id="first_slider"></div>
```
Then you can initialize plugin uses:
```javascript
$("#second_slider").createSlider() 
```
Or if you need getting slider values you can use variable, for example:
```javascript
const slider = $("#second_slider").createSlider() 
```

#### Option list
**Using:**  ``` const slider = $("#second_slider").createSlider({ option: value }) ```

| Option  | Values | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| initSettings  | true/false  | Boolean  | false  | Render settings panel in the HTML page  |
| viewType  | vertical/horizontal  | String  | horizontal  | Change slider view type  |
| stepSize  | 0-100  | Number  | 1  | Setting step size value  |
| valueType  | singleValue/doubleValue  | String  | singleValue  | Setting type of slider  |
| valueIndicator  | true/false  | Boolean  | false  | Getting value frame near pointer   |
| minValue  | 0 - ∞  | Number  | 0  | Set slider min value   |
| maxValue  | 0 -  ∞ | Number  | 100  | Set slider max value   |

## Architecture description

Архитектура данного приложения разбита на 3 слоя:
+ Слой Model
+ Слой View
+ Слой Controller

За первичное начало работы со слайдером отвечает метод createSlider(), который предоставлен с помощью интерфейса пользователю, при его вызове происходит цепной вызов функций которые производят первичную настройку слайдера:
+ Инициализируются все классы приложения;
+ Устанавливается вариант отображения;
+ Устанавливается тип слайдера (одиночное / интервал);
+ Инициализиуется визуальная панель управления;
+ По необходимости вызывается отображения активного значения.

Основные слои приложения реализованы следующим образом:

#### Controller

Является проводником между View и Model, к нему подключается панель настроек а так же принимает данные от observer.

#### Model

В данном классе происходит инициализация, получение и изменение главного State приложения.
Практически все методы данного класса требуют аргументы для того чтобы совершить расчёты в бизнес логике и вернуть обработанные данные.
Данный слой приложения не зависит от других слоёв.

#### View

Данный класс используется исключительно для реализации визуальной части приложения.  
Во view происходит возможность создания либо удаления слайдера, бегунка и индикатора а так же рендеринг трэк лайна. 

Ниже предоставлена диаграмма компонентов для визуального представления взаимодействия слоёв приложения:

![](https://i.ibb.co/b2WVMs8/simple-Diagram.jpg)

#### А так же диаграмма классов приложения:

![](https://i.ibb.co/MMLQzWC/second-Diagram.jpg)

+ *Observer* слушает изменение state и отправляет его контроллеру
+ *Model* Отвечает за расчёты внутри бизнес логики
+ *View* Отвечает за визуальную часть приложения
+ *Controller* Отвечает за взаимодействие между Model и View
+ *SettingsPanel* - отдельный компонент который отвечает за панель настроек, он не зависим от данного приложения, в данном случае он подключён к контроллеру
+ *Pointer* - Компонент для слайдера
+ *PointerIndicator* - Компонент для pointer'a
+ *sliderBody* - "тело" слайдера

