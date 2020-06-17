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
  Color3,
  Light,
  AssetContainer,
  ActionManager,
  ExecuteCodeAction,
  UniversalCamera
} from 'babylonjs';
import 'babylonjs-loaders';

import * as Stats from 'stats.js';

import { Camera } from './Camera';

import * as bluePlaneGLTF from '../assets/aviao_low_poly_alt/scene.gltf';
import { Boid } from './Boid';

export class Main {
  private canvas: HTMLCanvasElement;

  private engine: Engine;
  private scene: Scene;
  private light: Light;
  private camera: Camera;

  private stats: Stats;

  private model: AssetContainer;

  private boids: Boid[] = [];

  constructor() {
    console.log("Starting setup");

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.initEngine();
    this.scene = new Scene(this.engine);
    this.light = new HemisphericLight("HemiLight", new Vector3(1, 1, 1), this.scene);
    this.initCamera();
    this.initStats();

    this.showWorldAxis(100);

    this.createBoids();

    console.log("Finished setup. Starting render loop");

    this.engine.runRenderLoop(() => this.render());
  }

  private initEngine() {
    this.engine = new Engine(this.canvas, true);
    // Instruct the engine to resize when the window does.
    window.addEventListener('resize', () => this.engine.resize());
  }
  
  private initCamera() {
    this.camera = new Camera(new UniversalCamera("UniversalCam", new Vector3(), this.scene));
    this.camera.getCamera().attachControl(this.canvas, false);
    this.camera.initHandleMovement();

    // Enter pointer lock. Pressing `esc` escapes pointer lock
    this.scene.onPointerDown = evt => {
      this.engine.enterPointerlock();
    }
  }

  private initStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  async createBoids() {
    await this.loadGltf(bluePlaneGLTF);

    const numBoids = 3;

    for(let i = 0; i < numBoids; i++) {
      this.boids.push(
        new Boid(
          this.model.instantiateModelsToScene(), 
          new Vector3(-7 + (i*7), 0, 7 + (i*-7))
        )
      );
    }
  }

  private render() {
    this.stats.begin();

    for(let i = 0; i < this.boids.length; i++) {
      this.boids[i].update();
    }

    this.scene.render();
    this.stats.end();
  }

  // Animation duplicating playground here: https://www.babylonjs-playground.com/#S7E00P
  private async loadGltf(gltf: any) {
    this.model = await SceneLoader.LoadAssetContainerAsync('/', gltf, this.scene);
  }

  private showWorldAxis(size: number) {
    const makeTextPlane = (text: string, color: string, size: number) => {
      const dynamicTexture = new DynamicTexture("DynamicTexture", 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
      const plane = Mesh.CreatePlane("TextPlane", size, this.scene, true);
      const material = new StandardMaterial("TextPlaneMaterial", this.scene);
      plane.material = material;
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      return plane;
    };
    const axisX = Mesh.CreateLines("axisX", [
      Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ], this.scene);
    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
    const axisY = Mesh.CreateLines("axisY", [
      Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
    ], this.scene);
    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
    const axisZ = Mesh.CreateLines("axisZ", [
      Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
    ], this.scene);
    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  };
}
