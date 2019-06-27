import BasicTool from '../basic-tool/index';

export default class PipetteColor extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);
    this.permissionUseArea = false;
  }

  use(item) {
    if (this.typeEvent === 'mouseup') {
      const sector = item;
      const { color } = sector;

      this.colorPallete.changeColor(color);
    }
  }
}
