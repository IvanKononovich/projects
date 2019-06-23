export default class Layer {
  constructor(mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.layerContainer = document.querySelector('.layer__container');
    this.layerSample = this.layerContainer.querySelector('.layer__instance_sample');
    this.listLayers = [];
    this.activeLayer = null;

    this.layerInteraction = this.layerInteraction.bind(this);

    document.addEventListener('click', this.layerInteraction);
  }

  layerInteraction(event) {
    const el = event.target;

    if (el.classList.contains('layer__button')) {
      const { action } = el.dataset;

      if (action === 'move') {
        const typeAction = el.dataset.move;

        this[`${action}${typeAction}Layer`]();
      } else {
        this[`${action}Layer`]();
      }
    }

    if (el.classList.contains('layer__instance')
    || el.parentNode.classList.contains('layer__instance')) {
      const indexActiveLayer = el.dataset.indexLayer
      || el.parentNode.dataset.indexLayer;

      this.changeActiveLayer(indexActiveLayer);
    }
  }

  changeActiveLayer(index) {
    if (this.activeLayer) {
      this.activeLayer.classList.remove('layer__instance_active');
    }

    this.activeLayer = this.listLayers[index];

    this.activeLayer.classList.add('layer__instance_active');

    this.mainCanvas.activeFrame.activeLayer = index;

    this.makeChangesSectors();
  }

  makeChangesSectors() {
    const index = this.mainCanvas.activeFrame.activeLayer;

    this.mainCanvas.listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.color = sector.layers[index].color;

        this.mainCanvas.drawingElements(sector, false, false);
      });
    });
  }

  changeActiveFrame() {
    const { activeFrame } = this.mainCanvas;

    this.listLayers = [];
    this.layerContainer.innerHTML = '';

    for (let i = 0; i < activeFrame.quantityLayer; i += 1) {
      this.addLayer(true);
    }
  }

  modificationListSectors(action) {
    const { listSectors } = this.mainCanvas;

    listSectors.forEach((row) => {
      row.forEach((item) => {
        const column = item;
        let layer;

        if (!column.layers) {
          column.layers = [];
        }

        if (action === 'push') {
          layer = {
            index: column.layers.length,
            color: column.color,
          };
        }

        column.layers[action](layer);
      });
    });
  }

  layerSequenceRecalculation() {
    this.listLayers.forEach((item, index) => {
      const layer = item;
      const layerTitle = layer.querySelector('.layer__instance-title');

      layer.dataset.indexLayer = index;
      layerTitle.innerHTML = `${layerTitle.dataset.textTitle} - ${index + 1}`;
    });
  }

  deleteLayer() {
    let { indexLayer } = this.activeLayer.dataset;

    const { listSectors } = this.mainCanvas;

    listSectors.forEach((row) => {
      row.forEach((item) => {
        const sector = item;

        sector.layers.splice(indexLayer, 1);

        if (sector.layers.length === 0) {
          sector.layers = undefined;
        }
      });
    });

    this.layerContainer.removeChild(this.activeLayer);

    this.listLayers.splice(indexLayer, 1);

    if (!this.listLayers.length) {
      this.mainCanvas.activeFrame.savingStateSectors();
      return;
    }

    this.layerSequenceRecalculation();

    indexLayer = this.listLayers.length - 1;

    this.changeActiveLayer(indexLayer);

    this.mainCanvas.activeFrame.savingStateSectors();
  }

  addLayer(repeatBuild = false) {
    const copyLayerContent = this.layerSample.cloneNode(true);
    copyLayerContent.classList.remove('layer__instance_sample');
    copyLayerContent.dataset.indexLayer = this.listLayers.length;

    const layerTitle = copyLayerContent.querySelector('.layer__instance-title');
    layerTitle.innerHTML = `${layerTitle.dataset.textTitle} - ${this.listLayers.length + 1}`;

    this.layerContainer.appendChild(copyLayerContent);

    this.listLayers.push(copyLayerContent);


    if (this.activeLayer) {
      this.activeLayer.classList.remove('layer__instance_active');
    }

    this.mainCanvas.activeFrame.activeLayer = this.listLayers.length - 1;

    if (!repeatBuild) {
      this.mainCanvas.activeFrame.quantityLayer = this.listLayers.length;
      this.modificationListSectors('push');
    }

    const indexActiveLayer = this.mainCanvas.activeFrame.activeLayer;
    this.activeLayer = this.listLayers[indexActiveLayer];

    this.activeLayer.classList.add('layer__instance_active');
  }
}
