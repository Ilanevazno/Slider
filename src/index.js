import $ from 'jquery';
import jquery from 'jquery';
//Подключение основных файлов проекта
import './index.pug';
import './index.scss';
import './mySlider.ts';

let slider = $("#first_slider").createSlider({
    initSettings: true,
    maxValue: 200
});

let slidera = $("#second_slider").createSlider({
    initSettings: true,
});

let sliderb = $("#third_slider").createSlider({
    initSettings: true,
});