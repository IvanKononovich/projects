import BasicTool from '../basic-tool/index';

export default class PaintAllPixels extends BasicTool {
  use() {
    let color = this.colorPrimary.value;

    if (this.mouseButtonNumber > 0) {
      color = this.colorSecondary.value;
    }

    this.mainCanvas.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;
        sector.color = color;
      });
    });

    this.mainCanvas.defaultColor = color;

    this.mainCanvas.drawingAllElements();
  }
}
