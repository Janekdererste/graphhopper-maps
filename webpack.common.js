const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    contentBase: distPath,
    proxy: {
      "/route": {
        target: "http://localhost:3000",
        pathRewrite: { "^/route": "" }
      }
    }
  },
  resolve: {
    // Leaflet image Alias resolutions
    // Leaflet uses image references in its css. These aliases
    // point the relative paths to the images in the node_modules folder
    alias: {
      "./images/layers.png$": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images/layers.png"
      ),
      "./images/layers-2x.png$": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images/layers-2x.png"
      ),
      "./images/marker-icon.png$": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images/marker-icon.png"
      ),
      "./images/marker-icon-2x.png$": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images/marker-icon-2x.png"
      ),
      "./images/marker-shadow.png$": path.resolve(
        __dirname,
        "node_modules/leaflet/dist/images/marker-shadow.png"
      )
    }
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
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[name]__[local]__[hash:base64:5]"
            }
          }
        ]
      },
      //This loads the png files the leaflet css points to
      {
        test: /\.png/,
        //include: path.resolve(__dirname, "node_modules/leaflet/"),
        loader: "file-loader"
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: srcPath + "/index.html",
        to: "index.html"
      },
      {
        from: path.resolve(srcPath, "favicon.png"),
        to: "favicon.png"
      }
    ])
  ]
};
