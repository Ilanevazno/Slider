import '../plugin/slider';

let slider = $("#first_slider").createSlider({
    initSettings: true,
    valueIndicator: true,
    maxValue: 100
});

let slidera = $("#second_slider").createSlider({
    initSettings: true,
});

let sliderb = $("#third_slider").createSlider({
    initSettings: true,
});