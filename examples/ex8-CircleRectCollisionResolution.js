import {
  Canvas,
  drawText,
  Point,
  Vector2i,
  Circle,
  Rectangle,
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

//--- Input Events
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

// let tileSize = 20;
// let tileSizeVector = new Vector2i(tileSize, tileSize);
// let tiles = Tiles.generateTileArray(25, 25, tileSize);

const startPoint = new Point(10, 10);
const endPoint = new Point(100, 200);
let actor = new Circle(
  new Vector2i(startPoint.x, startPoint.y),
  10,
  "blue",
  false,
  2
);
actor.speed = 3;

let c1 = new Circle(mouse, 50, "violet", false, 1);
let r1 = new Rectangle(
  new Vector2i(100, 250),
  new Vector2i(150, 100)
).toggleFilled();
let r2 = new Rectangle(
  new Vector2i(10, 100),
  new Vector2i(100, 25)
).toggleFilled();

let obstacleCircle = [];
let obstacleSquare = [];

let calculate = function (time) {
  if (
    actor.center.x >= endPoint.x &&
    actor.center.x <= endPoint.x + actor.speed
  ) {
    actor.speed = 0;
    return;
  }

  let direction = Vector2i.vectorFromTwoPoints(actor.center, endPoint);
  direction.normalize();
  direction.scaleVector(actor.speed);

  actor.center.x -= direction.x;
  actor.center.y -= direction.y;

  //collision
  let separationVec = Circles.circleRectCollisionResolve(c1, r1);
  if (separationVec) {
    r1.color = "red";
  } else {
    r1.color = "blue";
  }
  Circles.circleRectCollisionResolve(actor, r2);
};

let draw = function (deltaTime) {
  mouse.draw(ctx, "lightgrey", 3);

  // tiles.forEach(tile => {
  //   new Rectangle(tile, tileSizeVector).toggleFilled().draw(ctx);
  // });
  calculate(deltaTime);

  startPoint.draw(ctx, "green", 5);
  endPoint.draw(ctx, "red", 5);
  actor.draw(ctx);
  r1.draw(ctx);
  c1.draw(ctx);
  r2.draw(ctx);
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
