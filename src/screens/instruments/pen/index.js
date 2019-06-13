import BasicTool from '../basic-tool/index';

class Pen extends BasicTool {
  use(sect) {
    const sector = sect;

    sector.color = this.color;
  }
}

const pen = new Pen('instrument-item__img_pen');

export default pen;
