/* eslint max-len: ["error", { "comments": 200 }] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "resizeCanvas || hotKeys || exportFile" }] */

import MainCanvas from './screens/main-canvas/index';
import Frame from './screens/frame/index';
import LoadingSavedData from './components/loading-saved-data';
import ResizeCanvas from './screens/resize-canvas/index';
import Preview from './screens/preview/index';

import ResizeTool from './screens/resize-tool/index';
import ColorPallete from './screens/color-palette/index';

import Pen from './screens/instruments/pen/index';
import MirrorPen from './screens/instruments/mirror-pen/index';
import ShapeSelection from './screens/instruments/shape-selection/index';
import Stroke from './screens/instruments/stroke/index';
import Rectangle from './screens/instruments/rectangle/index';
import Move from './screens/instruments/move/index';
import Lighten from './screens/instruments/lighten/index';
import Dithering from './screens/instruments/dithering/index';
import Eraser from './screens/instruments/eraser/index';
import PipetteColor from './screens/instruments/pipette-color/index';
import PaintBucket from './screens/instruments/paint-bucket/index';
import PaintAllPixels from './screens/instruments/paint-all-pixels/index';

import HotKeys from './screens/hotkeys/index';

import ExportFile from './screens/download-file/index';

const canvas = document.querySelector('.main-canvas');

if (canvas) {
  const listComponents = [];
  window.listTools = [];

  const mainCanvas = new MainCanvas(0, 0, Frame);
  listComponents.push({
    component: mainCanvas,
    name: 'MainCanvas',
  });

  const preview = new Preview(mainCanvas);
  const resizeCanvas = new ResizeCanvas(mainCanvas, LoadingSavedData);

  const colorPallete = new ColorPallete();
  const resizeTool = new ResizeTool();
  listComponents.push({
    component: resizeTool,
    name: 'ResizeTool',
  });

  const toolPen = new Pen(
    'instrument-item__img_pen',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolPen,
    name: 'Pen',
  });
  window.listTools.push(toolPen);

  const toolMirrorPen = new MirrorPen(
    'instrument-item__img_mirror-pen',
    mainCanvas,
    colorPallete,
    resizeTool,
    toolPen,
  );
  listComponents.push({
    component: toolMirrorPen,
    name: 'MirrorPen',
  });
  window.listTools.push(toolPen);


  const toolStroke = new Stroke(
    'instrument-item__img_stroke',
    mainCanvas,
    colorPallete,
    resizeTool,
    toolPen,
  );
  listComponents.push({
    component: toolStroke,
    name: 'Stroke',
  });
  window.listTools.push(toolStroke);

  const toolRectangle = new Rectangle(
    'instrument-item__img_rectangle',
    mainCanvas,
    colorPallete,
    resizeTool,
    toolPen,
  );
  listComponents.push({
    component: toolRectangle,
    name: 'Rectangle',
  });
  window.listTools.push(toolRectangle);

  const toolMove = new Move(
    'instrument-item__img_move',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolMove,
    name: 'Move',
  });
  window.listTools.push(toolMove);

  const toolLighten = new Lighten(
    'instrument-item__img_lighten',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolLighten,
    name: 'Lighten',
  });
  window.listTools.push(toolLighten);

  const toolDithering = new Dithering(
    'instrument-item__img_dithering',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolDithering,
    name: 'Dithering',
  });
  window.listTools.push(toolDithering);

  const toolEraser = new Eraser(
    'instrument-item__img_eraser',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolEraser,
    name: 'Eraser',
  });
  window.listTools.push(toolEraser);

  const toolPipetteColor = new PipetteColor(
    'instrument-item__img_pipette',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolPipetteColor,
    name: 'PipetteColor',
  });
  window.listTools.push(toolPipetteColor);

  const toolPaintBucket = new PaintBucket(
    'instrument-item__img_bucket',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolPaintBucket,
    name: 'PaintBucket',
  });
  window.listTools.push(toolPaintBucket);

  const toolPaintAllPixels = new PaintAllPixels(
    'instrument-item__img_paint-all-pixels',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolPaintAllPixels,
    name: 'PaintAllPixels',
  });
  window.listTools.push(toolPaintAllPixels);

  const toolShapeSelection = new ShapeSelection(
    'instrument-item__img_shape-selection',
    mainCanvas,
    colorPallete,
    resizeTool,
  );
  listComponents.push({
    component: toolShapeSelection,
    name: 'ShapeSelection',
  });
  window.listTools.push(toolShapeSelection);

  const hotKeys = new HotKeys(listComponents);

  const exportFile = new ExportFile(mainCanvas, preview);
}
