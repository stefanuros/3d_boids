# Babylon Webpack Typescript Boilerplate

Put all assets in the `assets` folder in the root. `index.ts` is the entry point.
Do not touch `index.html` unless you know what you're doing. Code should go in source.

If you want to use javascript instead of typescript, simply use js files instead of ts
and change the entry point in `webpack.config.js` to use `index.js` instead of 
`index.ts`. (There is an early commit with an example JS file you can copy)

### Run
On your first time running this, run `npm install` to install all dependencies

Run `npm run start` to run a webpack dev server. Go to `localhost:8080` to see your project.

### Build
Run `npm run build` to build the project. It will be added to the `dist` folder
which will be created if it does not already exist. 

To incldue assets, you will need to import them like how I did it in the `index.ts` 
file. I also needed to add a custom declaration in `custom.d.ts` to get it to work.
You may need to do something similar if you use something other than `.gltf` files.
