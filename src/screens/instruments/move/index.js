import BasicTool from '../basic-tool/index';

export default class Move extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);

    this.startingPoint = null;
    this.endPoint = null;

    this.imageCanvas = null;

    this.mainCanvasCtx = this.mainCanvas.canvas.getContext('2d');
    this.shiftCanvasX = null;
    this.shiftCanvasY = null;
  }

  use(item) {
    if (this.typeEvent === 'mousedown') {
      this.startingPoint = item;

      this.imageCanvas = this.mainCanvasCtx.getImageData(0, 0,
        this.mainCanvas.canvas.width,
        this.mainCanvas.canvas.height);

      this.shiftCanvasX = this.startingPoint.x;
      this.shiftCanvasY = this.startingPoint.y;
    }

    if (this.typeEvent === 'mousemove') {
      if (this.endPoint === item) return;

      this.mainCanvasCtx.clearRect(0, 0,
        this.mainCanvas.canvas.width,
        this.mainCanvas.canvas.height);

      this.endPoint = item;

      const x = this.endPoint.x - this.shiftCanvasX;
      const y = this.endPoint.y - this.shiftCanvasY;

      this.mainCanvasCtx.putImageData(this.imageCanvas, x, y);
    }

    if (this.typeEvent === 'mouseup') {
      if (!this.endPoint) return;

      this.calculateNewColorSectors();
      this.endPoint = null;
    }
  }

  calculateNewColorSectors() {
    const shiftRow = this.endPoint.indexRow - this.startingPoint.indexRow;
    const shiftColumn = this.endPoint.indexColumn - this.startingPoint.indexColumn;

    const newListSectors = JSON.parse(JSON.stringify(
      this.mainCanvas.listSectors,
    ));

    newListSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.color = this.mainCanvas.defaultColor;
      });
    });

    this.mainCanvas.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        const newRow = sector.indexRow + shiftRow;
        const newColumn = sector.indexColumn + shiftColumn;

        sector.indexRow = newRow;
        sector.indexColumn = newColumn;

        sector.x = newColumn * sector.w;
        sector.y = newRow * sector.h;

        if (newRow >= newListSectors.length || newRow < 0) return;
        if (newColumn >= newListSectors[newRow].length
          || newColumn < 0) return;

        newListSectors[newRow][newColumn] = JSON.parse(JSON.stringify(sector));
      });
    });

    this.mainCanvas.listSectors = newListSectors;

    this.mainCanvas.drawingAllElements();
  }
}
