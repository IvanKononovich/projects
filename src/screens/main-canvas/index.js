class MainCanvas {
  constructor(x, y) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight / 1.2;
    this.canvas.height = window.innerHeight / 1.2;
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;
    this.listSectors = [];

    this.plots();
  }

  plots() {
    let sizeX = 0;
    let sizeY = 0;
    const increaseRatioX = this.canvas.width / this.quantitySectorsX;
    const increaseRatioY = this.canvas.height / this.quantitySectorsY;

    for (let i = 0; sizeY < this.canvas.height; i += 1) {
      this.listSectors.push({
        x: sizeX,
        y: sizeY,
        w: increaseRatioX,
        h: increaseRatioY,
        color: '#000',
      });

      sizeX += increaseRatioX;

      if (sizeX + increaseRatioX > this.canvas.width) {
        sizeX = 0;
        sizeY += increaseRatioY;
      }
    }

    this.drawingElements();
  }

  drawingElements() {
    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.listSectors.forEach((sector) => {
      ctx.beginPath();

      ctx.fillStyle = sector.color;
      ctx.rect(sector.x, sector.y, sector.w, sector.h);
      ctx.fill();
    });
  }
}

const mainCanvas = new MainCanvas(64, 64);

export default mainCanvas;
