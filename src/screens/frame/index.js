export default class Frame {
  constructor(frameNumber, listSectors, mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.listSectors = listSectors;
    this.listSectorsState = [];

    this.frameSample = document.querySelector('.frame_sample');

    this.buttonCreateFrame = document.querySelector('.button-create-frame');
    this.frameContent = this.frameSample.cloneNode(true);
    this.frameContent.classList.remove('frame_sample');

    this.frameCanvas = this.frameContent.querySelector('.frame__canvas');
    this.frameCanvas.width = window.innerHeight;
    this.frameCanvas.height = window.innerHeight;

    this.frameContent.dataset.frameNumber = frameNumber;
    this.frameNumberText = this.frameContent.querySelector('.frame__text');
    this.frameNumberText.innerHTML = frameNumber;

    this.frameSample.parentNode.insertBefore(this.frameContent, this.buttonCreateFrame);

    this.changeActiveState = this.changeActiveState.bind(this);

    this.frameContent.addEventListener('click', this.changeActiveState);

    this.state = 'not active';
  }

  changeActiveState() {
    const { activeFrame } = this.mainCanvas;

    if (activeFrame !== this) {
      this.mainCanvas.activeFrame.changeState('not active');
      this.changeState('active');
    }
  }

  makeChangesSectors() {
    this.listSectorsState.forEach((item) => {
      const sector = this.listSectors[item.indexRow][item.indexColumn];

      sector.color = item.color;
      this.mainCanvas.drawingElements(sector);
    });
  }

  savingStateSectors() {
    this.listSectorsState = [];

    this.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.listSectorsState.push({
          indexRow: column.indexRow,
          indexColumn: column.indexColumn,
          color: column.color,
        });
      });
    });
  }

  changeState(state) {
    this.state = state;

    if (this.state === 'active') {
      this.makeChangesSectors();

      this.frameContent.classList.add('frame_active');
    } else {
      this.savingStateSectors();
      this.makeChangesSectors();
      this.drawingAllElements();

      this.frameContent.classList.remove('frame_active');
    }
  }

  drawingAllElements() {
    this.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.drawingElements(column);
      });
    });
  }

  drawingElements(sector) {
    const ctx = this.frameCanvas.getContext('2d');

    ctx.beginPath();

    ctx.fillStyle = sector.color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();
  }
}
