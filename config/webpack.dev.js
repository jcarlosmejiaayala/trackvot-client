const HtmlWebpackPlugin = require("html-webpack-plugin")
const globImporter = require("node-sass-glob-importer")
const { smart } = require("webpack-merge")
const {
  HotModuleReplacementPlugin,
  NamedModulesPlugin,
  DefinePlugin,
} = require("webpack")

const base = require("./webpack.base")
const {
  srcDir,
  distDir,
  nodeModuleDir,
  assetsDir,
  templateFilePath,
} = require("./helpers.config")

const { NODE_ENV } = process.env

const isDev = NODE_ENV === "development"

const devConfig = {
  devtool: "cheap-module-source-map",

  output: {
    filename: "main.js",

    path: distDir,

    publicPath: "/",

    sourceMapFilename: "main.map",

    pathinfo: true,
  },

  devServer: {
    contentBase: srcDir,

    publicPath: "/",

    historyApiFallback: true,

    port: 3000,

    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,

        exclude: nodeModuleDir,

        include: srcDir,

        use: {
          loader: "babel-loader",

          options: {
            babelrc: false,

            cacheDirectory: false,

            retainLines: false,

            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-stage-0",
            ],

            plugins: [
              require("@babel/plugin-transform-strict-mode"),
              require("@babel/plugin-proposal-object-rest-spread"),
            ],
          },
        },
      },

      {
        test: /\.scss$/,
        exclude: nodeModuleDir,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 11",
                  ],
                  flexbox: "no-2009",
                }),
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {
              importer: globImporter(),
            },
          },
        ],
      },

      {
        test: /\.(eot?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
        use: "file-loader?name=assets/[name].[ext]",
      },

      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        use: ["url-loader?limit=10240&name=assets/[name].[ext]"],
        include: assetsDir,
      },
    ],
  },

  plugins: [
    new NamedModulesPlugin(),

    new HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: templateFilePath,

      path: distDir,

      filename: "index.html",
    }),

    new DefinePlugin({
      __DEV__: isDev,
      __PROD__: isDev,
    }),
  ],
}

module.exports = smart(base, devConfig)
