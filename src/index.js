// fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyBsIceT4Cw-taBiarIddOT1kLR1_iLH3S4&type=video&part=snippet&maxResults=1&q=js').then(res => res.json()).then(res => console.log(res));
// fetch('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBsIceT4Cw-taBiarIddOT1kLR1_iLH3S4&id=nq4aU9gmZQk&part=snippet').then(res => res.json()).then(res => console.log(res));

import SearchBox from './controllers/search-box/search-box';

class App {
  constructor() {
    this.createSearchBox();
  }

  createSearchBox() {
    this.searchBox = new SearchBox({
      key: 'AIzaSyAc8TqMl112AqFC6u7Nd5vGuwwCtE-o2Vg',
      maxResults: 1,
    });
  }
}

const app = new App();
console.log(app);
