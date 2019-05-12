import Slider from './script';

describe('Slider', () => {
  const slider = new Slider();

  it('Slider.timeAnimation should contains number', () => {
    expect(typeof slider.timeAnimation).toBe('number');
  });

  it('After call Slider.moveSlide container-slide should change self coords', () => {
    const x = 100;
    slider.moveSlide(x);

    const slideX = parseInt(getComputedStyle(slider.containerSlide).left, 10);
    expect(slideX).toBe(x);
  });

  it('Test Slider.createPoints # 1 --- Slider.createPoints should create points according to Slider.indexActiveSlide', () => {
    slider.indexActiveSlide = 0;
    slider.createPoints();
    const listChild = slider.containerPoints.querySelectorAll('*');

    expect(listChild.length <= 4).toBeTruthy();
  });

  it('Test Slider.createPoints # 2 --- Slider.createPoints should create points according to Slider.indexActiveSlide', () => {
    slider.indexActiveSlide = 1;
    slider.createPoints();
    const listChild = slider.containerPoints.querySelectorAll('*');

    expect(listChild.length <= 4).toBeTruthy();
  });

  it('Test Slider.createPoints # 3 --- Slider.createPoints should create points according to Slider.indexActiveSlide', () => {
    slider.indexActiveSlide = 9999;
    slider.createPoints();
    const listChild = slider.containerPoints.querySelectorAll('*');

    expect(listChild.length <= 4).toBeTruthy();
  });

  it('Slider.loadingData should will call after slide move certain distance', () => {
    const quantitySlideBeforeCallLoadingData = document.querySelectorAll('.container-card').length;
    const x = 9999;
    slider.moveSlide(x);

    // create promiss because Slider.loadingData goes asynchronously
    Promise.resolve().then(() => {
      const quantitySlideAfterCallLoadingData = document.querySelectorAll('.container-card').length;

      expect(quantitySlideBeforeCallLoadingData < quantitySlideAfterCallLoadingData).toBeTruthy();
    });
  });
});
