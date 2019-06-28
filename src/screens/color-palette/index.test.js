import ColorPalette from './index';

describe('ColorPalette', () => {
  it('ColorPalette.changeColor should change color', () => {
    const colorPalette = new ColorPalette();
    const color = '#ffffff';

    colorPalette.changeColor(color);

    expect(colorPalette.colorPrimaryColor).toBe(color);
  });
});
