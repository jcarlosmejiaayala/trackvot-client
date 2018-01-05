const { srcDir, nodeModulesDir } = require("./helpers.config")

module.exports = {
  target: "web",

  context: srcDir,

  entry: ["./styles/index.scss", "babel-polyfill", "./index.js"],

  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [srcDir, nodeModulesDir],
  },
}
