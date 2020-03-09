function importAll(resolve) {
    resolve.keys().forEach(resolve);
  }
  
  importAll(require.context('./', true, /\.js$|\.ts$|\.scss$/));

// import $ from 'jquery';
// import jquery from 'jquery';
// //Подключение основных файлов проекта
// import './index.pug';
// import './index.scss';
// import './mySlider.ts';

// let slider = $("#first_slider").createSlider({
//     initSettings: true,
//     valueIndicator: true,
//     maxValue: 100
// });

// let slidera = $("#second_slider").createSlider({
//     initSettings: true,
// });

// let sliderb = $("#third_slider").createSlider({
//     initSettings: true,
// });