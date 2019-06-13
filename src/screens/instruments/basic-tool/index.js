import mainCanvas from '../../main-canvas/index';

export default class BasicTool {
  constructor(toolCSSClass) {
    this.mainCanvas = mainCanvas;
    this.mainCanvasContent = this.mainCanvas.canvas;
    this.state = false;
    this.color = '#292929';
    this.toolCSSClass = toolCSSClass;
    this.toolButton = document.querySelector(`.${this.toolCSSClass}`);

    this.lastClickCoordinates = null;

    this.stateChange = this.stateChange.bind(this);
    this.subscribeEvents = this.subscribeEvents.bind(this);
    this.unsubscribeEvents = this.unsubscribeEvents.bind(this);
    this.useActiveTool = this.useActiveTool.bind(this);

    this.mainCanvasContent.addEventListener('mousedown', this.subscribeEvents);
    document.addEventListener('click', this.stateChange);
  }

  static findAllPointsLine(startX, startY, endX, endY) {
    const result = [];
    const time = Math.max(Math.abs(startX - endX), Math.abs(startY - endY));

    for (let i = 0; i < time; i += 1) {
      const delta = i / time;
      result.push({
        x: delta * (endX - startX) + startX,
        y: delta * (endY - startY) + startY,
      });
    }

    return result;
  }

  crossingSectorCheck(x, y) {
    const increaseRatioX = Math.floor(this.mainCanvasContent.width
      / this.mainCanvas.quantitySectorsX);
    const increaseRatioY = Math.floor(this.mainCanvasContent.height
      / this.mainCanvas.quantitySectorsY);

    const coordSectorX = Math.floor(x / increaseRatioX);
    const coordSectorY = Math.floor(y / increaseRatioY);
    const indexSector = this.mainCanvas.quantitySectorsX * coordSectorY + coordSectorX;

    return this.mainCanvas.listSectors[indexSector];
  }

  applicationToolSector(x, y) {
    const sector = this.crossingSectorCheck(x, y);
    if (this.use) this.use(sector);
    this.mainCanvas.drawingElements(sector);
  }

  useActiveTool(event) {
    const x = event.pageX - this.mainCanvasContent.getBoundingClientRect().left;
    const y = event.pageY - this.mainCanvasContent.getBoundingClientRect().top;

    if (this.lastClickCoordinates) {
      const lastCordX = this.lastClickCoordinates.x;
      const lastCordY = this.lastClickCoordinates.y;
      const allPointsLine = BasicTool.findAllPointsLine(lastCordX, lastCordY, x, y);

      allPointsLine.forEach((item) => {
        this.applicationToolSector(item.x, item.y);
      });
    } else {
      this.applicationToolSector(x, y);
    }

    this.lastClickCoordinates = {
      x,
      y,
    };
  }

  unsubscribeEvents() {
    this.mainCanvasContent.removeEventListener('mousemove', this.useActiveTool);
    this.mainCanvasContent.removeEventListener('mouseup', this.unsubscribeEvents);

    this.lastClickCoordinates = null;
  }

  subscribeEvents(event) {
    if (!this.state) return;

    this.useActiveTool(event);

    this.mainCanvasContent.addEventListener('mousemove', this.useActiveTool);
    document.addEventListener('mouseup', this.unsubscribeEvents);
  }

  stateChange(event) {
    const el = event.target;

    if (el.classList.contains('instrument-item__img')) {
      if (el.classList.contains(this.toolCSSClass)) {
        this.state = true;
        this.toolButton.classList.add('instrument-item__img_active');
      } else {
        this.state = false;
        this.toolButton.classList.remove('instrument-item__img_active');
      }
    }
  }
}
