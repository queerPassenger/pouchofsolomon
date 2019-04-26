import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import prop from './properties';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: path.resolve(__dirname, "/src"),
    compress: true,
    port:prop.uiDevPort
  },
  entry: path.join(__dirname,'src','index.js'),
  output: {
    path: path.join(__dirname,'build'),
    filename: 'ui.bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname,'src'),'node_modules']
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'src','ui.html'),
      filename:'ui.html'
    })
  ],
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
  }
};
