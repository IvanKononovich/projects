import BasicTool from '../basic-tool/index';

export default class Circle extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool, pen) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);

    this.pen = pen;
  }

  use(sect) {
    this.sect = sect;
  }
}
