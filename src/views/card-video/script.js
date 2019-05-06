export default class CardVideo {
  constructor(options) {
    this.containerSlide = document.querySelector('.container-slide');
    this.containerCard = document.createElement('div');
    this.containerCard.classList.add('container-card');
    this.containerSlide.appendChild(this.containerCard);

    this.createElement(options);
  }

  createElement(options) {
    Object.keys(options).forEach((item) => {
      const elm = document.createElement('div');
      if(item === 'img') {
        elm.classList.add('card-img');
        elm.style.backgroundImage = `url('${options[item]}')`;
      } else {
        elm.classList.add('card-row');
        elm.innerHTML = `<span class="card-title">${item}</span> <p class="card-text">${options[item]}</p>`;
      }

      this.containerCard.appendChild(elm);
    });
  }
}
