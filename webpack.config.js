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
      { 
        enforce: 'pre',
        test: /\.js$/, 
        loader: 'eslint-loader',
      },
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
            eraser: extractHtml('src/screens/instruments/eraser/index.html'),
            pipetteColor: extractHtml('src/screens/instruments/pipette-color/index.html'),
            paintBucket: extractHtml('src/screens/instruments/paint-bucket/index.html'),
            paintAllPixels: extractHtml('src/screens/instruments/paint-all-pixels/index.html'),
          },
          layer: extractHtml('src/screens/layer/index.html'),
          resizeCanvas: extractHtml('src/screens/resize-canvas/index.html'),
          resizeTool: extractHtml('src/screens/resize-tool/index.html'),
          colorPalette: extractHtml('src/screens/color-palette/index.html'),
          frame: extractHtml('src/screens/frame/index.html'),
          preview: extractHtml('src/screens/preview/index.html'),
          export: extractHtml('src/screens/download-file/index.html'),
          canvas: {
            mainCanvas: extractHtml('src/screens/main-canvas/index.html'),
          },
        },
      },
      filename: 'editor.html',
    })  
  ],
};


