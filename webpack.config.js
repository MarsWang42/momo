/* eslint comma-dangle: ["error",
 {"functions": "never", "arrays": "only-multiline", "objects":
 "only-multiline"} ] */

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const devBuild = process.env.NODE_ENV !== 'production';

function join(dest) { return path.resolve(__dirname, dest); }

function web(dest) { return join('web/static/' + dest); }

const config = {
  entry: [
    'es5-shim/es5-shim',
    'es5-shim/es5-sham',
    'babel-polyfill',
    web('css/application.scss'),
    web('javascript/App.jsx'),
  ],

  output: {
    path: join('priv/static'),
    filename: 'js/application.js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new UglifyJSPlugin(),
    new ExtractTextPlugin('css/application.css'),
  ],
  module: {
    rules: [
      {
        test: require.resolve('react'),
        use: {
          loader: 'imports-loader',
          options: {
            shim: 'es5-shim/es5-shim',
            sham: 'es5-shim/es5-sham',
          }
        },
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['import', [{ libraryName: "antd" }]],
            ]
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: [
              { loader: 'css-loader', options: { url: false, minimize: true } },
              { loader: 'postcss-loader' },
          ]
        })
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: [
              { loader: 'css-loader', options: { url: false, minimize: true } },
              { loader: 'postcss-loader' },
              { loader: 'sass-loader', options: {} }
          ]
        })
      },
    ],
  },
};

module.exports = config;

if (devBuild) {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  module.exports.devtool = 'eval-source-map';
} else {
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}
