import Vue from "vue";
// import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";
VueRangeSlider.methods.handleKeyup = () => console.log;
VueRangeSlider.methods.handleKeydown = () => console.log;
Vue.component("vue-range-slider", VueRangeSlider);
