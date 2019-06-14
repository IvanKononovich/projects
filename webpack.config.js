const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function extractHtml(src) {
    return fs.readFileSync(path.resolve(__dirname, src));
}

module.exports = {
  entry: [
    './src/app.js',
    './src/style.scss'
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
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
      // Load a custom template (lodash by default)
      template: 'src/index.html',
      content: {
        screens: {
          instruments: {
            pen: extractHtml('src/screens/instruments/pen/index.html'),
            eraser: extractHtml('src/screens/instruments/eraser/index.html'),
            paintBucket: extractHtml('src/screens/instruments/paint-bucket/index.html'),
          },
          colorPalette: extractHtml('src/screens/color-palette/index.html'),
          canvas: {
            mainCanvas: extractHtml('src/screens/main-canvas/index.html'),
          },
        },
      }
    })  
  ],
};


