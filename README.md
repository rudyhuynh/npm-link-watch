This command line is to solve the problem of `npm/yarn link`: the linked package has its own `node_modules`, which results in a lots of issues with dupplicate modules.

Similar to `npm link` or `yarn link` but instead of symlink the entire package, `npm-link-watch` watch and sync specific directories/files inside the package.

## How to use

Use it similar to `npm link` or `yarn link`:

```
# Run at package `x`:
npx npm-link-watch ./lib

# Run at the project that has `x` as a dependency:
npx npm-link-watch x
# --> a watcher will watch and sync `x/lib` to `<current_project>/node_modules/x/lib`.
```

## API

#### npx npm-link-watch <...paths>

- `...paths`: strings of relative paths (starts with `./`), separated by space

Save symbolic links of the specified `paths` into a global directory (`~/.npm-link-watch`).
Run at the package you want to link and watch

#### npx npm-link-watch <package-name>

Start a watcher that watch and sync directorys/files from `package-name` to `<current_project>/node_modules/package-name`.
Run at the project that has `package-name` as an installed dependencies.

#### npx npm-unlink-watch <package-name>

Remove the symbolic links saved by `npx npm-link-watch ...paths` and restore all directories/files inside `<current_project>/node_modules/package-name` into their original form.
