import BasicTool from '../basic-tool/index';

export default class ShapeSelection extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);

    this.permissionUseArea = false;

    this.startingPoint = null;
    this.endPoint = null;

    this.listNeighbors = [];
    this.cleaningList = [];
  }

  use(item) {
    const sector = item;

    if (sector === this.endPoint) return;


    if (this.typeEvent === 'mousedown') {
      if (sector.color === this.mainCanvas.defaultColor) return;

      this.startingPoint = item;

      this.identifyingNeighbors();

      this.listNeighbors = this.findingNeighborsWithSameColor(
        sector,
      );

      this.deleteNeighbors();

      this.saveListSectors = JSON.parse(JSON.stringify(
        this.mainCanvas.listSectors,
      ));

      this.listNeighbors.forEach((neighbor) => {
        const sectorNeighbor = neighbor;
        const row = sectorNeighbor.indexRow;
        const column = sectorNeighbor.indexColumn;

        this.saveListSectors[row][column].color = this.mainCanvas.defaultColor;
      });
    }

    if (this.typeEvent === 'mousemove') {
      if (!this.startingPoint) return;

      this.endPoint = item;

      this.moveSectors();
    }

    if (this.typeEvent === 'mouseup') {
      this.endPoint = null;
      this.mainCanvas.listSectors = JSON.parse(JSON.stringify(this.newListSectors));
      this.mainCanvas.drawingAllElements();
    }
  }

  moveSectors() {
    const shiftRow = this.endPoint.indexRow - this.startingPoint.indexRow;
    const shiftColumn = this.endPoint.indexColumn - this.startingPoint.indexColumn;

    this.newListSectors = JSON.parse(JSON.stringify(
      this.saveListSectors,
    ));
    const { newListSectors } = this;

    this.cleaningList.forEach((item) => {
      const sector = item;
      this.clearSector(sector);
    });

    this.cleaningList = [];

    this.listNeighbors.forEach((item) => {
      const sector = item;

      const row = sector.indexRow;
      const column = sector.indexColumn;

      const newRow = row + shiftRow;
      const newColumn = column + shiftColumn;

      if (newRow >= newListSectors.length || newRow < 0) return;
      if (newColumn >= newListSectors[newRow].length
        || newColumn < 0) return;

      const nextSector = newListSectors[newRow][newColumn];

      this.cleaningList.push(nextSector);
      nextSector.color = sector.color;
      this.mainCanvas.drawingElements(nextSector, true);
    });

    this.mainCanvas.listSectors = newListSectors;
    this.mainCanvas.drawingAllElements(false);
  }

  clearSector(sector) {
    const ctx = this.mainCanvas.canvas.getContext('2d');
    ctx.clearRect(sector.x, sector.y, sector.w, sector.h);
  }
}
