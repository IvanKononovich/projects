export default class BasicTool {
  constructor(toolCSSClass, mainCanvas, colorPallete, resizeTool) {
    this.mainCanvas = mainCanvas;
    this.state = false;
    this.mouseButtonNumber = 0;
    this.resizeTool = resizeTool;
    this.sizeTool = this.resizeTool.size;
    this.permissionUseArea = true;
    this.event = null;
    this.lastMouseSector = null;

    this.colorPallete = colorPallete;
    this.colorPrimary = colorPallete.colorPrimary;
    this.colorSecondary = colorPallete.colorSecondary;

    this.toolCSSClass = toolCSSClass;
    this.toolButton = document.querySelector(`.${this.toolCSSClass}`);

    this.hotKey = null;

    this.lastClickCoordinates = null;

    this.stateChange = this.stateChange.bind(this);
    this.subscribeEvents = this.subscribeEvents.bind(this);
    this.unsubscribeEvents = this.unsubscribeEvents.bind(this);
    this.useActiveTool = this.useActiveTool.bind(this);
    this.pendingForHotkey = this.pendingForHotkey.bind(this);

    this.mainCanvas.canvas.addEventListener('mousedown', this.subscribeEvents);
    this.mainCanvas.canvas.addEventListener('mouseout', () => {
      this.lastClickCoordinates = null;
    });

    this.mainCanvas.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    document.addEventListener('click', this.stateChange);

    document.addEventListener('keypress', this.pendingForHotkey);
  }

  pendingForHotkey(event) {
    const key = String.fromCharCode(event.keyCode).toLowerCase();

    if (key === this.hotKey) {
      this.state = true;
      this.toolButton.classList.add('instrument-item__img_active');
    } else if (BasicTool.checkHotkeyForTools(key)) {
      this.state = false;
      this.toolButton.classList.remove('instrument-item__img_active');
    }
  }

  static checkHotkeyForTools(key) {
    let result = false;

    window.listTools.forEach((item) => {
      const toolHotKey = item.hotKey;

      if (toolHotKey === key) {
        result = true;
      }
    });

    return result;
  }

  findAllPointsLine(startX, startY, endX, endY) {
    const sector = this.mainCanvas.listSectors[0][0];
    const widthSector = sector.w;
    const heightSector = sector.h;

    const result = new Set();
    const resultInArr = [];
    const time = Math.max(Math.abs(startX - endX), Math.abs(startY - endY)) / 4.5;

    for (let i = 0; i < time; i += 1) {
      const delta = i / time;

      let x = delta * (endX - startX) + startX;
      x -= x % widthSector;
      let y = delta * (endY - startY) + startY;
      y -= y % heightSector;

      result.add(JSON.stringify({
        x,
        y,
      }));
    }

    result.forEach((item) => {
      resultInArr.push(JSON.parse(item));
    });

    return resultInArr;
  }

  crossingSectorCheck(x, y) {
    const sector = this.mainCanvas.listSectors[0][0];

    const widthSector = sector.w;
    const heightSector = sector.h;

    const coordSectorX = Math.floor(x / widthSector);
    let coordSectorY = Math.floor(y / heightSector);

    if (coordSectorY > this.mainCanvas.listSectors.length - 1) {
      coordSectorY = this.mainCanvas.listSectors.length - 1;
    }

    return this.mainCanvas.listSectors[coordSectorY][coordSectorX];
  }

  applicationToolAreaSector(sector) {
    const startRow = sector.indexRow - Math.floor(this.sizeTool / 2);
    const endRow = sector.indexRow + Math.ceil(this.sizeTool / 2);
    const startColumn = sector.indexColumn - Math.floor(this.sizeTool / 2);
    const endColumn = sector.indexColumn + Math.ceil(this.sizeTool / 2);

    const { listSectors } = this.mainCanvas;

    const result = [];

    for (let row = startRow; row < endRow; row += 1) {
      for (let column = startColumn; column < endColumn; column += 1) {
        const conditionRow = row < listSectors.length && row >= 0;
        const conditionColumn = column < listSectors[0].length && column >= 0;

        if (conditionRow && conditionColumn) {
          result.push(listSectors[row][column]);
        }
      }
    }

    return result;
  }

  applicationToolSector(x, y) {
    this.sizeTool = this.resizeTool.size;

    let sectors = [this.crossingSectorCheck(x, y)];

    if (!sectors[0]) return;

    if (this.sizeTool > 1 && this.permissionUseArea) {
      sectors = this.applicationToolAreaSector(...sectors);
    }

    if (this.use) {
      this.colorPrimary = this.colorPallete.colorPrimary;
      this.colorSecondary = this.colorPallete.colorSecondary;

      sectors.forEach((sector) => {
        this.use(sector);
      });
    }
  }

  applicationByArea(listSector) {
    const allCrossedAreaSector = new Set();

    listSector.forEach((item) => {
      const areaSector = this.applicationToolAreaSector(item);

      areaSector.forEach((sector) => {
        allCrossedAreaSector.add(sector);
      });
    });

    allCrossedAreaSector.forEach((item) => {
      listSector.add(item);
    });
  }

  applyColorBeforeChange(listSector) {
    listSector.forEach((item) => {
      const sector = item;

      sector.color = sector.previousColor;

      this.mainCanvas.drawingElements(sector, true);
    });
  }

  static rememberColorBeforeChanging(listSector) {
    listSector.forEach((item) => {
      const sector = item;

      sector.previousColor = sector.color;
    });
  }

  useActiveTool(event) {
    this.typeEvent = event.type;

    const x = event.pageX - this.mainCanvas.canvas.getBoundingClientRect().left;
    const y = event.pageY - this.mainCanvas.canvas.getBoundingClientRect().top;

    if (this.lastClickCoordinates) {
      const lastCordX = this.lastClickCoordinates.x;
      const lastCordY = this.lastClickCoordinates.y;
      const allPointsLine = this.findAllPointsLine(lastCordX, lastCordY, x, y);

      allPointsLine.forEach((item) => {
        this.applicationToolSector(item.x, item.y);
      });
    } else {
      this.applicationToolSector(x, y);
    }

    this.lastClickCoordinates = {
      x,
      y,
    };
  }

  unsubscribeEvents(event) {
    this.lastMouseSector = null;

    this.lastClickCoordinates = null;

    this.useActiveTool(event);

    this.mainCanvas.canvas.removeEventListener('mousemove', this.useActiveTool);
    document.removeEventListener('mouseup', this.unsubscribeEvents);

    this.lastClickCoordinates = null;

    this.mainCanvas.activeFrame.drawingElements();
  }

  subscribeEvents(event) {
    this.mouseButtonNumber = event.button;

    if (!this.state) return;

    this.useActiveTool(event);

    this.mainCanvas.canvas.addEventListener('mousemove', this.useActiveTool);
    document.addEventListener('mouseup', this.unsubscribeEvents);
  }

  stateChange(event) {
    const el = event.target;

    if (el.classList.contains('instrument-item__img')) {
      if (el.classList.contains(this.toolCSSClass)) {
        this.state = true;
        this.toolButton.classList.add('instrument-item__img_active');
      } else {
        this.state = false;
        this.toolButton.classList.remove('instrument-item__img_active');
      }
    }
  }

  deleteNeighbors() {
    const { listSectors } = this.mainCanvas;

    listSectors.forEach((row) => {
      row.forEach((column) => {
        const sector = column;
        sector.check = false;
        delete sector.neighbors;
      });
    });
  }

  identifyingNeighbors() {
    const { listSectors } = this.mainCanvas;

    listSectors.forEach((row, indexRow) => {
      row.forEach((column, indexColumn) => {
        let previousSectorX = null;
        let previousSectorY = null;
        let nextSectorX = null;
        let nextSectorY = null;

        if (indexRow > 0) {
          previousSectorY = listSectors[indexRow - 1][indexColumn];
        }

        if (indexColumn > 0) {
          previousSectorX = listSectors[indexRow][indexColumn - 1];
        }

        if (indexColumn + 1 < row.length) {
          nextSectorX = listSectors[indexRow][indexColumn + 1];
        }

        if (indexRow + 1 < listSectors.length) {
          nextSectorY = listSectors[indexRow + 1][indexColumn];
        }

        const sector = column;

        sector.neighbors = [
          previousSectorX,
          nextSectorX,
          previousSectorY,
          nextSectorY,
        ];

        sector.neighbors = sector.neighbors.filter((neighbor) => {
          if (neighbor) return neighbor;
          return false;
        });
      });
    });
  }

  chengNeighborsSectorColor(item, listNeighbors, result, color1, color2) {
    const neighbor = item;
    neighbor.check = true;

    const { defaultColor } = this.mainCanvas;

    if (!color1 && neighbor.color !== defaultColor) {
      this.mainCanvas.drawingElements(neighbor, true);

      listNeighbors.push(neighbor);
      result.add(neighbor);
    } else if (neighbor.color === color1) {
      neighbor.color = color2;
      this.mainCanvas.drawingElements(neighbor, true);

      listNeighbors.push(neighbor);
      result.add(neighbor);
    }
  }

  findingNeighborsWithSameColor(startingSector, colorCondition, newColor) {
    const result = new Set();

    const listNeighbors = [...startingSector.neighbors];

    while (listNeighbors.length > 0) {
      const tempNode = listNeighbors.shift();

      tempNode.neighbors.forEach((item) => {
        if (item.check) return;
        this.chengNeighborsSectorColor(item, listNeighbors, result, colorCondition, newColor);
      });
    }

    return result;
  }
}
