# Simple 3-D Project with Three.js

This is a forensic README.md.  Notes should have been taken on the installation
process.

```
npm run dev
```

The `npm run build` (production build) does not work currently.

As specified by the `scripts` section of the package.json
file this application should currently be run with `vite`.
This is automatic with `npm run dev`.

Somewhere I have an extensive README.md on this type
of project (same technologies).  When I find that I will 
come back.  Ultimately, the only test is just to do it again
from scratch.

The probably creation was, while already in a `three-d3-vite`
directory:

`npm create vite@latest three-d3-vite`

This is the probably reason that we have a double directory
that is awkward and unnecessary:

`three-d3-vite/three-d3-vite`

This would have been followed by

```
cd three-d3-vite
npm install
npm install three d3
```

vite does not need a config file.  So the current directory
structure is something like this:

```
three-d3-vite/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── ...
├── dist/
    ├── index.html
    ├── assets/
    └── ...
```

We could in the future have something like this to control
vite settings:

```
three-d3-vite/
├── index.html
├── package.json
├── vite.config.js (or .mjs or .ts)
├── src/
│   ├── main.js
│   └── ...
├── dist/
    ├── index.html
    ├── assets/
    └── ...

```

At present, the entire three.js JavaScript source is located
in `src/main.js`.

There is no __d3__ visualization.  There is the use of `d3.hierarchy` and
`d3.tree` to read _data_ (see `src/main.js` for location) and package up the
__nodes__ used by `three.js`.
