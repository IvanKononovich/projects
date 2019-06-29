import BasicTool from '../basic-tool/index';

export default class MirrorPen extends BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool, pen) {
    super(toolCSSClass, mainCanvas, colorPallete, resizeTool);

    this.pen = pen;
  }

  use(item) {
    const sector = item;
    const mirrorSector = this.findMirrorSector(sector);

    this.pen.use(sector);
    this.pen.use(mirrorSector);
  }

  findMirrorSector(item) {
    const { listSectors } = this.mainCanvas;

    const columnLength = listSectors[0].length - 1;

    const { indexRow } = item;
    const indexColumn = columnLength - item.indexColumn;

    const mirrorSector = listSectors[indexRow][indexColumn];

    return mirrorSector;
  }
}
