class MainCanvas {
  constructor() {
    this.canvas = document.querySelector('.main-canvas');
    this.canvas.width = window.innerHeight / 1.2;
    this.canvas.height = window.innerHeight / 1.2;
  }
}

const mainCanvas = new MainCanvas();

export default mainCanvas;
