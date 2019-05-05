import AppCreateRequest from '../../models/create-request';

export default class SearchBox {
  constructor(options) {
    this.key = options.key;
    this.maxResults = options.maxResults;

    this.searchForm = document.createElement('form');
    this.searchForm.classList.add('search-form');

    this.searchInput = document.createElement('input');
    this.searchInput.classList.add('search-form__input');

    this.searchForm.appendChild(this.searchInput);
    document.body.appendChild(this.searchForm);

    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createRequest(this.searchInput.value);
    });
  }

  async createRequest(text) {
    const result = new AppCreateRequest({
      key: this.key,
      maxResults: this.maxResults,
      text,
    });
    const data = await result.createRequest();
    console.log(data);
  }
}
