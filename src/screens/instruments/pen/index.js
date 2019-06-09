class Pen {
  constructor() {
    this.state = false;
    this.color = 'red';
    this.penButton = document.querySelector('.instrument-item__img_pen');
    this.stateChange = this.stateChange.bind(this);
    this.penButton.addEventListener('click', this.stateChange);
  }

  stateChange() {
    if (this.state) this.state = false;
    else this.state = true;

    this.penButton.classList.toggle('instrument-item__img_active');
  }

  use(sect) {
    const sector = sect;

    sector.color = this.color;
  }
}

const pen = new Pen();

export default pen;
