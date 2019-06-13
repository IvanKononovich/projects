import BasicTool from '../basic-tool/index';

class Pen extends BasicTool {
  use(sect) {
    const sector = sect;
    let color = this.colorPrimary;

    if (this.mouseButtonNumber > 0) {
      color = this.colorSecondary;
    }

    sector.color = color;
  }
}

const pen = new Pen('instrument-item__img_pen');

export default pen;
