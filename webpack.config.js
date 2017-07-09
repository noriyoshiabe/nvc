var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: [
      './src/index.js',
    ]
  },

  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name]-[hash].js',
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader']}),
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].css'),
  ],

  devtool: 'source-map',

  devServer: {
    inline: true,
    stats: { colors: true },
  },
};

