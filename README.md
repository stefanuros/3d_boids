# 3D Boids Flocking Simulation
[![Netlify Status](https://api.netlify.com/api/v1/badges/6f9c11bb-7b73-4efa-ae48-2f404fdbc177/deploy-status)](https://app.netlify.com/sites/3d-boids/deploys)

This is an implementation of the Boids Flocking algorithm in 3D using the WebGL 
api, Babylon.js. 

### Controls
Clicking the window will make the mouse control the camera. Pressing escape will exit out of this mode and let you use the mouse as normal again.
Using WASD or the arrow keys will let you move the camera around.

### Run
On your first time running this, run `npm install` to install all dependencies

Run `npm run start` to run a webpack dev server. Go to `localhost:8080` to see your project.

### Build
Run `npm run build` to build the project. It will be added to the `dist` folder
which will be created if it does not already exist. 
