import '../plugin/sliderPlugin';
import './main.scss';

const sliderOne = $('.js-slider-one').sliderPlugin();
sliderOne.setStepSize(25);
$('.js-slider-two').sliderPlugin();
$('.js-slider-three').sliderPlugin();
