import BasicTool from '../basic-tool/index';

export default class Rectangle extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool, pen) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);

    this.pen = pen;

    this.startingPoint = null;
    this.endPoint = null;
    this.startSector = null;

    this.rectangleSectors = null;
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
      this.rectangleSectors = null;
    }

    if (this.typeEvent === 'mousemove') {
      if (this.rectangleSectors) {
        this.applyColorBeforeChange(this.rectangleSectors);
      }

      this.endPoint = {
        x: sect.x,
        y: sect.y,
      };

      this.createBorder();

      BasicTool.rememberColorBeforeChanging(this.rectangleSectors);

      this.paintLine(this.rectangleSectors);
    }
  }

  findSectorOnLine(x1, y1, x2, y2) {
    const startPoint = this.crossingSectorCheck(x1, y1);
    const endPoint = this.crossingSectorCheck(x2, y2);
    let crossedSectors = [];

    const indexRow1 = Math.min(
      startPoint.indexRow,
      endPoint.indexRow,
    );

    let indexRow2 = Math.max(
      startPoint.indexRow,
      endPoint.indexRow,
    );

    const indexColumn1 = Math.min(
      startPoint.indexColumn,
      endPoint.indexColumn,
    );

    let indexColumn2 = Math.max(
      startPoint.indexColumn,
      endPoint.indexColumn,
    );

    if (startPoint.indexColumn > endPoint.indexColumn) {
      indexColumn2 += 1;
    }

    if (startPoint.indexRow > endPoint.indexRow) {
      indexRow2 += 1;
    }

    if (y1 === y2) {
      crossedSectors = this.mainCanvas
        .listSectors[indexRow1]
        .slice(
          indexColumn1,
          indexColumn2,
        );
    } else {
      for (let i = indexRow1; i < indexRow2; i += 1) {
        crossedSectors.push(
          this.mainCanvas
            .listSectors[i][indexColumn1],
        );
      }
    }

    crossedSectors.push(this.startSector);
    return crossedSectors;
  }

  paintLine(allCrossedSectors) {
    allCrossedSectors.forEach((item) => {
      this.pen.use(item);

      this.mainCanvas.drawingElements(item, true);
    });
  }

  createBorder() {
    const topBorder = this.findSectorOnLine(
      this.startingPoint.x,
      this.startingPoint.y,
      this.endPoint.x,
      this.startingPoint.y,
    );

    const bottomBorder = this.findSectorOnLine(
      this.startingPoint.x,
      this.endPoint.y,
      this.endPoint.x,
      this.endPoint.y,
    );

    const leftBorder = this.findSectorOnLine(
      this.startingPoint.x,
      this.startingPoint.y,
      this.startingPoint.x,
      this.endPoint.y,
    );

    if (this.endPoint.y > this.startingPoint.y) {
      const { height } = this.mainCanvas.canvas;
      const { quantitySectorsY } = this.mainCanvas;

      const sectorHeight = height / quantitySectorsY;

      this.endPoint.y += sectorHeight;
    }

    const rightBorder = this.findSectorOnLine(
      this.endPoint.x,
      this.startingPoint.y,
      this.endPoint.x,
      this.endPoint.y,
    );

    this.rectangleSectors = new Set([
      ...topBorder,
      ...bottomBorder,
      ...leftBorder,
      ...rightBorder,
    ]);

    if (this.sizeTool > 1) {
      this.applicationByArea(this.rectangleSectors);
    }
  }
}
