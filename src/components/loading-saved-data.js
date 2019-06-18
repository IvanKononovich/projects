export default class LoadingSavedData {
  constructor(mainCanvas) {
    this.mainCanvas = mainCanvas;
    this.saveData = this.saveData.bind(this);

    window.addEventListener('beforeunload', this.saveData);

    if (localStorage.listFrames) {
      this.loadData();
      localStorage.clear();
    }
  }

  static JSONFramesConversion(list) {
    const result = [];

    list.forEach((item) => {
      const frame = item;

      if (frame.state === 'active') {
        frame.savingStateSectors();
      }

      result.push(JSON.stringify(frame.listSectorsState));
    });

    return JSON.stringify(result);
  }

  saveData() {
    const JSONListFrames = LoadingSavedData.JSONFramesConversion(this.mainCanvas.listFrames);

    localStorage.setItem('listFrames', JSONListFrames);
  }

  loadData() {
    const listFrames = JSON.parse(localStorage.listFrames);
    const initFrame = this.mainCanvas.listFrames[0];
    initFrame.framesContainer.removeChild(initFrame.frameContent);
    this.mainCanvas.listFrames.splice(0, 1);

    listFrames.forEach((item) => {
      const list = JSON.parse(item);

      this.mainCanvas.createFrame();
      this.mainCanvas.findActiveFrame();
      this.mainCanvas.activeFrame.listSectorsState = list;
      this.mainCanvas.activeFrame.makeChangesSectors();
    });
  }
}
