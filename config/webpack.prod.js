const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const globImporter = require("node-sass-glob-importer")
const { DefinePlugin } = require("webpack")
const { smart } = require("webpack-merge")

const base = require("./webpack.base")
const {
  srcDir,
  distDir,
  nodeModuleDir,
  assetsDir,
  templateFilePath,
} = require("./helpers.config")

const { NODE_ENV } = process.env
const isProd = NODE_ENV === "production"

const prodConfig = {
  devtool: "source-map",

  output: {
    filename: "main.[hash:8].js",

    path: distDir,

    publicPath: "/",

    sourceMapFilename: "main.[hash:8].map",

    pathinfo: false,
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

            cacheDirectory: true,

            retainLines: true,

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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
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
                  require("cssnano"),
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
        }),
      },

      {
        test: /\.(eot?.+|svg?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
        use: "file-loader?name=assets/[name].[hash:8].[ext]",
      },

      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        use: ["url-loader?limit=10240&name=assets/[name].[hash:8].[ext]"],
        include: assetsDir,
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: templateFilePath,

      path: distDir,

      filename: "index.html",
    }),

    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          conditionals: true,
          comparisons: false,
        },
        output: {
          comments: false,
          ascii_only: true,
        },
      },
    }),

    new ExtractTextPlugin({
      filename: "[name].[contenthash:8].css",
    }),

    new DefinePlugin({
      __DEV__: isProd,
      __PROD__: isProd,
    }),
  ],
}

module.exports = smart(base, prodConfig)
