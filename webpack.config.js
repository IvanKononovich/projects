const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function extractHtml(src) {
    return fs.readFileSync(path.resolve(__dirname, src));
}

module.exports = {
  entry: [
    './src/app.js',
    './src/style.css'
  ],
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      // { 
      //   enforce: 'pre',
      //   test: /\.js$/, 
      //   loader: 'eslint-loader',
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              disable: true,
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({  
      template: 'src/screens/start-page/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({  
      // Load a custom template (lodash by default)
      template: 'src/index.html',
      content: {
        screens: {
          instruments: {
            pen: extractHtml('src/screens/instruments/pen/index.html'),
            stroke: extractHtml('src/screens/instruments/stroke/index.html'),
            eraser: extractHtml('src/screens/instruments/eraser/index.html'),
            pipetteColor: extractHtml('src/screens/instruments/pipette-color/index.html'),
            paintBucket: extractHtml('src/screens/instruments/paint-bucket/index.html'),
            paintAllPixels: extractHtml('src/screens/instruments/paint-all-pixels/index.html'),
            rectangle: extractHtml('src/screens/instruments/rectangle/index.html'),
            move: extractHtml('src/screens/instruments/move/index.html'),
            lighten: extractHtml('src/screens/instruments/lighten/index.html'),
            dithering: extractHtml('src/screens/instruments/dithering/index.html'), 
            mirrorPen: extractHtml('src/screens/instruments/mirror-pen/index.html'), 
            shapeSelection: extractHtml('src/screens/instruments/shape-selection/index.html'), 
          },
          resizeCanvas: extractHtml('src/screens/resize-canvas/index.html'),
          resizeTool: extractHtml('src/screens/resize-tool/index.html'),
          colorPalette: extractHtml('src/screens/color-palette/index.html'),
          frame: extractHtml('src/screens/frame/index.html'),
          preview: extractHtml('src/screens/preview/index.html'),
          export: extractHtml('src/screens/download-file/index.html'),
          hotkeys: extractHtml('src/screens/hotkeys/index.html'),
          canvas: {
            mainCanvas: extractHtml('src/screens/main-canvas/index.html'),
          },
        },
      },
      filename: 'editor.html',
    })  
  ],
};


