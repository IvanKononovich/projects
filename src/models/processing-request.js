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
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelName: item.snippet.channelTitle,
        uploadDate: item.snippet.publishedAt,
      });
    });

    const listViewCount = await this.getViewCount(listId.join(','));
    result.forEach((item, index) => {
      const instance = item;
      instance['View count'] = listViewCount[index];
    });

    return result;
  }

  async createRequest() {
    const required = await fetch(this.urlSearch);
    const data = await required.json();
    const cardDetails = await this.extractRequiredData(data);

    const containerSlide = document.querySelector('.container-slide');
    containerSlide.innerHTML = '';

    cardDetails.forEach((item) => {
      const instance = new CardVideo(item);
      return instance;
    });
  }
}
