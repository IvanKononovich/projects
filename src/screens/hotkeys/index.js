export default class HotKeys {
  constructor(listComponents) {
    this.listComponents = listComponents;

    this.hotkeysButton = document.querySelector('.hotkeys');
    this.hotkeysContainer = this.hotkeysButton.querySelector('.hotkeys__container');
    this.hotkeysButtonClose = this.hotkeysContainer.querySelector('.hotkeys__close');
    this.hotkeysInputWrappers = this.hotkeysButton.querySelectorAll('.hotkeys__input-wrapper');
    this.activeInput = null;
    this.listHotKeys = new Set();
    this.pendingPressed = false;

    this.changeHotkey = this.changeHotkey.bind(this);
    this.pendingNewKey = this.pendingNewKey.bind(this);
    this.openHotkeysContainer = this.openHotkeysContainer.bind(this);

    this.hotkeysButton.addEventListener('click', this.openHotkeysContainer);

    this.addDefaultKey();
  }

  addDefaultKey() {
    [...this.hotkeysInputWrappers].forEach((item) => {
      const inputHotKey = item.querySelector('.hotkeys__input');
      const key = inputHotKey.dataset.defaultKey;
      inputHotKey.innerHTML = key;

      this.listHotKeys.add(inputHotKey.innerHTML);
      this.listHotKeys[inputHotKey.innerHTML] = inputHotKey;

      this.activeInput = inputHotKey;

      this.makeChangesHotkeys(key);

      item.addEventListener('click', this.changeHotkey);
    });
  }

  openHotkeysContainer(event) {
    const { target } = event;

    if (target === this.hotkeysButton
    || target === this.hotkeysButtonClose) {
      this.hotkeysContainer.classList.toggle('hotkeys__container_open');

      if (this.pendingPressed) {
        this.removeActiveInput();
      }
    }
  }

  changeHotkey(event) {
    this.removeActiveInput();

    const wrapper = event.currentTarget;

    const inputHotKey = wrapper.querySelector('.hotkeys__input');
    inputHotKey.classList.add('hotkeys__input_active');

    if (inputHotKey.classList.contains('hotkeys__input_err')) {
      inputHotKey.classList.remove('hotkeys__input_err');
    }

    this.activeInput = inputHotKey;
    this.pendingPressed = true;

    document.addEventListener('keyup', this.pendingNewKey);
  }

  findComponent(str) {
    const name = str.toLowerCase();
    let result = null;

    this.listComponents.forEach((item) => {
      const componentName = item.name.toLowerCase();

      if (name === componentName) {
        result = item.component;
      }
    });

    return result;
  }

  makeChangesHotkeys(newKey) {
    const previousHotKey = this.activeInput.innerHTML.toLowerCase();

    this.activeInput.innerHTML = newKey;

    const { nameComponent } = this.activeInput.dataset;
    const component = this.findComponent(nameComponent);
    component.hotKey = newKey;

    const previousInput = this.listHotKeys[newKey];

    if (previousInput) {
      if (previousInput !== this.activeInput) {
        const previousNameComponent = previousInput.dataset.nameComponent;
        const previousComponent = this.findComponent(previousNameComponent);
        previousComponent.hotKey = null;

        previousInput.classList.add('hotkeys__input_err');
        previousInput.innerHTML = '???';

        this.listHotKeys[newKey] = this.activeInput;
        this.listHotKeys[previousHotKey] = null;
      }
    } else {
      this.listHotKeys[previousHotKey] = null;
      this.listHotKeys.add(newKey);
      this.listHotKeys[newKey] = this.activeInput;
    }
  }

  pendingNewKey(event) {
    if (!this.activeInput) return;

    const newKey = String.fromCharCode(event.keyCode).toLowerCase();

    this.makeChangesHotkeys(newKey);

    this.removeActiveInput();
  }

  removeActiveInput() {
    if (!this.activeInput) return;

    this.activeInput.classList.remove('hotkeys__input_active');

    this.activeInput = null;
    this.pendingPressed = false;

    document.removeEventListener('keyup', this.learnNewKey);
  }
}
