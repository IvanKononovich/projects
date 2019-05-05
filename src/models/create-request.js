export default class AppCreateRequest {
  constructor(options) {
    this.url = `https://www.googleapis.com/youtube/v3/search?key=${options.key}&type=video&part=snippet&maxResults=${options.maxResults}&q=${options.text}`;
    this.createRequest();
  }

  static extractRequiredData(data) {
    console.log(data);
    const result = [];
    const items = [...data.items];

    items.forEach((item) => {
      result.push({
        title: item.snippet.title,
        img: item.snippet.thumbnails.high.url,
        description: item.snippet.description,
        channelName: item.snippet.channelTitle,
        uploadDate: item.snippet.publishedAt,
      });
    });

    console.log(result);
    return result;
  }

  async createRequest() {
    const required = await fetch(this.url);
    const data = await required.json();
    return AppCreateRequest.extractRequiredData(data);
  }
}
