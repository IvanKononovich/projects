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

    this.lastClickCoordinates = null;
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

  drawingElements(sector) {
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();
  }
}

const mainCanvas = new MainCanvas(0, 0);

export default mainCanvas;
