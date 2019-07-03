export default class ResizeCanvas {
  constructor(mainCanvas, LoadingSavedData) {
    this.mainCanvas = mainCanvas;
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

  modifyFrame(itemFrame) {
    const frame = itemFrame;

    this.mainCanvas.listSectors.forEach((row, indexRow) => {
      row.forEach((item, indexColumn) => {
        const sector = item;
        const { defaultColor } = this.mainCanvas;

        if (indexRow < frame.listSectors.length) {
          if (indexColumn < frame.listSectors[0].length) {
            const newSector = frame.listSectors[indexRow][indexColumn];

            sector.color = newSector.color;
            return;
          }
        }

        sector.color = defaultColor;
      });
    });

    const copySectors = JSON.parse(JSON.stringify(this.mainCanvas.listSectors));

    frame.listSectors = copySectors;
  }

  changeSizeCanvas() {
    this.mainCanvas.listFrames.forEach((item) => {
      this.mainCanvas.quantitySectorsX = this.inputSizeX.value;
      this.mainCanvas.quantitySectorsY = this.inputSizeY.value;

      this.mainCanvas.plots();

      const frame = item;

      this.modifyFrame(frame);

      frame.savingStateSectors();
    });

    this.mainCanvas.listFrames.forEach((item) => {
      const { activeFrame } = this.mainCanvas;
      const copySectors = JSON.parse(JSON.stringify(activeFrame.listSectors));

      this.mainCanvas.listSectors = copySectors;

      item.changeActiveState();
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
