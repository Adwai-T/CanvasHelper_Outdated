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

//--- Input Events
let mouseDown = false;
let mouseUp = true;
let mouseRightDown = false;
let mouseRightUp = true;
let Q = false,
  A = false,
  D = false,
  W = false,
  S = false;
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
  if (event.key == "a") {
    A = true;
  }
  if (event.key == "d") {
    D = true;
  }
  if (event.key == "s") {
    S = true;
  }
  if (event.key == "w") {
    W = true;
  }
});
canvas.canvas.addEventListener("keyup", (event) => {
  if (event.key == "q") {
    Q = false;
  }
  if (event.key == "a") {
    A = false;
  }
  if (event.key == "d") {
    D = false;
  }
  if (event.key == "s") {
    S = false;
  }
  if (event.key == "w") {
    W = false;
  }
});

let origin = new Vector2i(250, 250);

let calculate = function (time) {
};

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
