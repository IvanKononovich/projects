class Pen {
  constructor() {
    this.state = false;
    this.color = '#292929';
    this.penButton = document.querySelector('.instrument-item__img_pen');
    this.stateChange = this.stateChange.bind(this);

    document.addEventListener('click', this.stateChange);
  }

  stateChange(event) {
    const el = event.target;

    if (el.classList.contains('instrument-item__img')) {
      if (el.classList.contains('instrument-item__img_pen')) {
        this.state = true;
        this.penButton.classList.add('instrument-item__img_active');
      } else {
        this.state = false;
        this.penButton.classList.remove('instrument-item__img_active');
      }
    }
  }

  use(sect) {
    const sector = sect;

    sector.color = this.color;
  }
}

const pen = new Pen();

export default pen;
