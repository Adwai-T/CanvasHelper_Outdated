import {
  Canvas,
  drawText,
  Point,
  Vector2i,
} from "./src/Canvas.js";

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

let allVec = [];
let origin = new Vector2i(250, 250);

allVec.forEach((vec) => {
  vec.reflectX();
  vec.translate(origin);
});

let draw = function () {
  origin.toPoint().draw(ctx, "black", 2);
  mouse.draw(ctx, "lightgrey", 3);
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
//---Update
let update = function (timestamp) {
  deltaTime = timestamp - lastTimeStamp;
  // console.log(1000/deltaTime);
  canvas.clearCanvas();
  let fps = Math.round(1000 / deltaTime);
  if (fps >= 30) drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "green");
  else drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "red");
  draw();
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
};
window.requestAnimationFrame(update);
