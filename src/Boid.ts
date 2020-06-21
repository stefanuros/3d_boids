import {
  Vector3,
  InstantiatedEntries
} from "babylonjs";

import * as config from './config.json';

export class Boid {

  static boids: Boid[] = [];

  private model: InstantiatedEntries;

  private maxSpeed: number;
  private minSpeed: number;
  private position: Vector3;
  private velocity: Vector3;

  constructor(model: InstantiatedEntries) {
    // Add the boid to the list of boids
    Boid.boids.push(this);

    this.model = model;
    this.maxSpeed = config.boids.maxSpeed;
    this.minSpeed = config.boids.minSpeed;
    // Start with a random position
    this.position = new Vector3(
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10)
    );
    // Start with a random velocity
    this.velocity = new Vector3(
      (Math.random() * 10) - 1, 
      (Math.random() * 10) - 1, 
      (Math.random() * 10) - 1
    );

    this.initModel();
  }

  private initModel() {
    try {
      this.model.animationGroups[0].start(true);
    }
    catch(e) {}

    this.model.rootNodes[0].position = this.position;
  }

  update() {
    this.updatePosition();

    this.rotateBoid();
    this.model.rootNodes[0].position = this.position;
  }

  private rotateBoid(): void {
    this.model.rootNodes[0]
      .lookAt(this.position.add(this.velocity))
      .rotate(new Vector3(0, 1, 0), Math.PI);
  }

  private updatePosition(): void {
    this.velocity
      .addInPlace(this.calcCohesion())
      .addInPlace(this.calcSeparation())
      .addInPlace(this.calcAlignment())
      .addInPlace(this.calcWallForce());

    // Check if its above the speed limit
    if(this.velocity.length() > this.maxSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.maxSpeed);
    }
    else if(this.velocity.length() < this.minSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.minSpeed);
    }

    this.position.addInPlace(this.velocity);
  }

  private updatePositionv3(): void {

    this.velocity
      .addInPlace(this.calcCohesion())
      .addInPlace(this.calcSeparation())
      .addInPlace(this.calcAlignment())
      .addInPlace(this.calcWallForce());

    // Check if its above the speed limit
    if(this.velocity.length() > this.maxSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.maxSpeed);
    }
    else if(this.velocity.length() < this.minSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.minSpeed);
    }

    this.position.addInPlace(this.velocity);
  }

  private updatePositionv2() :void {
    const desired = new Vector3()
      .addInPlace(this.calcCohesion())
      .addInPlace(this.calcSeparation())
      .addInPlace(this.calcAlignment())
      .addInPlace(this.calcWallForce());

    // Find the new acceleration
    const steer = desired.subtract(this.velocity);

    // Apply the acceleration to calculate the new position
    this.velocity.addInPlace(steer);
    
    // Check if its above the speed limit
    if(this.velocity.length() > this.maxSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.maxSpeed);
    }
    else if(this.velocity.length() < this.minSpeed) {
      // Make a unit vector
      this.velocity.scaleInPlace(1/this.velocity.length());
      this.velocity.scaleInPlace(this.minSpeed);
    }

    this.position.addInPlace(this.velocity);
  }

  // http://www.kfish.org/boids/pseudocode.html
  // Rule 1
  private calcCohesion(): Vector3 {
    // Vector pc
    let centerOfMass = new Vector3();
    let cohesionMultiplier = config.boids.cohesionMultiplier;
    const viewDistance = config.boids.viewDistance;

    let numBoids = 0;

    // FOR EACH BOID b
    for(let i = 0; i < Boid.boids.length; i++) {
      let b = Boid.boids[i];
      // IF b != this THEN
      if(this.position.subtract(b.position).length() < viewDistance) {
        numBoids++;
        // pc = pc + b.position
        centerOfMass.addInPlace(b.position);
      }
    }

    // pc = pc / N-1
    centerOfMass.scaleInPlace((numBoids !== 0 ? 1/numBoids : 0));
    // RETURN (pc - this.position) / 100
    return centerOfMass.subtract(this.position).scale(cohesionMultiplier);
  }

  // Rule 2
  private calcSeparation(): Vector3 {

    // Vector c = 0;
    let c = new Vector3();

    const separationDistance = config.boids.separationDistance;
    const separationMultiplier = config.boids.separationMultiplier;

    // FOR EACH BOID b
    for(let i = 0; i < Boid.boids.length; i++) {
      const b = Boid.boids[i];
      // IF b != this THEN
      if(b !== this) {
        // IF |b.position - this.position| < 100 THEN
        if(b.position.subtract(this.position).length() < separationDistance) {
          // c = c - (b.position - this.position)
          c.subtractInPlace(b.position.subtract(this.position));
        }
      }
    }

    return c.scale(separationMultiplier);
  }

  // Rule 3
  private calcAlignment(): Vector3 {
    // Vector pvJ
    let perceivedVelocity = new Vector3();

    const alignmentMultiplier = config.boids.alignmentMultiplier;
    const viewDistance = config.boids.viewDistance;
    let numBoids = 0;

    // FOR EACH BOID b
    for(let i = 0; i < Boid.boids.length; i++) {
      let b = Boid.boids[i];
      // 	IF b != this THEN
      if(this.position.subtract(b.position).length() < viewDistance) {
        numBoids++;
        // 		pvJ = pvJ + b.velocity
        perceivedVelocity.addInPlace(b.velocity);
      }
    }
    // pvJ = pvJ / N-1
    perceivedVelocity.scaleInPlace((numBoids !== 0 ? 1/numBoids : 0));

    // RETURN (pvJ - this.velocity) / 8
    return perceivedVelocity.subtract(this.velocity).scale(alignmentMultiplier);
  }

  private calcWallForce(): Vector3 {
    const threshold = config.world.threshold;
    const border = config.world.size;
    const wallForceConstant = config.boids.wallForceConstant;

    const { x, y, z } = this.position;

    let wallForce = new Vector3(0, 0, 0);

    // x = 0
    if (x <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(wallForceConstant, 0, 0));
    }
    // x = border
    if (x >= border - threshold) {
      wallForce.addInPlace(new Vector3(-wallForceConstant, 0, 0));
    }
    // y = 0
    if (y <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(0, wallForceConstant, 0));
    }
    // y = border
    if (y >= border - threshold) {
      wallForce.addInPlace(new Vector3(0, -wallForceConstant, 0));
    }
    // z = 0
    if (z <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(0, 0, wallForceConstant));
    }
    // z = border
    if (z >= border - threshold) {
      wallForce.addInPlace(new Vector3(0, 0, -wallForceConstant));
    }

    return wallForce;
  }
}
