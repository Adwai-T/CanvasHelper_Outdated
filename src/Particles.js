//--- Entities help function ---//

import { Vector2i } from "./Primitives.js";

//--- Particles
export let Particles = {
  all: [],
};

//add physics data
Particles.makeParticle = function (...shapes) {
  // this.all.push(...shapes);

  shapes.forEach((shape) => {
    shape.mass = 1;
    shape.velocity = new Vector2i(0, 0);
    shape.acceleration = new Vector2i(0, 0);
    shape.force = new Vector2i(0, 0);
  });
};

Particles.calculate = function (deltatime) {
  this.all.forEach((particle, i) => {
    let accn = new Vector2i(
      particle.force.x / particle.mass,
      particle.force.y / particle.mass
    );
    particle.velocity.x += accn.x * deltatime;
    particle.velocity.y += accn.y * deltatime;
    particle.center.x += particle.velocity.x * deltatime;
    particle.center.y += particle.velocity.y * deltatime;
  });
};

//--- Bullets
/**
 * @class
 * @param {Vector2i} origin - Point of origin/start of bullet
 * @param {Vector2i} direction - Noramlized vector represeting the direction of travel of the bullet
 */
export class Bullets {
  constructor(origin, direction) {
    this.size = 2;
    this.o = origin;
    this.d = direction;
    this.circle = new Circle(this.o, this.size, true);
    this.scale;
  }

  /**
   * Calculates and moves this bullet to its next position.
   * @param {number} s - Distance to tbe traveled by bullet per tic
   */
  next(s) {
    let dir = new Vector2i(this.d.x, this.d.y);
    dir.scaleVector(s);
    this.o.subtractVector(dir);
    this.circle = new Circle(this.o, this.size, true);
  }
}
