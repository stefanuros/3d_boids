import { 
  Vector3,
  UniversalCamera
} from "babylonjs";

export class Camera {
  private camera: UniversalCamera;
  private position: Vector3;

  constructor(camera: UniversalCamera) {
    this.camera = camera;
    this.position = new Vector3(20, 15, 20);
    this.camera.position = this.position;
    this.camera.setTarget(new Vector3(0, 0, 0));
  }

  getCamera(): UniversalCamera {
    return this.camera;
  }

  // Camera controls coming from this playground: https://www.babylonjs-playground.com/#PLW9V9#19
  initHandleMovement() {
    //Controls  WASD
    this.camera.keysUp.push(87); 
    this.camera.keysDown.push(83);            
    this.camera.keysRight.push(68);
    this.camera.keysLeft.push(65);
  }
}
