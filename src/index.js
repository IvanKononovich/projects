// fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyBsIceT4Cw-taBiarIddOT1kLR1_iLH3S4&type=video&part=snippet&maxResults=1&q=js').then(res => res.json()).then(res => console.log(res));
// fetch('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBsIceT4Cw-taBiarIddOT1kLR1_iLH3S4&id=nq4aU9gmZQk&part=snippet').then(res => res.json()).then(res => console.log(res));

import SearchBox from './controllers/search-box/script';
import Slider from './views/slider/script';
import CardVideo from './views/card-video/script';

class App {
  constructor() {
    this.createSearchBox();
  }

  createSearchBox() {
    this.searchBox = new SearchBox({
      key: 'AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y',
      maxResults: 15,
    });
  }

  createSlider() {
    this.slider = new Slider();
  }

  createCardVideo(options) {
    this.cardVideo = new CardVideo(options);
  }
}

const app = new App();
// app.createSlider();

console.log(app);
