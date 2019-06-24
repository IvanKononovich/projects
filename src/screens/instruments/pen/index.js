import BasicTool from '../basic-tool/index';

export default class Pen extends BasicTool {
  use(sect) {
    const sector = sect;
    let color = this.colorPrimary.value;

    if (this.mouseButtonNumber > 0) {
      color = this.colorSecondary.value;
    }

    sector.color = color;
  }
}
