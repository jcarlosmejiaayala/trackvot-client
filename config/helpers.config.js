const { join, resolve } = require("path")

const rootDirPathResolve = resolve.bind(resolve, resolve(__dirname, ".."))
const srcDir = rootDirPathResolve("src")
const distDir = rootDirPathResolve("dist")
const nodeModulesDir = rootDirPathResolve("node_modules")
const assetsDir = resolve(srcDir, "assets")
const templateFilePath = join(srcDir, "index.html")

module.exports = {
  srcDir,
  distDir,
  nodeModulesDir,
  assetsDir,
  templateFilePath,
}
