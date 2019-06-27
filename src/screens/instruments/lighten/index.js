import tinycolor from 'tinycolor2';
import BasicTool from '../basic-tool/index';

export default class Lighten extends BasicTool {
  use(item) {
    if (this.typeEvent === 'mouseup') return;

    const sector = item;
    let { color } = sector;

    if (color === this.mainCanvas.defaultColor) return;

    if (this.mouseButtonNumber > 0) {
      color = tinycolor(color).lighten(3);
    } else {
      color = tinycolor(color).darken(3);
    }

    color = color.toHexString();
    sector.color = color;

    this.mainCanvas.drawingElements(sector, true);
  }
}
