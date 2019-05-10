import Slider from '../../views/slider/script';

class SearchBox {
  constructor() {
    this.slider = null;
    this.textlastRequest = '';
    this.searchForm = document.createElement('form');
    this.searchForm.classList.add('search-form');

    this.searchInput = document.createElement('input');
    this.searchInput.classList.add('search-form__input');

    this.searchForm.appendChild(this.searchInput);
    document.body.appendChild(this.searchForm);

    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.sendDataForRequest(this.searchInput.value);
    });
  }

  async sendDataForRequest(text) {
    if (this.textlastRequest === text) return;
    this.textlastRequest = text;

    const textRequest = this.searchInput.value;

    this.processingRequest.nextPageToken = null;
    if (textRequest.length > 0) this.processingRequest.createRequest(text);

    if (!this.slider && textRequest.length > 0) {
      this.slider = new Slider();
      this.slider.processingRequest = this.processingRequest;
    } else if (this.slider) {
      this.slider.containerSlide.innerHTML = '';
      this.slider.indexActiveSlide = 0;
      this.slider.moveSlide(0);
      this.slider.createPoints();
    }
  }
}

const searchBox = new SearchBox();
export default searchBox;
