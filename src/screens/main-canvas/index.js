class MainCanvas {
  constructor(x, y) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = Math.round(window.innerHeight / 1.1);
    this.canvas.height = Math.round(window.innerHeight / 1.1);
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;
    this.defaultColor = '#c7c7c7';

    this.listSectors = [];

    this.lastClickCoordinates = null;

    this.plots();
  }

  plots() {
    let sizeX = 0;
    let sizeY = 0;

    const increaseRatioX = Math.round(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.round(this.canvas.height / this.quantitySectorsY);

    this.canvas.width = this.quantitySectorsX * increaseRatioX;
    this.canvas.height = this.quantitySectorsY * increaseRatioY;

    for (let i = 0; i < this.quantitySectorsX * this.quantitySectorsY; i += 1) {
      this.listSectors.push({
        neighbors: [],
        x: sizeX,
        y: sizeY,
        w: increaseRatioX,
        h: increaseRatioY,
        color: this.defaultColor,
      });

      sizeX += increaseRatioX;

      if (sizeX >= this.canvas.width) {
        sizeX = 0;
        sizeY += increaseRatioY;
      }
    }

    this.listSectors.forEach((sector) => {
      this.drawingElements(sector);
    });

    this.identifyingNeighbors();
  }

  identifyingNeighbors() {
    this.listSectors.forEach((item, index) => {
      const previousSectorX = this.listSectors[index - 1];
      const previousSectorY = this.listSectors[index - this.quantitySectorsX];
      const nextSectorX = this.listSectors[index + 1];
      const nextSectorY = this.listSectors[index + this.quantitySectorsX];

      const sector = item;

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
  }

  drawingElements(sector) {
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();
  }
}

const mainCanvas = new MainCanvas(5, 5);

export default mainCanvas;
