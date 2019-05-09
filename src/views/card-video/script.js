export default class CardVideo {
  constructor(options) {
    this.containerSlide = document.querySelector('.container-slide');
    this.containerCard = document.createElement('div');
    this.containerCard.classList.add('container-card');
    this.containerSlide.appendChild(this.containerCard);

    this.createElement(options);
  }

  createElement(options) {
    this.containerCard.innerHTML = `
      <div class="card-img" style="background-image: url('${options.img}')"></div>
      <a class="card-link" href="https://www.youtube.com/watch?v=${options.id}">${options.title}</a>
      <p class="card-text"><span class="card-text__img card-text__img_1"></span>${options.channelName}</p>
      <p class="card-text"><span class="card-text__img card-text__img_2"></span>${options.uploadDate}</p>
      <p class="card-text"><span class="card-text__img card-text__img_3"></span>${options.viewCount}</p>
      <p class="card-text card-text_smal-text">${options.description}</p>
    `;
  }
}
