This command line is to solve the problem of `npm/yarn link`: the linked package has its own `node_modules`, which results in a lots of issues relate to dupplicate modules.

Similar to `npm link` or `yarn link` but instead of symlink the entire package, `npm-link-watch` watch and sync specific directories/files inside the package.

## How to use

Use it similar to `npm/yarn link`:

```
# Run at package `x`:
npx npm-link-watch ./lib

# Run at the project that has `x` as a dependency:
npx npm-link-watch x
# --> a watcher will watch and sync `x/lib` to `<current_project>/node_modules/x/lib`.
```

> Your machine already has `npx` if you installed NodeJS version 6 or newer. In case you don't want to type `npx` all the time, run `npm install -g npm-link-watch npm-unlink-watch`

> Notice: If your package has just installed new dependencies, you then have to install those dependencies into your project as well.

## API

#### `npx npm-link-watch <...path>`

- `...path`: strings of relative paths (start with `./`), separated by space.

  Save symbolic links of the specified `path`s into a global directory (`~/.npm-link-watch`).
  Run at the package you want to link and watch

#### `npx npm-link-watch <...package-name>`

- `...package-name`: strings of package names (exact string in `package.json#name`), separated by space.

  Start a watcher that watch and sync directories/files from `package-name` to `<current_project>/node_modules/package-name`.
  Run at the project that has `package-name` as an installed dependency.

#### `npx npm-unlink-watch <...package-name>`

- `...package-name`: strings of package names (exact string in `package.json#name`), separated by space.

  Remove the symbolic links saved by `npx npm-link-watch <...path>`. The comand also attempts to restore the synced content inside `<current_project>/node_modules/package-name`, but this may not consistent for all cases. For more consistent, you should run `yarn install --force`

## LICENSE

MIT
