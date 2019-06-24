export default class ResizeCanvas {
  constructor(mainCanvas, LoadingSavedData, layer) {
    this.mainCanvas = mainCanvas;
    this.layer = layer;
    this.resizeButton = document.querySelector('.resize-canvas');
    this.resizeContent = this.resizeButton.querySelector('.resize-canvas__content');

    this.changeViewContent = this.changeViewContent.bind(this);
    this.changeValueInputs = this.changeValueInputs.bind(this);

    this.inputsSize = this.resizeContent.querySelectorAll('.resize-canvas__input');
    this.inputSizeX = null;
    this.inputSizeY = null;

    this.loadingSavedData = null;

    [...this.inputsSize].forEach((item) => {
      if (item.classList.contains('resize-canvas__input_x')) {
        this.inputSizeX = item;
      } else {
        this.inputSizeY = item;
      }

      item.addEventListener('keyup', this.changeValueInputs);
    });

    this.mainCanvas.quantitySectorsX = this.inputSizeX.value;
    this.mainCanvas.quantitySectorsY = this.inputSizeY.value;
    this.mainCanvas.plots();

    this.resizeButton.addEventListener('click', this.changeViewContent);

    Promise.resolve().then(() => {
      this.loadingSavedData = new LoadingSavedData(this.mainCanvas, this);
    });
  }

  changeViewContent(event) {
    const el = event.target;
    if (!el.classList.contains('resize-canvas')) return;

    this.resizeButton.classList.toggle('resize-canvas_open');
    this.resizeContent.classList.toggle('resize-canvas__content_open');
  }

  changeSizeCanvas(removeLayers = false) {
    this.mainCanvas.quantitySectorsX = this.inputSizeX.value;
    this.mainCanvas.quantitySectorsY = this.inputSizeY.value;

    this.mainCanvas.changeNumberSections();

    this.mainCanvas.listFrames.forEach((item) => {
      const frame = item;

      frame.frameCanvas.backgroundImage = 'none';
      frame.frameCanvas.backgroundColor = this.mainCanvas.defaultColor;

      if (removeLayers) {
        this.layer.layerContainer.innerHTML = '';
        this.layer.listLayers = [];
        frame.quantityLayer = 0;
      }

      frame.changeActiveState();

      if (!frame.quantityLayer) return;

      this.layer.changeActiveFrame();
      this.layer.changeActiveLayer(frame.activeLayer);
    });
  }

  changeValueInputs(event) {
    const input = event.target;
    input.value = input.value.replace(/\D+/gi, '');

    if (+input.value < input.dataset.min) {
      input.value = input.dataset.min;
    }

    if (+input.value > input.dataset.max) {
      input.value = input.dataset.max;
    }

    this.changeSizeCanvas(true);
  }
}
