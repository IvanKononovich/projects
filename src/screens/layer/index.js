export default class Layer {
  constructor(mainCanvas) {
    this.mainCanvas = mainCanvas;

    this.layerContainer = document.querySelector('.layer__container');
    this.layerSample = this.layerContainer.querySelector('.layer__instance_sample');
    this.listLayers = [];

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

  addLayer() {
    const copyLayerContent = this.layerSample.cloneNode(true);
    copyLayerContent.classList.remove('layer__instance_sample');

    const titleTitle = copyLayerContent.querySelector('.layer__instance-title');
    titleTitle.innerHTML += ` - ${this.listLayers.length + 1}`;

    this.layerContainer.appendChild(copyLayerContent);

    this.listLayers.push(copyLayerContent);

    this.modificationListSectors('push');
  }
}
