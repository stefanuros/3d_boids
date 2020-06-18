import {
  Vector3,
  InstantiatedEntries
} from "babylonjs";

import * as config from './config.json';

export class Boid {
  private maxSpeed: number = 0.1;
  private position: Vector3;
  private velocity: Vector3;
  private acceleration: Vector3;

  private model: InstantiatedEntries;

  constructor(model: InstantiatedEntries) {
    this.model = model;
    this.position = new Vector3(
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10),
      Math.random() * (config.world.size - 10)
    );
    this.velocity = new Vector3(
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI
    );
    this.velocity = new Vector3(1, 0, 0);

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

  private updatePosition() {
    // Find the new acceleration
    this.updateSteer();

    // Apply the acceleration to calculate the new position
    this.position.addInPlace(this.velocity);
    this.velocity.addInPlace(this.acceleration);
    this.acceleration.scaleInPlace(0);
  }

  private updateSteer() {
    // Find the desired velocity
    let desired = new Vector3(1, 1, 1);
    desired.addInPlace(this.calcWallForce());

    console.log(desired);
    console.log();
    console.log();
    console.log();

    desired.scaleInPlace(this.maxSpeed);

    const steer = desired.subtractInPlace(this.velocity);
    this.acceleration = steer;
  }

  private calcWallForce() {
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
