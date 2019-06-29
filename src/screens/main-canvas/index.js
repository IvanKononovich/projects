export default class MainCanvas {
  constructor(x, y, FrameClass) {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight;
    this.canvas.height = window.innerHeight;
    this.quantitySectorsX = x;
    this.quantitySectorsY = y;

    this.totalQuantitySectors = 0;
    this.defaultColor = '#ffffff00';

    this.listSectors = [];
    this.listFrames = [];
    this.activeFrame = null;
    this.buttonCreateFrame = null;
    this.FrameClass = FrameClass;

    this.hotKey = null;
    this.createHotKey();

    this.lastClickCoordinates = null;

    this.createFrame = this.createFrame.bind(this);
    this.pendingForHotkey = this.pendingForHotkey.bind(this);

    Promise.resolve().then(() => {
      this.createFrame();
      this.findActiveFrame();

      this.buttonCreateFrame = this.listFrames[0].buttonCreateFrame;
      this.buttonCreateFrame.addEventListener('click', this.createFrame);
    });

    document.addEventListener('keypress', this.pendingForHotkey);
  }

  createHotKey() {
    this.hotKey = {
      createframe: {
        key: null,
        arguments: true,
        action: 'createFrame',
      },
      cloneframe: {
        key: null,
        arguments: null,
        action: 'cloneActiveFrame',
      },
      selectpreviousframe: {
        key: null,
        arguments: -1,
        action: 'selectNewFrame',
      },
      selectnextframe: {
        key: null,
        arguments: 1,
        action: 'selectNewFrame',
      },
    };
  }

  cloneActiveFrame() {
    this.activeFrame.cloneFrame();
  }

  selectNewFrame(number) {
    let indexActiveFrame = this.listFrames.findIndex(frame => this.activeFrame === frame);

    indexActiveFrame += number;

    if (indexActiveFrame < 0) {
      indexActiveFrame = 0;
    }

    if (indexActiveFrame > this.listFrames.length - 1) {
      indexActiveFrame = this.listFrames.length - 1;
    }

    this.listFrames[indexActiveFrame].changeActiveState();
  }

  pendingForHotkey(event) {
    const newKey = String.fromCharCode(event.keyCode).toLowerCase();

    const objKeys = Object.keys(this.hotKey);

    objKeys.forEach((key) => {
      if (!this.hotKey[key].key) return;

      const hotKey = this.hotKey[key].key.toLowerCase();

      if (hotKey === newKey) {
        const arg = this.hotKey[key].arguments;
        const { action } = this.hotKey[key];

        this[action](arg);
      }
    });
  }

  frameSequenceRecalculation() {
    this.listFrames.forEach((item, index) => {
      const frame = item;

      frame.frameNumber = index + 1;
      frame.frameNumberText.innerHTML = index + 1;
    });
  }

  createFrame(activity = true, createNew = true) {
    if (activity) {
      this.findActiveFrame();

      if (this.activeFrame) {
        this.activeFrame.changeState('not active');
      }
    }

    this.clearLayers();

    const frame = new this.FrameClass(this.listFrames.length + 1, this);

    frame.listSectors = JSON.parse(JSON.stringify(this.listSectors));

    this.listFrames.push(frame);

    if (activity) {
      frame.changeState('active');
    }

    frame.framesContainer.scrollTop = frame.framesContainer.scrollHeight;

    if (createNew) {
      this.drawingAllElementsColor(this.defaultColor);
    }
  }

  clearLayers() {
    this.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.layers = null;
      });
    });
  }

  drawingAllElementsColor(color) {
    this.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.color = color;
        this.drawingElements(sector, true);
      });
    });

    if (!this.activeFrame) return;

    this.activeFrame.drawingElements();
  }

  drawingAllElements(drawingFrame = true) {
    this.listSectors.forEach((row) => {
      row.forEach((column) => {
        this.drawingElements(column, true);
      });
    });

    if (!this.activeFrame) return;
    if (!drawingFrame) return;

    this.activeFrame.drawingElements();
  }

  setExactSizeCanvas() {
    const increaseRatioX = Math.floor(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.floor(this.canvas.height / this.quantitySectorsY);

    this.canvas.width = Math.floor(this.quantitySectorsX * increaseRatioX);
    this.canvas.style.width = `${this.canvas.width}px`;
    this.canvas.height = Math.floor(this.quantitySectorsY * increaseRatioY);
    this.canvas.style.height = `${this.canvas.height}px`;
  }

  plots() {
    this.listSectors = [[]];
    this.totalQuantitySectors = this.quantitySectorsX * this.quantitySectorsY;

    let sizeX = 0;
    let sizeY = 0;

    const increaseRatioX = Math.floor(this.canvas.width / this.quantitySectorsX);
    const increaseRatioY = Math.floor(this.canvas.height / this.quantitySectorsY);

    this.setExactSizeCanvas();

    for (let i = 0; i < this.quantitySectorsX * this.quantitySectorsY; i += 1) {
      this.listSectors[Math.floor(sizeY / increaseRatioY)].push({
        x: sizeX,
        y: sizeY,
        w: increaseRatioX,
        h: increaseRatioY,
        color: this.defaultColor,
        indexRow: Math.floor(sizeY / increaseRatioY),
        indexColumn: Math.floor(sizeX / increaseRatioX),
      });

      sizeX += increaseRatioX;

      if (sizeX >= this.canvas.width) {
        sizeX = 0;
        sizeY += increaseRatioY;
        this.listSectors.push([]);
      }
    }

    this.listSectors.pop();
  }

  findActiveFrame() {
    this.listFrames.forEach((frame) => {
      if (frame.state === 'active') {
        this.activeFrame = frame;
      }
    });
  }

  drawingElements(item, allElements, changeLayersColor = true) {
    const sector = item;
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();

    ctx.clearRect(
      sector.x,
      sector.y,
      sector.w,
      sector.h,
    );

    const { color } = sector;

    if (sector.layers && changeLayersColor) {
      const index = this.activeFrame.activeLayer;

      if (index !== undefined) {
        sector.layers[index].color = color;
      }
    }

    ctx.fillStyle = color;
    ctx.rect(sector.x, sector.y, sector.w, sector.h);
    ctx.fill();

    if (!this.activeFrame || allElements) return;

    this.activeFrame.drawingElements();
  }
}
