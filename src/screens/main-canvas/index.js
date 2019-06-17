import Frame from '../frame/index';

class MainCanvas {
  constructor(x, y) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight;
    this.canvas.height = window.innerHeight;
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;

    this.totalQuantitySectors = 0;
    this.defaultColor = '#c7c7c7';

    this.listSectors = [];
    this.listFrames = [];
    this.activeFrame = null;
    this.buttonCreateFrame = null;

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

  createFrame() {
    if (this.activeFrame) {
      this.activeFrame.changeState('not active');
    }

    const frame = new Frame(this.listFrames.length + 1, this.listSectors, this);

    frame.changeState('active');
    frame.drawingAllElements();

    this.listFrames.push(frame);

    this.findActiveFrame();

    this.drawingAllElementsColor(this.defaultColor);
  }

  drawingAllElementsColor(color) {
    this.listSectors.forEach((row) => {
      row.forEach((item) => {
        const column = item;

        column.color = color;
        this.drawingElements(column);
      });
    });
  }

  drawingAllElements() {
    this.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.drawingElements(column);
      });
    });
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

    this.identifyingNeighbors();

    if (this.activeFrame) {
      this.activeFrame.listSectors = this.listSectors;
    }
  }

  identifyingNeighbors() {
    this.listSectors.forEach((row, indexRow) => {
      row.forEach((column, indexColumn) => {
        let previousSectorX = null;
        let previousSectorY = null;
        let nextSectorX = null;
        let nextSectorY = null;

        if (indexRow > 0) {
          previousSectorY = this.listSectors[indexRow - 1][indexColumn];
        }

        if (indexColumn > 0) {
          previousSectorX = this.listSectors[indexRow][indexColumn - 1];
        }

        if (indexColumn + 1 < row.length) {
          nextSectorX = this.listSectors[indexRow][indexColumn + 1];
        }

        if (indexRow + 1 < this.listSectors.length) {
          nextSectorY = this.listSectors[indexRow + 1][indexColumn];
        }

        const sector = column;

        sector.neighbors.push(
          previousSectorX,
          nextSectorX,
          previousSectorY,
          nextSectorY,
        );

        sector.neighbors = sector.neighbors.filter((neighbor) => {
          if (neighbor) return neighbor;
          return false;
        });
      });
    });
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

  drawingElements(sector) {
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();

    this.findActiveFrame();

    if (!this.activeFrame) return;

    this.activeFrame.drawingElements(sector);
  }
}

const mainCanvas = new MainCanvas(0, 0);

export default mainCanvas;
