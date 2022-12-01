import { Canvas } from "./src/Canvas.js";
import { Point, Vector2i } from "./src/Primitives.js";
import { drawText } from "./src/Text.js";

const canvas = new Canvas(500, 500, "CanvasDiv", "canvas");
let ctx = canvas.ctx;
let canvasRect = canvas.canvas.getBoundingClientRect();

//---Display Mouse location
let mouse = new Point(0, 0);
canvas.canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX - canvasRect.left;
  mouse.y = event.clientY - canvasRect.top;
});

let origin = new Vector2i(250, 250);

let calculate = function (time) {};

let draw = function (deltaTime) {
  mouse.draw(ctx, "lightgrey", 3);
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
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
