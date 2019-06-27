import BasicTool from '../basic-tool/index';

export default class Stroke extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool, pen) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);
    this.startingPoint = null;
    this.endPoint = null;
    this.allPointsLine = null;
    this.allCrossedSectors = null;
    this.startSector = null;
    this.hoverSector = null;

    this.pen = pen;
  }

  use(sect) {
    if (this.typeEvent === 'mousedown') {
      this.startingPoint = {
        x: sect.x,
        y: sect.y,
      };

      this.startSector = sect;
    }

    if (this.typeEvent === 'mouseup') {
      this.allCrossedSectors = null;
    }

    if (this.typeEvent === 'mousemove') {
      this.hoverSector = sect;

      if (this.allCrossedSectors) {
        this.applyColorBeforeChange(this.allCrossedSectors);
      }

      this.endPoint = {
        x: sect.x,
        y: sect.y,
      };

      const allPointsLine = this.findAllPointsLine(
        this.startingPoint.x,
        this.startingPoint.y,
        this.endPoint.x,
        this.endPoint.y,
      );

      this.allCrossedSectors = [];

      allPointsLine.forEach((item) => {
        this.allCrossedSectors.push(this.crossingSectorCheck(item.x, item.y));
      });

      if (this.sizeTool > 1) {
        this.applicationByArea(this.allCrossedSectors);
      }

      this.allCrossedSectors.push(this.startSector, this.hoverSector);

      BasicTool.rememberColorBeforeChanging(this.allCrossedSectors);

      this.paintLine(this.allCrossedSectors);
    }
  }

  paintLine(allCrossedSectors) {
    allCrossedSectors.forEach((item) => {
      this.pen.use(item);

      this.mainCanvas.drawingElements(item, true);
    });
  }
}
