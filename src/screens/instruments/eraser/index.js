import BasicTool from '../basic-tool/index';

class Eraser extends BasicTool {
  use(sect) {
    const sector = sect;

    sector.color = this.mainCanvas.defaultColor;
  }
}

const eraser = new Eraser('instrument-item__img_eraser');

export default eraser;
