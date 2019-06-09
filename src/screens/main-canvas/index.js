import pen from '../instruments/pen/index';

const listTools = [pen];

class MainCanvas {
  constructor(x, y) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = Math.round(window.innerHeight / 1.2);
    this.canvas.height = Math.round(window.innerHeight / 1.2);
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

    const increaseRatioX = Math.round(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.round(this.canvas.height / this.quantitySectorsY);

    this.canvas.width = this.quantitySectorsX * increaseRatioX;
    this.canvas.height = this.quantitySectorsY * increaseRatioY;

    for (let i = 0; i < this.quantitySectorsX * this.quantitySectorsY; i += 1) {
      this.listSectors.push({
        x: sizeX,
        y: sizeY,
        w: increaseRatioX,
        h: increaseRatioY,
        color: '#777777',
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

    const crossingSector = this.crossingSectorCheck(x, y);

    if (this.activeTool) {
      this.activeTool.use(crossingSector);
      this.drawingElements(crossingSector);
    }
  }

  crossingSectorCheck(x, y) {
    const increaseRatioX = Math.floor(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.floor(this.canvas.height / this.quantitySectorsY);

    const coordSectorX = Math.floor(x / increaseRatioX);
    const coordSectorY = Math.floor(y / increaseRatioY);
    const indexSector = this.quantitySectorsX * coordSectorY + coordSectorX;

    return this.listSectors[indexSector];
  }

  drawingElements(sector) {
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();
  }
}

const mainCanvas = new MainCanvas(135, 135);

export default mainCanvas;
