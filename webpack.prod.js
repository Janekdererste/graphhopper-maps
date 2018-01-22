const Merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = function(env) {
  return Merge(commonConfig, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        sourceMap: false,
        drop_console: true
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    ]
  });
};
