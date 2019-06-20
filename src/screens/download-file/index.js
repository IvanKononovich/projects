import gifshot from 'gifshot';
import mainCanvas from '../main-canvas/index';

class ExportFile {
  constructor() {
    this.mainCanvas = mainCanvas;
    this.listPicturesFrames = null;

    this.exportContainer = document.querySelector('.export');
    this.exportLink = this.exportContainer.querySelector('.export__link');
    this.exportInput = this.exportContainer.querySelectorAll('.export__input');
    this.exportLoadingContainer = this.exportContainer.querySelector('.export__loading-container');
    this.gifWidth = null;
    this.gifHeight = null;
    this.gifName = null;

    this.exportInteraction = this.exportInteraction.bind(this);
    this.changeValueInputs = this.changeValueInputs.bind(this);

    [...this.exportInput].forEach((item) => {
      item.addEventListener('keyup', this.changeValueInputs);

      if (item.dataset.dataType === 'number') {
        this[`gif${item.dataset.size}`] = +item.value;
      } else {
        this.gifName = item.value;
      }
    });

    document.addEventListener('click', this.exportInteraction);
  }

  changeValueInputs(event) {
    const input = event.target;

    if (input.dataset.dataType === 'number') {
      input.value = input.value.replace(/\D+/gi, '');

      if (+input.value > +input.dataset.sizeMax) {
        input.value = input.dataset.sizeMax;
      }

      if (+input.value < +input.dataset.sizeMin 
        || input.value === '') {
        input.value = input.dataset.sizeMin;
      }

      this[`gif${input.dataset.size}`] = +input.value;
    } else {
      this.gifName = input.value;
    }
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
    if (!event.isTrusted) {
      return;
    }
    this.exportLoadingContainer.classList.add('export__loading-container_open');


    if (this.exportLink.getAttribute('href') === '#') {
      event.preventDefault();
    }

    this.createListFrames();

    const fps = this.mainCanvas.preview.fps / 1000;

    gifshot.createGIF({
      gifWidth: this.gifWidth,
      gifHeight: this.gifHeight,
      images: this.listPicturesFrames,
      interval: fps,
    }, (obj) => {
      if (!obj.error) {
        const { image } = obj;

        this.exportLink.setAttribute('href', image);
        this.exportLink.setAttribute('download', `${this.gifName}.gif`);

        this.exportLink.click();

        this.exportLink.setAttribute('href', '#');
        this.exportLoadingContainer.classList.remove('export__loading-container_open');
      }
    });
  }
}

const exportFile = new ExportFile();

export default exportFile;
