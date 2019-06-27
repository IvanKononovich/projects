import BasicTool from '../basic-tool/index';

export default class Dithering extends BasicTool {
  use(item) {
    const sector = item;

    let color = this.colorPrimary.value;

    const conditionRow = sector.indexRow % 2 === 0;
    const conditionColumn = sector.indexColumn % 2 === 0;
    const conditionMouseButton = this.mouseButtonNumber > 0;

    if ((!conditionRow && !conditionColumn)
    || (conditionRow && conditionColumn)) {
      color = this.colorPrimary.value;

      if (conditionMouseButton) {
        color = this.colorSecondary.value;
      }
    }

    if ((!conditionRow && conditionColumn)
    || (conditionRow && !conditionColumn)) {
      color = this.colorSecondary.value;

      if (conditionMouseButton) {
        color = this.colorPrimary.value;
      }
    }

    sector.color = color;

    this.mainCanvas.drawingElements(sector, true);
  }
}
