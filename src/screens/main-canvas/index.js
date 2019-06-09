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

    this.lastClickCoordinates = null;

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

  findAllPointsLine(startX, startY, endX, endY) {
    const result = [];
    let time = Math.max(Math.abs(startX - endX), Math.abs(startY - endY));
        
    for (let i = 0; i < time; i++) {
        let delta = i / time;
        result.push({
            x: delta*(endX - startX) + startX, 
            y: delta*(endY - startY) + startY
        });
    } 

    return result;
  }

  unsubscribeEvents() {
    this.canvas.removeEventListener('mousemove', this.useActiveTool);
    this.canvas.removeEventListener('mouseup', this.unsubscribeEvents);
    this.lastClickCoordinates = null;
  }

  subscribeEvents(event) {
    this.useActiveTool(event);
    this.findActiveTool();
    this.canvas.addEventListener('mousemove', this.useActiveTool);
    document.addEventListener('mouseup', this.unsubscribeEvents);
  }

  useActiveTool(event) {
    const x = event.pageX - this.canvas.getBoundingClientRect().left;
    const y = event.pageY - this.canvas.getBoundingClientRect().top;

    const crossingSector = this.crossingSectorCheck(x, y);

    if (this.activeTool) {
      if(this.lastClickCoordinates) {
        const allPointsLine = this.findAllPointsLine(this.lastClickCoordinates.x, this.lastClickCoordinates.y, x, y);
        allPointsLine.forEach((item) => {
          const sector = this.crossingSectorCheck(item.x, item.y)
          this.activeTool.use(sector);
          this.drawingElements(sector);
        });
      } else {
        this.activeTool.use(crossingSector);
        this.drawingElements(crossingSector);
      }
    }

    this.lastClickCoordinates = {
      x,
      y,
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

const mainCanvas = new MainCanvas(35, 35);

export default mainCanvas;
