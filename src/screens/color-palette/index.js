class ColorPallete {
  constructor() {
    this.colorPaletteInputs = document.querySelectorAll('.color-palette-container__input');
    this.colorPrimary = 'transparent';
    this.colorSecondary = 'transparent';

    this.changeColor = this.changeColor.bind(this);

    [...this.colorPaletteInputs].forEach((item) => {
      this.changeColor(item);

      item.addEventListener('change', (event) => {
        const inputEl = event.target;

        Promise.resolve().then(() => {
          this.changeColor(inputEl);
        });
      });
    });
  }

  changeColor(imputEl) {
    if (imputEl.classList.contains('color-palette-container__input_primary')) {
      this.colorPrimary = imputEl.value;
    } else {
      this.colorSecondary = imputEl.value;
    }
  }
}

const colorPallete = new ColorPallete();

export default colorPallete;
