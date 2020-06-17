import { 
  Vector3, 
  Camera as BabylonCamera,
  Scene,
  UniversalCamera
} from "babylonjs";

export class Camera {
  private camera: UniversalCamera;
  private position: Vector3;

  private isLocked: boolean = false;

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

  private requestPointerLock(canvas: HTMLCanvasElement, evt: PointerEvent) {
    //check if we're locked, faster than checking pointerlock on each single click.
    if (!this.isLocked) {
      canvas.requestPointerLock = 
        canvas.requestPointerLock || 
        canvas.msRequestPointerLock || 
        canvas.mozRequestPointerLock || 
        canvas.webkitRequestPointerLock;

      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  }

  // private pointerLockChange() {
  //   var controlEnabled = 
  //     document.mozPointerLockElement || 
  //     document.webkitPointerLockElement || 
  //     document.msPointerLockElement || 
  //     document.pointerLockElement || 
  //     null;
		
	// 	// If the user is already locked
	// 	if (!controlEnabled) {
	// 		//camera.detachControl(canvas);
	// 		isLocked = false;
	// 	} else {
	// 		//camera.attachControl(canvas);
	// 		isLocked = true;
	// 	}
  // }

  handleKeypress(actionMap: {[key: string]: boolean}) {
    if ((actionMap["W"])) {
      this.position.x -= 0.1;
    };

    if ((actionMap["S"])) {
        this.position.x += 0.1;
    };

    if ((actionMap["A"])) {
        this.position.z -= 0.1;
    };

    if ((actionMap["D"])) {
        this.position.z += 0.1;
    };
  }
}
