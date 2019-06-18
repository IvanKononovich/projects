export default class Preview {
  constructor(mainCanvas) {
    this.mainCanvas = mainCanvas;
    this.listFrames = this.mainCanvas.listFrames;

    this.canvasPreview = document.querySelector('.preview__canvas');
    this.canvasPreview.width = this.mainCanvas.canvas.width;
    this.canvasPreview.height = this.mainCanvas.canvas.height;

    this.activeFPSButton = document.querySelector('.preview__fps-button_active');
    this.fps = 1000 / this.activeFPSButton.dataset.fps;
    this.activeFrameIndex = 0;

    this.changeFps = this.changeFps.bind(this);
    this.drawingPreviews = this.drawingPreviews.bind(this);

    document.addEventListener('click', this.changeFps);

    this.drawingPreviews();
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
    const frame = this.listFrames[this.activeFrameIndex];

    if (frame) {
      const { activeFrame } = this.mainCanvas;

      frame.makeChangesSectors();

      frame.listSectors.forEach((row) => {
        row.forEach((sector) => {
          this.drawingElements(sector);
        });
      });

      activeFrame.makeChangesSectors();
    }

    if (this.activeFrameIndex + 1 < this.listFrames.length) {
      this.activeFrameIndex += 1;
    } else {
      this.activeFrameIndex = 0;
    }

    setTimeout(() => {
      requestAnimationFrame(this.drawingPreviews);
    }, this.fps);
  }

  drawingElements(sector) {
    const ctx = this.canvasPreview.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();
  }
}
