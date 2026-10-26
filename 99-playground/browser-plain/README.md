# Playground for JavaScript Demos

Run the playground in a live-reloading browser:
```
npm start
```

Open the browser at http://localhost:3000/

`app.js` imports and calls the `demo` function using the module specifier `demo`.
The import map in `index.html` maps `demo` to `./demo.js`.
`demo.js` imports `chunk` using the module specifier `lodash/chunk`.
The import map in `index.html` maps this specifier to the full CDN URL.
The browser console shows the resulting groups: `[[1, 2], [3, 4], [5]]`.
