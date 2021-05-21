import { Canvas, drawText, Point, Vector2i, Polygon, Line, getRandomColor, Circle } from "./src/Canvas.js";

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

let origin = new Vector2i(250, 250);

let circles = [];

for(let i = 0; i < 110; i++) {
  let c = new Vector2i(Math.random()*500, Math.random()*500);
  let r = Math.random() * 40;

  circles.push(new Circle(c, r, getRandomColor(), false, 1));
}

let draw = function () {
  mouse.draw(ctx, 'lightgrey', 3);

  let c = new Circle(mouse, 20, 'blue', false);

  circles.forEach((c2, i) => {
    Circle.resolveCollision(c, c2);
    circles.forEach((c3, j) => {
      !(i==j) ? Circle.resolveCollision(c2, c3) : 0 ;
    });
    c2.draw(ctx);
  });

  c.draw(ctx);
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
let framecount = 0;
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
  // console.log(framecount++);
};
window.requestAnimationFrame(update);
