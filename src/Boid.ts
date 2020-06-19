import {
  Vector3,
  InstantiatedEntries
} from "babylonjs";

import * as config from './config.json';

export class Boid {

  static boids: Boid[] = [];

  private model: InstantiatedEntries;

  private maxSpeed: number;
  private position: Vector3;
  private velocity: Vector3;

  constructor(model: InstantiatedEntries) {
    // Add the boid to the list of boids
    Boid.boids.push(this);

    this.model = model;
    this.maxSpeed = config.boids.maxSpeed;
    // Start with a random position
    this.position = new Vector3(
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10)
    );
    // Start with a random velocity
    this.velocity = new Vector3(
      (Math.random() * 2) - 1, 
      (Math.random() * 2) - 1, 
      (Math.random() * 2) - 1
    );

    this.initModel();
  }

  private initModel() {
    this.model.animationGroups[0].start(true);
    this.model.rootNodes[0].position = this.position;
  }

  update() {
    this.updatePosition();

    this.model.rootNodes[0].position = this.position;
  }

  private updatePosition(): void {
    this.velocity
      .addInPlace(this.calcCohesion())
      .addInPlace(this.calcSeparation())
      .addInPlace(this.calcAlignment());

    // this.velocity.scaleInPlace(this.maxSpeed);

    this.position.addInPlace(this.velocity);

    this.hitWall();
  }


  private updatePositionv2() :void {
    // Find the new acceleration
    const steer = this.updateSteer();

    // Apply the acceleration to calculate the new position
    this.position.addInPlace(this.velocity);
    this.velocity.addInPlace(steer);

    // Temp function until I get the boids to move away from the wall
    this.hitWall();
  }

  private updateSteer(): Vector3 {
    let desired = new Vector3();

    // Move the boid away from the wall
    // desired.addInPlace(this.calcWallForce());

    // Apply boid flocking rules
    desired.addInPlace(this.calcCohesion());
    desired.addInPlace(this.calcSeparation());
    desired.addInPlace(this.calcAlignment());

    // Limit the max speed
    // desired.scaleInPlace(this.maxSpeed);
    // desired.normalizeFromLength(desired.length()).scale(this.maxSpeed);

    // Apply the desired force
    return desired.subtractInPlace(this.velocity);
  }

  // http://www.kfish.org/boids/pseudocode.html
  // Rule 1
  private calcCohesion(): Vector3 {
    // Vector pc
    let centerOfMass = new Vector3();
    let movementTowardsCenter = config.boids.movementTowardsCenter;

    // FOR EACH BOID b
    for(let i = 0; i < Boid.boids.length; i++) {
      let b = Boid.boids[i];
      // IF b != this THEN
      if(b !== this) {
        // pc = pc + b.position
        centerOfMass.addInPlace(b.position);
      }
    }

    // pc = pc / N-1
    centerOfMass.scaleInPlace(1/Boid.boids.length)
    // RETURN (pc - this.position) / 100
    return centerOfMass.subtract(this.position).scale(movementTowardsCenter);
  }

  // Rule 2
  private calcSeparation(): Vector3 {

    // Vector c = 0;
    let c = new Vector3();

    const separationDistance = config.boids.separationDistance;

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

    return c;
  }

  // Rule 3
  private calcAlignment(): Vector3 {
    // Vector pvJ
    let perceivedVelocity = new Vector3();

    const alignmentConstant = config.boids.alignmentConstant;

    // FOR EACH BOID b
    for(let i = 0; i < Boid.boids.length; i++) {
      let b = Boid.boids[i];
      // 	IF b != this THEN
      if(b !== this) {
        // 		pvJ = pvJ + b.velocity
        perceivedVelocity.addInPlace(b.velocity);
      }
    }
    // pvJ = pvJ / N-1
    perceivedVelocity.scaleInPlace(1/Boid.boids.length);

    // RETURN (pvJ - this.velocity) / 8
    return perceivedVelocity.subtract(this.velocity).scale(alignmentConstant);
  }

  private hitWall(): void {
    const border = config.world.size;

    const { x, y, z } = this.position;

    if (x <= 0) {
      this.position.x = border;
    }
    if (x >= border) {
      this.position.x = 0;
    }
    if (y <= 0) {
      this.position.y = border;
    }
    if (y >= border) {
      this.position.y = 0;
    }
    if (z <= 0) {
      this.position.z = border;
    }
    if (z >= border) {
      this.position.z = 0;
    }
  }

  private calcWallForce(): Vector3 {
    return new Vector3(0,0,0);
    const threshold = config.world.threshold;
    const border = config.world.size;

    const { x, y, z } = this.position;

    let wallForce = new Vector3(0, 0, 0);

    // x = 0
    if (x <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(threshold - x, 0, 0));
    }
    // x = border
    if (x >= border - threshold) {
      wallForce.addInPlace(new Vector3(-(threshold - (border - x)), 0, 0));
    }
    // y = 0
    if (y <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(0, threshold - y, 0));
    }
    // y = border
    if (y >= border - threshold) {
      wallForce.addInPlace(new Vector3(0, -(threshold - (border - y)), 0));
    }
    // z = 0
    if (z <= 0 + threshold) {
      wallForce.addInPlace(new Vector3(0, 0, threshold - z));
    }
    // z = border
    if (z >= border - threshold) {
      wallForce.addInPlace(new Vector3(0, 0, -(threshold - (border - z))));
    }

    wallForce.scaleInPlace(config.world.wallForceStrength);
    return wallForce;
  }
}
