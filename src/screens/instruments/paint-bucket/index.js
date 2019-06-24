import BasicTool from '../basic-tool/index';

export default class PaintBucket extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);
    this.permissionUseArea = false;

    this.listNeighbors = [];
    this.checkedSectors = 0;
    this.startingSector = null;
    this.sectorColor = null;
    this.color = null;
  }

  use(item) {
    if (this.typeEvent === 'mouseup') {
      this.chengSectorColor = this.chengSectorColor.bind(this);

      this.listNeighbors = [];
      this.checkedSectors = 0;
      this.startingSector = item;
      this.sectorColor = this.startingSector.color;
      this.color = this.colorPrimary.value;

      if (this.mouseButtonNumber > 0) {
        this.color = this.colorSecondary.value;
      }

      this.identifyingNeighbors();

      this.findingNeighborsWithSameColor(this.startingSector);
    }
  }

  identifyingNeighbors() {
    const { listSectors } = this.mainCanvas;

    listSectors.forEach((row, indexRow) => {
      row.forEach((column, indexColumn) => {
        let previousSectorX = null;
        let previousSectorY = null;
        let nextSectorX = null;
        let nextSectorY = null;

        if (indexRow > 0) {
          previousSectorY = listSectors[indexRow - 1][indexColumn];
        }

        if (indexColumn > 0) {
          previousSectorX = listSectors[indexRow][indexColumn - 1];
        }

        if (indexColumn + 1 < row.length) {
          nextSectorX = listSectors[indexRow][indexColumn + 1];
        }

        if (indexRow + 1 < listSectors.length) {
          nextSectorY = listSectors[indexRow + 1][indexColumn];
        }

        const sector = column;

        sector.neighbors.push(
          previousSectorX,
          nextSectorX,
          previousSectorY,
          nextSectorY,
        );

        sector.neighbors = sector.neighbors.filter((neighbor) => {
          if (neighbor) return neighbor;
          return false;
        });
      });
    });
  }

  chengSectorColor(item) {
    const neighbor = item;

    if (neighbor.color === this.sectorColor) {
      neighbor.color = this.color;
      this.mainCanvas.drawingElements(neighbor, true);
      this.listNeighbors.push(neighbor);
    }
  }

  findingNeighborsWithSameColor(startingSector) {
    this.listNeighbors.push(...startingSector.neighbors);
    this.listNeighbors = this.listNeighbors.filter(item => item.color === this.sectorColor);

    while (this.listNeighbors.length > 0) {
      if (this.checkedSectors > this.mainCanvas.totalQuantitySectors) {
        this.listNeighbors = [];
        break;
      }

      this.checkedSectors += 1;

      const tempNode = this.listNeighbors.shift();

      tempNode.neighbors.forEach(this.chengSectorColor);
    }

    this.startingSector.color = this.color;
    this.mainCanvas.drawingElements(startingSector, true);
  }
}
