import searchBox from './script';

describe('SearchBox', () => {

  it('SearchBox.searchForm should contains search-form',  () => {
      expect(searchBox.searchForm).toBe(document.querySelector('.search-form'));
  });

  it('SearchBox.searchInput should contains search-input',  () => {
    expect(searchBox.searchInput).toBe(document.querySelector('.search-form__input'));
  });

  it('Form should contains search-input',  () => {
    const form = searchBox.searchForm;
    const input = searchBox.searchInput;

    expect(form.contains(input)).toBeTruthy();
  });

  it('After the call SearchBox.sendDataForRequest SearchBox.textlastRequest should return text request',  () => {
    const textRequest = 'text';
    searchBox.sendDataForRequest(textRequest);

    expect(searchBox.textlastRequest).toBe(textRequest);
  });
});
