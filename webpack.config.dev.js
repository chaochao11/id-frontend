const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

const SRC_PATH = path.resolve(__dirname, "./src");
const BUILD_PATH = path.resolve(__dirname, "./dist");
const ASSETS_PATH = "/";

const devConfig = {
  devtool: "cheap-module-source-map",

  entry: {
    app: ["react-hot-loader/patch", SRC_PATH + "/index.js"],
  },

  output: {
    path: BUILD_PATH,
    publicPath: ASSETS_PATH,
    filename: "[name].[hash:8].js",
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        include: SRC_PATH,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        loader: ["css-hot-loader"].concat(ExtractTextPlugin.extract(
          Object.assign({
            fallback: {
              loader: "style-loader",
              options: {
                sourceMap: true,
              },
            },
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                },
              },
            ],
          }),
        )),
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: "url-loader",
        options: {
          limit: "1000",
          name: "[name]-[hash:8].[ext]",
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          name: "[name]-[hash:8].[ext]",
        },
      },
    ],
  },

  devServer: {
    open: false,
    host: "0.0.0.0",
    port: "8080",
    contentBase: [BUILD_PATH, path.resolve(__dirname, "./public")],
    hot: true,
    overlay: {
      errors: true,
    },
    publicPath: ASSETS_PATH,
    historyApiFallback: {
      index: ASSETS_PATH + "index.html",
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      favicon: path.resolve(__dirname, "./favicon.ico"),
    }),
    new ExtractTextPlugin({
      filename: "[name].css",
      ignoreOrder: true,
      allChunks: true,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

module.exports = devConfig;
