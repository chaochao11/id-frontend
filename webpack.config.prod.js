const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

const ASSETS_PATH = "https://idt.one/";
const SRC_PATH = path.resolve(__dirname, "./src");
const BUILD_PATH = path.resolve(__dirname, "./dist");

const prodConfig = {
  devtool: false,
  entry: {
    app: path.resolve(__dirname, "./src/index.js"),
    vendor: [
      "react",
      "react-dom",
      "react-router",
      "react-router-dom",
      "redux",
      "react-redux",
      "axios",
      "./public/js/language/CN.js",
      "./public/js/language/EN.js",
    ],
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
        loader: ExtractTextPlugin.extract(
          Object.assign({
            fallback: {
              loader: "style-loader",
              options: {
                hmr: false,
                sourceMap: false,
              },
            },
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                },
              },
            ],
          }),
        ),
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
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      favicon: path.resolve(__dirname, "./favicon.ico"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new ExtractTextPlugin({
      filename: "[name]-[contenthash:8].css",
      ignoreOrder: true,
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        drop_debugger: true,
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
};

module.exports = prodConfig;
