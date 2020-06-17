import { 
  Vector3, 
  InstantiatedEntries 
} from "babylonjs";

export class Boid {
  private position: Vector3;

  private model: InstantiatedEntries;

  constructor(model: InstantiatedEntries, position: Vector3) {
    this.model = model;
    this.position = position;

    this.initModel();
  }

  private initModel() {
    this.model.animationGroups[0].start(true);
    this.model.rootNodes[0].position = this.position;
    this.model.rootNodes[0].addRotation(0, Math.PI/4, 0);
  }

  update() {
      this.updateRotationAndPosition();
  }

  // Temp function just to tyry out moving side to side
  updateRotationAndPosition() {
    const timer = 0.002 * Date.now() + this.position.x;
    this.model.rootNodes[0].rotation = new Vector3(0, Math.PI + Math.PI/4, 0.5 * Math.sin(timer));
  }
}
