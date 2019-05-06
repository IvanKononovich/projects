export default class Slider {
  constructor() {
    this.slider = document.createElement('div');
    this.slider.classList.add('slider');

    this.containerSlide = document.createElement('div');
    this.containerSlide.classList.add('container-slide');

    this.slider.appendChild(this.containerSlide);
    document.body.appendChild(this.slider);
  }
}
