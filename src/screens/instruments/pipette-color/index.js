import BasicTool from '../basic-tool/index';

class PipetteColor extends BasicTool {
  constructor() {
    super('instrument-item__img_pipette');
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

const pipetteColor = new PipetteColor('instrument-item__img_pipette');

export default pipetteColor;
