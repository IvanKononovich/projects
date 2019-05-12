import Slider from '../../views/slider/script';
import CardVideo from './script';

describe('CardVideo', () => {
  const options = {
    img: '/way/way/way',
    id: '321456',
    title: 'Title',
    channelName: 'Name',
    uploadDate: '01.01.0001',
    viewCount: '500',
    description: 'description',
  }

  const slider = new Slider();
  const cardVideo = new CardVideo(options);
  

  it('CardVideo.containerSlide should contains container slide',  () => {
      expect(cardVideo.containerSlide).toEqual(slider.containerSlide);
  });

  it('Container slide should contains card',  () => {
    const container = cardVideo.containerSlide;
    const card =  cardVideo.containerCard;

    expect(container.contains(card)).toBeTruthy();
  });

  it('CardVideo.containerCard should contains HTML with given parameters',  () => {
    const html = cardVideo.containerCard.innerHTML;
    expect(html).toBe(`
      <div class="card-img" style="background-image: url('${options.img}')"></div>
      <a class="card-link" href="https://www.youtube.com/watch?v=${options.id}">${options.title}</a>
      <p class="card-text"><span class="card-text__img card-text__img_1"></span>${options.channelName}</p>
      <p class="card-text"><span class="card-text__img card-text__img_2"></span>${options.uploadDate}</p>
      <p class="card-text"><span class="card-text__img card-text__img_3"></span>${options.viewCount}</p>
      <p class="card-text card-text_smal-text">${options.description}</p>
    `);
  });
});
