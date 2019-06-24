import BasicTool from '../basic-tool/index';

export default class PipetteColor extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);
    this.permissionUseArea = false;
  }

  use(sect) {
    if (this.typeEvent === 'mouseup') {
      const sector = sect;
      const { color } = sector;

      this.colorPallete.changeColor(color);
    }
  }
}
