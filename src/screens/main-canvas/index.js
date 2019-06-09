import pen from '../instruments/pen/index';

const listTools = [pen];

class MainCanvas {
  constructor(x, y) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight / 1.2;
    this.canvas.height = window.innerHeight / 1.2;
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;
    this.listSectors = [];
    this.activeTool = null;

    this.plots();

    this.useActiveTool = this.useActiveTool.bind(this);
    this.subscribeEvents = this.subscribeEvents.bind(this);
    this.unsubscribeEvents = this.unsubscribeEvents.bind(this);

    this.canvas.addEventListener('mousedown', this.subscribeEvents);
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
        color: '#777777',
      });

      sizeX += increaseRatioX;

      if (sizeX + increaseRatioX > this.canvas.width) {
        sizeX = 0;
        sizeY += increaseRatioY;
      }
    }

    this.drawingElements();
  }

  findActiveTool() {
    this.activeTool = listTools.find(tool => tool.state);
  }

  unsubscribeEvents() {
    this.canvas.removeEventListener('mousemove', this.useActiveTool);
    this.canvas.removeEventListener('mouseup', this.unsubscribeEvents);
  }

  subscribeEvents() {
    this.findActiveTool();
    this.canvas.addEventListener('mousemove', this.useActiveTool);
    this.canvas.addEventListener('mouseup', this.unsubscribeEvents);
  }

  useActiveTool(event) {
    const x = event.pageX - this.canvas.getBoundingClientRect().left;
    const y = event.pageY - this.canvas.getBoundingClientRect().top;

    this.listSectors.forEach((sector) => {
      if (MainCanvas.crossingCheck(x, y, 0, 0, sector.x, sector.y, sector.w, sector.h)) {
        if (this.activeTool) {
          this.activeTool.use(sector);
          this.drawingElements();
        }
      }
    });
  }

  static crossingCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 >= x2 || x1 + w1 >= x2) && x1 <= x2 + w2) {
      if ((y1 >= y2 || y1 + h1 >= y2) && y1 <= y2 + h2) {
        return true;
      }
    }

    return false;
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
