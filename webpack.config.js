const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "dist");

module.exports = {
  entry: srcPath + "/main.js",
  output: {
    filename: "bundle.js",
    path: distPath
  },
  devtool: "source-map",
  devServer: {
    publicPath: "/",
    contentBase: distPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader:
          "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]"
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};
