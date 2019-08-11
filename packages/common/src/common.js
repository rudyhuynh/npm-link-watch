const glob = require("glob");
const path = require("path");
const fs = require("fs-extra");
const cwd = process.cwd();

const homedir = require("os").homedir();
const globalLinkPath = path.resolve(homedir, ".npm-link-watch");

function getGlobalSymlinks(packageName) {
  return glob
    .sync(path.resolve(globalLinkPath, packageName) + "/**/*")
    .filter(file => fs.lstatSync(file).isSymbolicLink());
}

function getNodeModulePath(globalPath, packageName) {
  const relativeTarget = globalPath.slice(
    globalPath.indexOf(packageName) + packageName.length + 1
  );
  return path.resolve(cwd, "node_modules", packageName, relativeTarget);
}

function isLinked(packageName) {
  return fs.existsSync(path.resolve(globalLinkPath, packageName));
}

module.exports = {
  getGlobalSymlinks,
  globalLinkPath,
  getNodeModulePath,
  isLinked
};
