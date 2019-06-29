export default class Preview {
  constructor(mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.previewContainer = document.querySelector('.preview');
    this.animationPlayer = this.previewContainer.querySelector('.preview__animation-player');
    this.fullScreenButton = this.previewContainer.querySelector('.preview__full-screen');

    this.activeFPSButton = this.previewContainer.querySelector('.preview__fps-button_active');
    this.fps = 1000 / this.activeFPSButton.dataset.fps;
    this.activeFrameIndex = 0;

    this.changeFps = this.changeFps.bind(this);
    this.drawingPreviews = this.drawingPreviews.bind(this);
    this.changeScreenMode = this.changeScreenMode.bind(this);

    document.addEventListener('click', this.changeFps);

    this.fullScreenButton.addEventListener('click', () => {
      document.documentElement.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', this.changeScreenMode);

    this.drawingPreviews();
  }

  changeScreenMode() {
    this.previewContainer.classList.toggle('preview_full-screen');
  }

  changeFps(event) {
    const el = event.target;

    if (el.classList.contains('preview__fps-button')) {
      this.activeFPSButton.classList.remove('preview__fps-button_active');
      el.classList.add('preview__fps-button_active');

      this.activeFPSButton = el;
      this.fps = 1000 / this.activeFPSButton.dataset.fps;
    }
  }

  drawingPreviews() {
    const { listFrames } = this.mainCanvas;
    const frame = listFrames[this.activeFrameIndex];

    if (frame) {
      const img = getComputedStyle(frame.frameCanvas).backgroundImage;

      this.animationPlayer.style.backgroundImage = img;
    }

    if (this.activeFrameIndex + 1 < listFrames.length) {
      this.activeFrameIndex += 1;
    } else {
      this.activeFrameIndex = 0;
    }

    setTimeout(() => {
      requestAnimationFrame(this.drawingPreviews);
    }, this.fps);
  }
}
