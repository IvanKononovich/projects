export default class Frame {
  constructor(frameNumber, listSectors, mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.listSectors = listSectors;
    this.listSectorsState = [];

    this.frameSample = document.querySelector('.frame_sample');
    this.framesContainer = this.frameSample.parentNode;

    this.buttonCreateFrame = document.querySelector('.button-create-frame');
    this.frameContent = this.frameSample.cloneNode(true);
    this.frameContent.classList.remove('frame_sample');

    this.frameCanvas = this.frameContent.querySelector('.frame__canvas');
    this.frameCanvas.width = window.innerHeight;
    this.frameCanvas.height = window.innerHeight;

    this.frameNumber = frameNumber;
    this.frameNumberText = this.frameContent.querySelector('.frame__text');
    this.frameNumberText.innerHTML = this.frameNumber;

    this.framesContainer.insertBefore(this.frameContent, this.buttonCreateFrame);

    this.frameInteraction = this.frameInteraction.bind(this);

    this.frameContent.addEventListener('click', this.frameInteraction);

    this.state = 'not active';
  }

  deleteFrame() {
    if (this.mainCanvas.listFrames.length < 2) return;

    if (this.state === 'active') {
      if (this.frameNumber > 1) {
        this.mainCanvas.listFrames[this.frameNumber - 2].changeActiveState();
      } else {
        this.mainCanvas.listFrames[1].changeActiveState();
      }
    }

    this.mainCanvas.listFrames.splice(this.frameNumber - 1, 1);
    this.framesContainer.removeChild(this.frameContent);

    this.mainCanvas.frameSequenceRecalculation();
  }

  cloneFrame() {
    this.mainCanvas.activeFrame.changeState('not active');
    this.changeActiveState();

    const frame = new Frame(this.frameNumber + 1, this.listSectors, this.mainCanvas);

    if (this.frameNumber < this.mainCanvas.listFrames.length) {
      const nextFrameHTML = this.mainCanvas.listFrames[this.frameNumber].frameContent;
      frame.framesContainer.insertBefore(frame.frameContent, nextFrameHTML);
    }

    this.mainCanvas.listFrames.splice(this.frameNumber, 0, frame);

    this.changeState('not active');
    frame.changeActiveState();

    frame.drawingAllElements();

    this.mainCanvas.frameSequenceRecalculation();
  }

  changeActiveState() {
    this.mainCanvas.findActiveFrame();
    const { activeFrame } = this.mainCanvas;

    if (activeFrame !== this) {
      this.mainCanvas.activeFrame.changeState('not active');
      this.changeState('active');
    }
  }

  frameInteraction(event) {
    const el = event.target;

    if (el === this.frameCanvas) {
      this.changeActiveState();
    }

    if (el.classList.contains('frame__button')) {
      this[`${el.dataset.action}Frame`]();
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
