/* eslint max-len: ["error", { "comments": 200 }] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "pen || eraser || pipetteColor || paintBucket || exportFile || resizeCanvas" }] */

import MainCanvas from './screens/main-canvas/index';
import Frame from './screens/frame/index';
import LoadingSavedData from './components/loading-saved-data';
import ResizeCanvas from './screens/resize-canvas/index';
import Preview from './screens/preview/index';
import Layer from './screens/layer/index';

import ResizeTool from './screens/resize-tool/index';
import ColorPallete from './screens/color-palette/index';

import Pen from './screens/instruments/pen/index';
import Eraser from './screens/instruments/eraser/index';
import PipetteColor from './screens/instruments/pipette-color/index';
import PaintBucket from './screens/instruments/paint-bucket/index';

import ExportFile from './screens/download-file/index';

const canvas = document.querySelector('.main-canvas');

if (canvas) {
  const mainCanvas = new MainCanvas(0, 0, Frame);
  const preview = new Preview(mainCanvas);
  const layer = new Layer(mainCanvas);
  const resizeCanvas = new ResizeCanvas(mainCanvas, LoadingSavedData, layer);

  const colorPallete = new ColorPallete();
  const resizeTool = new ResizeTool();

  const pen = new Pen('instrument-item__img_pen',
    mainCanvas,
    colorPallete,
    resizeTool);

  const eraser = new Eraser('instrument-item__img_eraser',
    mainCanvas,
    colorPallete,
    resizeTool);

  const pipetteColor = new PipetteColor('instrument-item__img_pipette',
    mainCanvas,
    colorPallete,
    resizeTool);
  const paintBucket = new PaintBucket('instrument-item__img_bucket',
    mainCanvas,
    colorPallete,
    resizeTool);

  const exportFile = new ExportFile(mainCanvas, preview);
}
