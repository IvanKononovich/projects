import gifshot from 'gifshot';
import mainCanvas from '../main-canvas/index';

class ExportFile {
  constructor() {
    this.mainCanvas = mainCanvas;
    this.listPicturesFrames = null;

    this.exportInteraction = this.exportInteraction.bind(this);

    this.exportLink = document.querySelector('.export__link');
    this.exportContainer = document.querySelector('.export');

    document.addEventListener('click', this.exportInteraction);
  }

  exportInteraction(event) {
    const el = event.target;

    if (el.classList.contains('export__link')) {
      this.createGIF(event);
    }

    if (el.classList.contains('export')) {
      this.openExportContainer();
    }
  }

  openExportContainer() {
    this.exportContainer.classList.toggle('export_open');
  }

  createListFrames() {
    this.listPicturesFrames = [];

    this.mainCanvas.listFrames.forEach((frame) => {
      const img = frame.frameCanvas.toDataURL('png');

      this.listPicturesFrames.push(img);
    });
  }

  createGIF(event) {
    if (!event.isTrusted) return;

    if (this.exportLink.getAttribute('href') === '#') {
      event.preventDefault();
    }

    this.createListFrames();

    const fps = this.mainCanvas.preview.fps / 1000;

    gifshot.createGIF({
      images: this.listPicturesFrames,
      interval: fps,
    }, (obj) => {
      if (!obj.error) {
        const { image } = obj;

        this.exportLink.setAttribute('href', image);
        this.exportLink.click();
        this.exportLink.setAttribute('href', '#');
      }
    });
  }
}

const exportFile = new ExportFile();

export default exportFile;
