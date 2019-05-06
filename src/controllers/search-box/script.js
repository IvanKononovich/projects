import ProcessingRequest from '../../models/processing-request';

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
      this.sendDataForRequest(this.searchInput.value);
    });
  }

  async sendDataForRequest(text) {
    const processingRequest = new ProcessingRequest({
      key: this.key,
      maxResults: this.maxResults,
      text,
    });
    processingRequest.createRequest();
    // const data = await result.sendDataForRequest();
    // localStorage.setItem('data', JSON.stringify(data));
    // console.log(data);
  }
}
