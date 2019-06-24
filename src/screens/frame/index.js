export default class Frame {
  constructor(frameNumber, mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.listSectorsState = [];

    this.pseudoFrameSample = document.querySelector('.pseudo-frame_sample');
    this.pseudoFrame = this.pseudoFrameSample.cloneNode(true);
    this.pseudoFrame.classList.remove('pseudo-frame_sample');

    this.frameSample = document.querySelector('.frame_sample');
    this.framesContainer = this.frameSample.parentNode;
    this.scrollTopContainer = this.framesContainer.scrollTop;

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
    this.subscribeEventsToMove = this.subscribeEventsToMove.bind(this);
    this.unsubscribeEventsToMove = this.unsubscribeEventsToMove.bind(this);
    this.followingMouse = this.followingMouse.bind(this);

    this.shiftY = null;

    this.frameContent.addEventListener('click', this.frameInteraction);
    this.frameContent.addEventListener('mousedown', this.subscribeEventsToMove);
    this.framesContainer.onwheel = () => false;

    this.state = 'not active';
  }

  frameCheckMouseOver(mouseX, mouseY) {
    let result = null;
    const x = mouseX;
    const y = mouseY;

    this.mainCanvas.listFrames.forEach((item) => {
      const frame = item;
      const { frameContent } = frame;

      if (frameContent !== this.frameContent) {
        const frameX = frameContent.getBoundingClientRect().left;
        const frameY = frameContent.getBoundingClientRect().top;
        const frameWidth = frameContent.offsetWidth;
        const frameHeight = frameContent.offsetHeight;

        if (x > frameX && x < frameX + frameWidth) {
          if (y > frameY && y < frameY + frameHeight) {
            result = frame;
          }
        }
      }
    });

    return result;
  }

  calcShiftY(event) {
    const framesContainerTop = this.framesContainer.getBoundingClientRect().top;
    const frameContentTop = this.frameContent.getBoundingClientRect().top;

    const y = event.pageY - framesContainerTop;

    this.shiftY = y - (frameContentTop - framesContainerTop);
  }

  cancelScroll() {
    this.framesContainer.scrollTop = this.scrollTopContainer;
  }

  calcScrollTopContainer() {
    this.scrollTopContainer = this.framesContainer.scrollTop;
  }

  subscribeEventsToMove(event) {
    this.calcShiftY(event);

    document.addEventListener('mousemove', this.followingMouse);
    document.addEventListener('mouseup', this.unsubscribeEventsToMove);
  }

  unsubscribeEventsToMove() {
    this.frameContent.classList.remove('frame_move');
    this.frameContent.style.top = '0';

    if (this.framesContainer.contains(this.pseudoFrame)) {
      this.framesContainer.removeChild(this.pseudoFrame);
    }

    document.removeEventListener('mousemove', this.followingMouse);
    document.removeEventListener('mouseup', this.unsubscribeEventsToMove);
  }

  swapFrames(event) {
    const frameMouseOver = this.frameCheckMouseOver(event.pageX, event.pageY);

    if (frameMouseOver) {
      let indexNewPlace = this.frameNumber;

      if (frameMouseOver.frameNumber > indexNewPlace) {
        indexNewPlace -= 1;
      }

      this.moveAroundDOM(indexNewPlace, this.framesContainer, frameMouseOver.frameContent);
      frameMouseOver.isSwap = true;

      this.mainCanvas.listFrames[this.frameNumber - 1] = frameMouseOver;
      this.mainCanvas.listFrames[frameMouseOver.frameNumber - 1] = this;

      this.mainCanvas.frameSequenceRecalculation();
    }
  }

  followingMouse(event) {
    this.calcScrollTopContainer();

    if (!this.framesContainer.contains(this.pseudoFrame)) {
      this.moveAroundDOM(this.frameNumber, this.framesContainer, this.pseudoFrame);
    }

    const framesContainerTop = this.framesContainer.getBoundingClientRect().top;
    const y = event.pageY - framesContainerTop - this.shiftY + this.scrollTopContainer;

    if (!this.frameContent.classList.contains('frame_move')) {
      this.frameContent.classList.add('frame_move');
    }

    this.frameContent.style.top = `${y}px`;

    this.swapFrames(event);
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

  moveAroundDOM(index, parentElement, element) {
    if (index < this.mainCanvas.listFrames.length) {
      const nextFrameHTML = this.mainCanvas.listFrames[index].frameContent;
      parentElement.insertBefore(element, nextFrameHTML);
    } else {
      parentElement.insertBefore(element, this.buttonCreateFrame);
    }
  }

  cloneFrame() {
    this.changeActiveState();

    const frame = new Frame(this.frameNumber + 1, this.mainCanvas);

    this.moveAroundDOM(this.frameNumber, frame.framesContainer, frame.frameContent);

    this.mainCanvas.listFrames.splice(this.frameNumber, 0, frame);

    this.changeState('not active');

    frame.changeActiveState();

    frame.drawingElements();

    this.mainCanvas.frameSequenceRecalculation();
    this.mainCanvas.findActiveFrame();
  }

  changeActiveState() {
    this.mainCanvas.activeFrame.changeState('not active');
    this.changeState('active');
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
      const row = item.indexRow;
      const column = item.indexColumn;

      if (row < this.mainCanvas.listSectors.length) {
        if (column < this.mainCanvas.listSectors[row].length) {
          const sector = this.mainCanvas.listSectors[row][column];

          sector.color = item.color;
          sector.layers = item.layers;

          if (sector.layers) {
            this.quantityLayer = sector.layers.length;
            const index = this.activeLayer || this.quantityLayer - 1;

            if (index !== undefined) {
              sector.color = sector.layers[index].color;
            }
          }

          this.mainCanvas.drawingElements(sector, true);
        }
      }
    });

    this.drawingElements();
  }

  savingStateSectors() {
    this.listSectorsState = [];

    this.mainCanvas.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.listSectorsState.push({
          indexRow: column.indexRow,
          indexColumn: column.indexColumn,
          color: column.color,
          layers: column.layers,
        });
      });
    });
  }

  changeState(state) {
    this.state = state;

    if (this.state === 'active') {
      this.mainCanvas.findActiveFrame();

      this.makeChangesSectors();

      this.frameContent.classList.add('frame_active');

      if (this.mainCanvas.layer) {
        this.mainCanvas.layer.changeActiveFrame();
      }
    } else {
      this.savingStateSectors();
      this.drawingElements();

      this.frameContent.classList.remove('frame_active');
    }
  }

  drawingElements() {
    const image = this.mainCanvas.canvas.toDataURL('png');
    this.frameCanvas.style.backgroundImage = `url(${image})`;
  }
}
