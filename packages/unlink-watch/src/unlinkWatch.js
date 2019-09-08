#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const {
  getGlobalSymlinks,
  globalLinkPath,
  getNodeModulePath
} = require("@npm-link-watch/common");

const [, , ...packageNames] = process.argv;

const { name, version } = require("../package.json");
console.info(`${name} v${version}`);

main();

function main() {
  console.info(`Start to unlink ${packageNames.join(", ")}`);

  packageNames.forEach(packageName => unlinkPerPackage(packageName));

  console.info("Unlink Successfully!");
}

function unlinkPerPackage(packageName) {
  const restoredFiles = getGlobalSymlinks(packageName).map(file =>
    fs.readlinkSync(file)
  );

  // remove global
  const removedPath = path.resolve(globalLinkPath, packageName);
  rimraf.sync(removedPath);
  console.info("Removed " + removedPath);

  // restore in node_modules/package-name
  restoredFiles.forEach(file => {
    const nodeModulePath = getNodeModulePath(file, packageName);
    const backupPath = nodeModulePath + ".npm-link-watch-backup";
    fs.existsSync(backupPath) && fs.copySync(backupPath, nodeModulePath);
    console.info(" Restored: " + nodeModulePath);
  });
}
