/*

  Circle Circle Collision Resolution.

*/

import {
  Canvas,
  drawText,
  Point,
  Vector2i,
  getRandomColor,
  Circle,
  Particles,
  Circles,
} from "../src/Canvas.js";

console.log("Started");

const canvas = new Canvas(500, 500, "CanvasDiv", "canvas");
let ctx = canvas.ctx;
let canvasRect = canvas.canvas.getBoundingClientRect();

//---Display Mouse location
let mouse = new Point(0, 0);
canvas.canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX - canvasRect.left;
  mouse.y = event.clientY - canvasRect.top;
});

let mouseDown = false;
let mouseUp = true;
let mouseRightDown = false;
let mouseRightUp = true;
let Q = false;
canvas.canvas.addEventListener("mousedown", (event) => {
  canvas.canvas.focus();

  if (event.button === 0) {
    mouseDown = true;
    mouseUp = false;
  }
  if (event.button === 2) {
    mouseRightDown = true;
    mouseRightUp = false;
  }
});
canvas.canvas.addEventListener("mouseup", (event) => {
  if (event.button === 0) {
    mouseDown = false;
    mouseUp = true;
  }
  if (event.button === 2) {
    mouseRightDown = false;
    mouseRightUp = true;
  }
});
canvas.canvas.addEventListener("keydown", (event) => {
  if (event.key == "q") {
    Q = true;
  }
});
canvas.canvas.addEventListener("keyup", (event) => {
  if (event.key == "q") {
    Q = false;
  }
});

let origin = new Vector2i(250, 250);

let circles = [];

for (let i = 0; i < 100; i++) {
  let c = new Vector2i(Math.random() * 500, Math.random() * 500);
  let r = Math.random() * 10 + 30;
  let circle = new Circle(c, r, getRandomColor(), false, 1);
  Particles.makeParticle(circle);
  circles.push(circle);
}

const calculate = function (circle, deltaTime) {
  circle.velocity.x += circle.acceleration.x * deltaTime;
  circle.velocity.y += circle.acceleration.y * deltaTime;

  circle.center.x += circle.velocity.x * deltaTime;
  circle.center.y += circle.velocity.y * deltaTime;
};

let draw = function (deltaTime) {
  mouse.draw(ctx, "lightgrey", 3);

  circles.forEach((c2, i) => {
    if (mouse.isInsideCircle(c2)) {
      if (mouseDown) {
        c2.center.x = mouse.x;
        c2.center.y = mouse.y;
      }
      if (Q) {
        c2.acceleration = Vector2i.vectorFromTwoPoints(mouse, c2.center);
        c2.acceleration.normalize();
        c2.acceleration.scaleVector(150);
      }
    }
    calculate(c2, deltaTime);

    circles.forEach((c3, j) => {
      !(i == j) ? Circles.resolveCollision(c2, c3) : 0;
    });
    c2.draw(ctx);
  });
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
let framecount = 0;
//---Update
let update = function (timestamp) {
  deltaTime = timestamp - lastTimeStamp;
  canvas.clearCanvas();
  let fps = Math.round(1000 / deltaTime);
  if (fps >= 30) drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "green");
  else drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "red");
  draw(deltaTime / 1000);
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
  // console.log(framecount++);
};
window.requestAnimationFrame(update);
