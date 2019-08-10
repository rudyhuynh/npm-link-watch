#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const {
  getGlobalSymlinks,
  globalLinkPath,
  getNodeModulePath
} = require("./utils");
var validateNpmPackageName = require("validate-npm-package-name");

const [, , ...params] = process.argv;

const { name, version } = require("../package.json");
console.info(`${name} v${version}`);

const cwd = process.cwd();

function main() {
  const param = params[0];
  if (param.startsWith("./")) {
    link(params.filter(param => param.startsWith("./")));
  } else if (validateNpmPackageName(param).validForNewPackages) {
    watch(param);
  } else {
    console.error(
      "Invalid parameter. Expect either a relative path (started with './') or a package name"
    );
  }
}

function link(dirPaths) {
  console.info(`Start to link: ` + dirPaths.join(", "));

  const packageName = require(path.resolve(cwd, "package.json")).name;

  //clear previous
  const globalPackagePath = path.resolve(globalLinkPath, packageName);
  rimraf.sync(globalPackagePath);

  dirPaths.forEach(dirPath => {
    const targetPath = path.resolve(cwd, dirPath);
    const symlinkPath = path.resolve(globalLinkPath, packageName, dirPath);
    const dirOfSymlink = path.dirname(symlinkPath);
    if (!fs.existsSync(dirOfSymlink))
      fs.mkdirSync(dirOfSymlink, { recursive: true });

    fs.symlinkSync(targetPath, symlinkPath);
  });

  console.info(
    `\nLink Successfully! Now you can go to your project and run "npx npm-link-watch ${packageName}"`
  );
}

const watchers = {};

function watch(packageName) {
  console.info(`Start to watch and sync from ${packageName}`);

  getGlobalSymlinks()
    .map(file => fs.readlinkSync(file))

    .forEach(file => {
      const nodeModulePath = getNodeModulePath(file, packageName);
      const watcher = fs.watch(file, eventType => {
        if (eventType === "change") {
          sync(file, nodeModulePath);
        }
      });

      backup(nodeModulePath);

      sync(file, nodeModulePath);

      watchers[file] = watcher;

      watcher.on("close", () => {
        console.info("Watch closed");
      });
    });
}

function sync(source, nodeModulePath) {
  fs.copySync(source, nodeModulePath);
}

function backup(nodeModulePath) {
  fs.existsSync(nodeModulePath) &&
    fs.copySync(nodeModulePath, nodeModulePath + ".npm-link-watch-backup");
}

main();
