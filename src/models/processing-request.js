import CardVideo from '../views/card-video/script';

export default class ProcessingRequest {
  constructor(options) {
    this.key = options.key;
    this.listCardVideo = [];
    this.urlSearch = `https://www.googleapis.com/youtube/v3/search?key=${this.key}&type=video&part=snippet&maxResults=${options.maxResults}&q=${options.text}`;
    this.createRequest();
  }

  async getViewCount(listId) {
    this.urlVideo = `https://www.googleapis.com/youtube/v3/videos?key=${this.key}&id=${listId}&part=snippet,statistics`;
    const required = await fetch(this.urlVideo);
    const data = await required.json();
    const result = [];
    data.items.forEach((item) => {
      result.push(item.statistics.commentCount);
    });
    console.log(result);
    return result;
  }

  async extractRequiredData(data) {
    const result = [];
    const items = [...data.items];
    const listId = [];

    items.forEach((item) => {
      listId.push(item.id.videoId);
      result.push({
        img: item.snippet.thumbnails.high.url,
        Title: item.snippet.title,
        Description: item.snippet.description,
        'Channel name': item.snippet.channelTitle,
        'Upload date': item.snippet.publishedAt,
      });
    });

    const listViewCount = await this.getViewCount(listId.join(','));
    result.forEach((item, index) => {
      item['View count'] = listViewCount[index];
    });

    // console.log(result);
    // localStorage.setItem('data', JSON.stringify(result));
    return result;
  }

  async createRequest() {
    const required = await fetch(this.urlSearch);
    const data = await required.json();
    const cardDetails = await this.extractRequiredData(data);

    const containerSlide = document.querySelector('.container-slide');
    containerSlide.innerHTML = '';

    cardDetails.forEach((item) => {
      new CardVideo(item);
    });
  }
}
