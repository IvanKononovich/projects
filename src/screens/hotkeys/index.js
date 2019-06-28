export default class HotKeys {
  constructor(listComponents) {
    this.listComponents = listComponents;

    this.hotkeysButton = document.querySelector('.hotkeys');
    this.hotKeysContainer = this.hotkeysButton.querySelector('.hotkeys__container');
    this.hotkeysButtonClose = this.hotKeysContainer.querySelector('.hotkeys__close');
    this.hotkeysInputWrappers = this.hotkeysButton.querySelectorAll('.hotkeys__input-wrapper');
    this.activeInput = null;
    this.listHotKeys = new Set();
    this.pendingPressed = false;

    this.changeHotkey = this.changeHotkey.bind(this);
    this.pendingNewKey = this.pendingNewKey.bind(this);
    this.openHotKeysContainer = this.openHotKeysContainer.bind(this);

    this.hotkeysButton.addEventListener('click', this.openHotKeysContainer);

    this.addDefaultKey();
  }

  addDefaultKey() {
    [...this.hotkeysInputWrappers].forEach((item) => {
      const inputHotKey = item.querySelector('.hotkeys__input');
      const key = inputHotKey.dataset.defaultKey;

      this.activeInput = inputHotKey;

      this.makeChangesHotkeys(key);

      item.addEventListener('click', this.changeHotkey);
    });
  }

  static preventPopUpKeypress(event) {
    event.stopPropagation();
  }

  openHotKeysContainer(event) {
    const { target } = event;

    if (target === this.hotkeysButton
    || target === this.hotkeysButtonClose) {
      this.hotKeysContainer.classList.toggle('hotkeys__container_open');

      if (this.pendingPressed) {
        this.removeActiveInput();
      }

      if (this.hotKeysContainer.classList.contains('hotkeys__container_open')) {
        document.body.addEventListener('keypress', HotKeys.preventPopUpKeypress);
      } else {
        document.body.removeEventListener('keypress', HotKeys.preventPopUpKeypress);
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

  changeHotKeyComponent(input, nameComponent, newKey) {
    const component = this.findComponent(nameComponent);
    let { actionName } = input.dataset;

    if (actionName) {
      actionName = actionName.toLowerCase();
      component.hotKey[actionName].key = newKey;
    } else {
      component.hotKey = newKey;
    }
  }

  makeChangesHotkeys(newKey) {
    const previousHotKey = this.activeInput.innerHTML.toLowerCase();

    this.activeInput.innerHTML = newKey;

    const { nameComponent } = this.activeInput.dataset;
    this.changeHotKeyComponent(this.activeInput, nameComponent, newKey);

    const previousInput = this.listHotKeys[newKey];

    if (previousInput) {
      if (previousInput !== this.activeInput) {
        const previousNameComponent = previousInput.dataset.nameComponent;
        this.changeHotKeyComponent(previousInput, previousNameComponent, null);

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
