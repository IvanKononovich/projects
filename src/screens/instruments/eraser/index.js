import BasicTool from '../basic-tool/index';

export default class Eraser extends BasicTool {
  use(sect) {
    const sector = sect;

    sector.color = this.mainCanvas.defaultColor;
  }
}
