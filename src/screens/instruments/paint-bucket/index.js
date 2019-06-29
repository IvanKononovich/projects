import BasicTool from '../basic-tool/index';

export default class PaintBucket extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);
    this.permissionUseArea = false;

    this.startingSector = null;
    this.sectorColor = null;
    this.color = null;
  }

  use(item) {
    if (this.typeEvent === 'mouseup') {
      this.startingSector = item;
      this.sectorColor = this.startingSector.color;
      this.color = this.colorPrimary.value;

      if (this.mouseButtonNumber > 0) {
        this.color = this.colorSecondary.value;
      }

      this.identifyingNeighbors();

      this.findingNeighborsWithSameColor(
        this.startingSector,
        this.sectorColor,
        this.color,
      );

      this.deleteNeighbors();
    }
  }
}
