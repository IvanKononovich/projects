export default class ColorPallete {
  constructor() {
    this.colorPrimary = document.querySelector('.color-palette-container__input_primary');
    this.colorPrimaryColor = this.colorPrimary.value;
    this.colorSecondary = document.querySelector('.color-palette-container__input_secondary');

    this.changeColor = this.changeColor.bind(this);

    this.colorPrimary.addEventListener('change', (event) => {
      const inputEl = event.target;

      Promise.resolve().then(() => {
        this.changeColor(inputEl.value);
      });
    });
  }

  changeColor(color) {
    this.colorSecondary.value = this.colorPrimaryColor;
    this.colorPrimary.value = color;
    this.colorPrimaryColor = this.colorPrimary.value;
  }
}
