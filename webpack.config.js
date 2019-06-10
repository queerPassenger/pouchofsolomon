const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin=require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    'webpack-hot-middleware/client?reload=true',
      path.join(__dirname,'src','index.js')
  ],
  output: {
    path:path.join(__dirname,'build'),
    publicPath: '/',
    filename: 'ui.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ["file-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'src','ui.html'),
      filename:'ui.html'
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname,'src','login.html'), to:path.join(__dirname,'build','login.html') }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}