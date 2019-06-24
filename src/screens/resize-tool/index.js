export default class ResizeTool {
  constructor() {
    this.activeButton = document.querySelector('.resize-tool__button-size_active');
    this.size = this.activeButton.dataset.size;

    this.changeStateButton = this.changeStateButton.bind(this);

    document.addEventListener('click', this.changeStateButton);
  }

  changeStateButton(event) {
    const el = event.target;

    if (el.classList.contains('resize-tool__button-size')) {
      this.activeButton.classList.remove('resize-tool__button-size_active');
      el.classList.add('resize-tool__button-size_active');

      this.activeButton = el;

      this.size = this.activeButton.dataset.size;
    }
  }
}
