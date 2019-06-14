import BasicTool from '../basic-tool/index';

class PaintBucket extends BasicTool {
  use(item) {
    if (this.typeEvent === 'mouseup') {
      this.findingNeighborsWithSameColor = this.findingNeighborsWithSameColor.bind(this);
      this.chengSectorColor = this.chengSectorColor.bind(this);

      this.listNeighbors = [];
      this.checkedSectors = 0;
      this.startingSector = item;
      this.sectorColor = this.startingSector.color;
      this.color = this.colorPrimary.value;

      if (this.mouseButtonNumber > 0) {
        this.color = this.colorSecondary.value;
      }

      this.findingNeighborsWithSameColor(this.startingSector);
    }
  }

  chengSectorColor(item) {
    const neighbor = item;

    if (neighbor.color === this.sectorColor) {
      neighbor.color = this.color;
      this.mainCanvas.drawingElements(neighbor);
      this.listNeighbors.push(neighbor);
    }
  }

  findingNeighborsWithSameColor(startingSector) {
    this.listNeighbors.push(...startingSector.neighbors);

    while (this.listNeighbors.length > 0) {
      if (this.checkedSectors > this.mainCanvas.totalQuantitySectors) this.listNeighbors = [];
      this.checkedSectors += 1;

      const tempNode = this.listNeighbors.shift();

      tempNode.neighbors.forEach(this.chengSectorColor);
    }
  }
}

const paintBucket = new PaintBucket('instrument-item__img_bucket');

export default paintBucket;
