export default class ResizeTool {
  constructor() {
    this.containerButtons = document.querySelector('.resize-tool');
    this.activeButton = this.containerButtons.querySelector('.resize-tool__button-size_active');
    this.listButtonSize = this.containerButtons.querySelectorAll('.resize-tool__button-size');

    this.size = this.activeButton.dataset.size;

    this.hotKey = null;
    this.createHotKey();

    this.changeStateButton = this.changeStateButton.bind(this);
    this.pendingForHotkey = this.pendingForHotkey.bind(this);

    document.addEventListener('click', this.changeStateButton);
    document.addEventListener('keypress', this.pendingForHotkey);
  }

  pendingForHotkey(event) {
    const newKey = String.fromCharCode(event.keyCode).toLowerCase();

    const objKeys = Object.keys(this.hotKey);

    objKeys.forEach((key) => {
      const hotKey = this.hotKey[key].key.toLowerCase();

      if (hotKey === newKey) {
        const arg = this.hotKey[key].arguments;
        const { action } = this.hotKey[key];

        this[action](arg);
      }
    });
  }

  createHotKey() {
    this.hotKey = {
      size1: {
        key: null,
        arguments: 1,
        action: 'changeStateButton',
      },
      size2: {
        key: null,
        arguments: 2,
        action: 'changeStateButton',
      },
      size3: {
        key: null,
        arguments: 3,
        action: 'changeStateButton',
      },
      size4: {
        key: null,
        arguments: 4,
        action: 'changeStateButton',
      },
    };
  }

  changeStateButton(event) {
    let el;

    if (typeof event === 'number') {
      el = this.listButtonSize[event - 1];
    } else {
      el = event.target;
    }

    if (this.containerButtons.contains(el)) {
      this.activeButton.classList.remove('resize-tool__button-size_active');
      el.classList.add('resize-tool__button-size_active');

      this.activeButton = el;

      this.size = this.activeButton.dataset.size;
    }
  }
}
