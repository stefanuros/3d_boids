import { 
  Engine, 
  SceneLoader, 
  HemisphericLight, 
  Vector3, 
  ArcRotateCamera, 
  Scene, 
  DynamicTexture,
  StandardMaterial,
  Mesh,
  Color3
} from 'babylonjs';
import 'babylonjs-loaders';

import * as Stats from 'stats.js';

// Import our glTF model.
import * as gltf from '../assets/aviao_low_poly/scene.gltf';

// Create the engine and scene, which will consist of one light and the main camera.
const canvas = <HTMLCanvasElement> document.getElementById('canvas');
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
const light = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
const camera = new ArcRotateCamera("camera1", 0, 1, 220, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, false);
camera.position = new Vector3(15, 15, 15);

// Setting up the stats panel 
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Instruct the engine to resize when the window does.
window.addEventListener('resize', () => engine.resize());

// Start the engine's main render loop.
engine.runRenderLoop(() => {
  stats.begin();
  scene.render()
  stats.end();
});

showWorldAxis(100);

loadPlane();

async function loadPlane() {
  let plane = await SceneLoader.ImportMeshAsync(null, '/', gltf, scene);
  plane.meshes[0].rotation = new Vector3(0, Math.PI + Math.PI/4, 0);
  return plane;
}

function showWorldAxis(size: number) {
  var makeTextPlane = function (text: string, color: string, size: number) {
    var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = Mesh.CreatePlane("TextPlane", size, scene, true);
    let material = new StandardMaterial("TextPlaneMaterial", scene);
    plane.material = material;
    material.backFaceCulling = false;
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    return plane;
  };
  var axisX = Mesh.CreateLines("axisX", [
    Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  axisX.color = new Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = Mesh.CreateLines("axisY", [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  axisY.color = new Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = Mesh.CreateLines("axisZ", [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  axisZ.color = new Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
};
