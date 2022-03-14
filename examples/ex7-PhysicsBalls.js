import {
  Canvas,
  drawText,
  Point,
  Vector2i,
  Polygon,
  Line,
  getRandomColor,
  Circle,
  Particles,
} from "./src/Canvas.js";

console.log("Started");

const screen = new Vector2i(600, 500);
const canvas = new Canvas(screen.x, screen.y, "CanvasDiv", "canvas");
let ctx = canvas.ctx;
let canvasRect = canvas.canvas.getBoundingClientRect();

//---Display Mouse location
let mouse = new Point(0, 0);
canvas.canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX - canvasRect.left;
  mouse.y = event.clientY - canvasRect.top;
});

let origin = new Vector2i(250, 250);

let p1 = new Circle(new Vector2i(150, 200), 30, "yellow", true);
let p2 = new Circle(new Vector2i(350, 200), 10, "green", true);

Particles.makeParticle(p1, p2);

p1.mass = 100;
p2.mass = 10;

// console.log(Particles.all);

let draw = function (deltaTime) {
  Particles.all.forEach((p) => {
    p.draw(ctx);
  });

  mouse.draw(ctx, "lightgrey", 3);
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
let framecount = 0;
//---Update
let update = function (timestamp) {
  deltaTime = timestamp - lastTimeStamp;
  let dt = deltaTime / 1000;
  // console.log(1000/deltaTime);
  canvas.clearCanvas();
  let fps = Math.round(1000 / deltaTime);
  if (fps >= 30) drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "green");
  else drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "red");
  draw(dt);
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
  // console.log(framecount++);
};
window.requestAnimationFrame(update);
