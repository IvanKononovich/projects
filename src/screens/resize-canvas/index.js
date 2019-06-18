import mainCanvas from '../main-canvas/index';

class ResizeCanvas {
  constructor() {
    this.resizeButton = document.querySelector('.resize-canvas');
    this.resizeContent = this.resizeButton.querySelector('.resize-canvas__content');

    this.changeViewContent = this.changeViewContent.bind(this);
    this.changeSizeCanvas = this.changeSizeCanvas.bind(this);

    this.inputsSize = this.resizeContent.querySelectorAll('.resize-canvas__input');
    this.inputSizeX = null;
    this.inputSizeY = null;

    [...this.inputsSize].forEach((item) => {
      if (item.classList.contains('resize-canvas__input_x')) {
        this.inputSizeX = item;
      } else {
        this.inputSizeY = item;
      }

      item.addEventListener('keyup', this.changeSizeCanvas);
    });

    mainCanvas.quantitySectorsX = this.inputSizeX.value;
    mainCanvas.quantitySectorsY = this.inputSizeY.value;
    mainCanvas.plots();

    this.resizeButton.addEventListener('click', this.changeViewContent);
  }

  changeViewContent(event) {
    const el = event.target;
    if (!el.classList.contains('resize-canvas')) return;

    this.resizeButton.classList.toggle('resize-canvas_open');
    this.resizeContent.classList.toggle('resize-canvas__content_open');
  }

  changeSizeCanvas(event) {
    const input = event.target;
    input.value = input.value.replace(/\D+/gi, '');

    if (+input.value < input.dataset.min) {
      input.value = input.dataset.min;
    }

    if (+input.value > input.dataset.max) {
      input.value = input.dataset.max;
    }

    mainCanvas.quantitySectorsX = this.inputSizeX.value;
    mainCanvas.quantitySectorsY = this.inputSizeY.value;

    mainCanvas.changeNumberSections();

    mainCanvas.listFrames.forEach((item) => {
      const frame = item;

      frame.listSectors = mainCanvas.listSectors;

      frame.frameCanvas
        .getContext('2d')
        .clearRect(0, 0, frame.frameCanvas.width, frame.frameCanvas.height);

      frame.changeActiveState();
    });
  }
}

const resizeCanvas = new ResizeCanvas();

export default resizeCanvas;
