#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const {
  getGlobalSymlinks,
  globalLinkPath,
  getNodeModulePath
} = require("./utils");

const [, , packageName] = process.argv;

const { version } = require("../package.json");
console.info(`npm-link-only v${version}`);

main();

function main() {
  console.info(`Start to unlink ${packageName}`);

  // remove global
  const removedPath = path.resolve(globalLinkPath, packageName);
  rimraf.sync(removedPath);
  console.info("Removed " + removedPath);

  // restore in node_modules/package-name
  getGlobalSymlinks(packageName)
    .map(file => fs.readlinkSync(file))
    .forEach(file => {
      const nodeModulePath = getNodeModulePath(file, packageName);

      fs.copySync(nodeModulePath + ".npm-link-watch-backup", nodeModulePath);
      console.info(" Restored: " + nodeModulePath);
    });
  console.info("Unlink Successfully!");
}
