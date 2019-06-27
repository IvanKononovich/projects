import BasicTool from '../basic-tool/index';

export default class Eraser extends BasicTool {
  use(item) {
    const sector = item;

    sector.color = this.mainCanvas.defaultColor;

    this.mainCanvas.drawingElements(sector, true);
  }
}
