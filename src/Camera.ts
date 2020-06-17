import { 
  Vector3, 
  Camera as BabylonCamera,
  ArcRotateCamera, 
} from "babylonjs";

export class Camera {
  private camera: BabylonCamera;
  private position: Vector3
  private rotation: Vector3

  constructor(camera: BabylonCamera) {
    this.camera = camera;
    this.position = new Vector3(15, 15, 15);
    this.camera.position = this.position;
  }

  getCamera(): BabylonCamera {
    return this.camera;
  }
}
