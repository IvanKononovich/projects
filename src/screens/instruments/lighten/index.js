import tinycolor from 'tinycolor2';
import BasicTool from '../basic-tool/index';

export default class Lighten extends BasicTool {
  use(item) {
    if (this.lastMouseSector === item) return;

    if (this.typeEvent === 'mouseup') return;

    const sector = item;
    let { color } = sector;
    let stepChangeColor = 3;

    if (color === this.mainCanvas.defaultColor) return;

    if (this.sizeTool > 1) {
      stepChangeColor = 0.3;
    }

    if (this.mouseButtonNumber > 0) {
      color = tinycolor(color).lighten(stepChangeColor);
    } else {
      color = tinycolor(color).darken(stepChangeColor);
    }

    color = color.toHexString();
    sector.color = color;

    this.mainCanvas.drawingElements(sector, true);

    this.lastMouseSector = sector;
  }
}
