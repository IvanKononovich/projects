export default class MainCanvas {
  constructor(x, y, FrameClass) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight;
    this.canvas.height = window.innerHeight;
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;

    this.totalQuantitySectors = 0;
    this.defaultColor = 'transparent';

    this.listSectors = [];
    this.listFrames = [];
    this.activeFrame = null;
    this.buttonCreateFrame = null;
    this.FrameClass = FrameClass;

    this.lastClickCoordinates = null;

    this.createFrame = this.createFrame.bind(this);

    Promise.resolve().then(() => {
      this.createFrame();
      this.findActiveFrame();

      this.buttonCreateFrame = this.listFrames[0].buttonCreateFrame;
      this.buttonCreateFrame.addEventListener('click', this.createFrame);
    });
  }

  frameSequenceRecalculation() {
    this.listFrames.forEach((item, index) => {
      const frame = item;

      frame.frameNumber = index + 1;
      frame.frameNumberText.innerHTML = index + 1;
    });
  }

  createFrame(activity = true) {
    if (activity) {
      this.findActiveFrame();

      if (this.activeFrame) {
        this.activeFrame.changeState('not active');
      }
    }

    this.clearLayers();

    const frame = new this.FrameClass(this.listFrames.length + 1, this);
    this.listFrames.push(frame);

    if (activity) {
      frame.changeState('active');
    }

    this.drawingAllElementsColor(this.defaultColor);
  }

  clearLayers() {
    this.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.layers = null;
      });
    });
  }

  drawingAllElementsColor(color) {
    this.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.color = color;
        this.drawingElements(sector, true);
      });
    });

    if (!this.activeFrame) return;

    this.activeFrame.drawingElements();
  }

  drawingAllElements() {
    this.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.drawingElements(column, true);
      });
    });

    if (!this.activeFrame) return;

    this.activeFrame.drawingElements();
  }

  plots() {
    this.listSectors = [[]];
    this.totalQuantitySectors = this.quantitySectorsX * this.quantitySectorsY;

    let sizeX = 0;
    let sizeY = 0;

    const increaseRatioX = Math.round(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.round(this.canvas.height / this.quantitySectorsY);

    this.canvas.width = this.quantitySectorsX * increaseRatioX;
    this.canvas.height = this.quantitySectorsY * increaseRatioY;

    for (let i = 0; i < this.quantitySectorsX * this.quantitySectorsY; i += 1) {
      this.listSectors[Math.floor(sizeY / increaseRatioY)].push({
        neighbors: [],
        x: sizeX,
        y: sizeY,
        w: increaseRatioX,
        h: increaseRatioY,
        color: this.defaultColor,
        indexRow: Math.floor(sizeY / increaseRatioY),
        indexColumn: Math.floor(sizeX / increaseRatioX),
      });

      sizeX += increaseRatioX;

      if (sizeX >= this.canvas.width) {
        sizeX = 0;
        sizeY += increaseRatioY;
        this.listSectors.push([]);
      }
    }

    this.listSectors.pop();

    this.drawingAllElements();

    if (this.activeFrame) {
      this.activeFrame.listSectors = this.listSectors;
    }
  }

  changeNumberSections() {
    const listModifiedSections = [];

    this.listSectors.forEach((row, indexRow) => {
      row.forEach((column, indexColumn) => {
        if (column.color !== this.defaultColor) {
          listModifiedSections.push({
            color: column.color,
            indexRow,
            indexColumn,
          });
        }
      });
    });

    this.plots();

    listModifiedSections.forEach((item) => {
      if (this.listSectors.length > item.indexRow) {
        if (this.listSectors[item.indexRow].length > item.indexColumn) {
          const sector = this.listSectors[item.indexRow][item.indexColumn];
          sector.color = item.color;
        }
      }
    });

    this.drawingAllElements();
  }

  findActiveFrame() {
    this.listFrames.forEach((frame) => {
      if (frame.state === 'active') {
        this.activeFrame = frame;
      }
    });
  }

  drawingElements(item, allElements, changeLayersColor = true) {
    const sector = item;
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.clearRect(sector.x, sector.y, sector.w, sector.h);

    const { color } = sector;

    if (sector.layers && changeLayersColor) {
      const index = this.activeFrame.activeLayer;

      if (index !== undefined) {
        sector.layers[index].color = color;
      }
    }

    ctx.fillStyle = color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();

    this.findActiveFrame();

    if (!this.activeFrame || allElements) return;

    this.activeFrame.drawingElements();
  }
}
