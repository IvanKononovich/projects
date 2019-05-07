export default class Slider {
  constructor() {
    this.slider = document.createElement('div');
    this.slider.classList.add('slider');
    this.slider.innerHTML = '<div class="container-slide"></div>';

    document.body.appendChild(this.slider);

    this.containerSlide = document.querySelector('.container-slide');

    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.followingMouse = this.followingMouse.bind(this);
    this.moveSlide = this.moveSlide.bind(this);
    this.startFollowingX = 0;

    this.slider.addEventListener('mousedown', this.dragStart);
    this.slider.addEventListener('touchstart', this.dragStart);

    document.addEventListener('mouseup', this.dragEnd);
    document.addEventListener('touchend', this.dragEnd);
  }

  dragStart(event) {
    this.startPosXContainer = this.containerSlide.getBoundingClientRect().left;
    this.startPosXContainer -= this.slider.getBoundingClientRect().left;

    this.startFollowingX = event.pageX || event.changedTouches[0].pageX;
    this.shiftX = this.startFollowingX - this.containerSlide.getBoundingClientRect().left;

    this.containerSlide.classList.add('no-transition');
    this.slider.addEventListener('mousemove', this.followingMouse);
    this.slider.addEventListener('touchmove', this.followingMouse);
  }

  dragEnd(event) {
    this.containerSlide.classList.remove('no-transition');
    this.slider.removeEventListener('mousemove', this.followingMouse);
    this.slider.removeEventListener('touchmove', this.followingMouse);

    setTimeout(() => {
      const x = (event.pageX || event.changedTouches[0].pageX);

      if (Math.abs(x - this.startFollowingX) >= this.containerSlide.offsetWidth / 5) {
        if (x > this.startFollowingX) {
          let posX = this.startPosXContainer + this.containerSlide.offsetWidth;
          if (posX > 0) posX = 0;

          this.moveSlide(posX);
        } else {
          this.moveSlide(this.startPosXContainer - this.containerSlide.offsetWidth);
        }
      } else {
        this.moveSlide(this.startPosXContainer);
      }

      this.startFollowingX = 0;
    }, 0);
  }

  followingMouse(event) {
    let x = (event.pageX || event.changedTouches[0].pageX);
    x -= (this.slider.getBoundingClientRect().left + this.shiftX);
    this.moveSlide(x);
  }

  moveSlide(x) {
    this.containerSlide.style.left = `${x}px`;
  }
}
