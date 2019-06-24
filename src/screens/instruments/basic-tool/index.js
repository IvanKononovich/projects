// import mainCanvas from '../../main-canvas/index';
// import colorPallete from '../../color-palette/index';
// import resizeTool from '../../resize-tool/index';

export default class BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    this.mainCanvas = mainCanvas;
    this.mainCanvasContent = this.mainCanvas.canvas;
    this.state = false;
    this.mouseButtonNumber = 0;
    this.resizeTool = resizeTool;
    this.sizeTool = this.resizeTool.size;
    this.permissionUseArea = true;
    this.typeEvent = null;

    this.colorPallete = colorPallete;
    this.colorPrimary = colorPallete.colorPrimary;
    this.colorSecondary = colorPallete.colorSecondary;

    this.toolCSSClass = toolCSSClass;
    this.toolButton = document.querySelector(`.${this.toolCSSClass}`);

    this.lastClickCoordinates = null;

    this.stateChange = this.stateChange.bind(this);
    this.subscribeEvents = this.subscribeEvents.bind(this);
    this.unsubscribeEvents = this.unsubscribeEvents.bind(this);
    this.useActiveTool = this.useActiveTool.bind(this);

    this.mainCanvasContent.addEventListener('mousedown', this.subscribeEvents);
    this.mainCanvasContent.addEventListener('mouseout', () => {
      this.lastClickCoordinates = null;
    });

    this.mainCanvasContent.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

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

    return this.mainCanvas.listSectors[coordSectorY][coordSectorX];
  }

  applicationToolAreaSector(sector) {
    const startRow = sector.indexRow - Math.floor(this.sizeTool / 2);
    const endRow = sector.indexRow + Math.ceil(this.sizeTool / 2);
    const startColumn = sector.indexColumn - Math.floor(this.sizeTool / 2);
    const endColumn = sector.indexColumn + Math.ceil(this.sizeTool / 2);

    const { listSectors } = this.mainCanvas;

    const result = [];

    for (let row = startRow; row < endRow; row += 1) {
      for (let column = startColumn; column < endColumn; column += 1) {
        const conditionRow = row < listSectors.length && row >= 0;
        const conditionColumn = column < listSectors[0].length && column >= 0;

        if (conditionRow && conditionColumn) {
          result.push(listSectors[row][column]);
        }
      }
    }

    return result;
  }

  applicationToolSector(x, y) {
    this.sizeTool = this.resizeTool.size;

    let sectors = [this.crossingSectorCheck(x, y)];

    if (!sectors[0]) return;

    if (this.sizeTool > 1 && this.permissionUseArea) {
      sectors = this.applicationToolAreaSector(...sectors);
    }

    if (this.use) {
      this.colorPrimary = this.colorPallete.colorPrimary;
      this.colorSecondary = this.colorPallete.colorSecondary;

      sectors.forEach((sector) => {
        this.use(sector);
        this.mainCanvas.drawingElements(sector, true);
      });
    }
  }

  useActiveTool(event) {
    this.typeEvent = event.type;

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

  unsubscribeEvents(event) {
    this.lastClickCoordinates = null;

    this.useActiveTool(event);

    this.mainCanvasContent.removeEventListener('mousemove', this.useActiveTool);
    document.removeEventListener('mouseup', this.unsubscribeEvents);

    this.lastClickCoordinates = null;

    this.mainCanvas.activeFrame.drawingElements();
  }

  subscribeEvents(event) {
    this.mouseButtonNumber = event.button;

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
