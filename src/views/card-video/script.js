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
      <span class="card-title">Description</span>
      <p class="card-text">${options.title}</p>
      <span class="card-title">Channel name</span>
      <p class="card-text">${options.channelName}</p>
      <span class="card-title">Upload date</span>
      <p class="card-text">${options.uploadDate}</p>
    `;
  }
}
