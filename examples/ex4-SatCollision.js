import { Canvas, drawText, Point, Vector2i, Polygon, Line } from "./src/Canvas.js";

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

const satCollision = function (poly1, poly2) {
  let v1 = poly1.vertices;
  let v2 = poly2.vertices;
}

let poly2 = new Polygon();
poly2.createPolygonWithNumberOfSides(origin.x-100, origin.y -100, 60, 4);

let draw = function () {
  mouse.draw(ctx, 'lightgrey', 3);

  let poly1 = new Polygon();
  poly1.createPolygonWithNumberOfSides(mouse.x, mouse.y, 100, 4);

  let collision = Polygon.SatStaticResolution(poly2, poly1);

  if(collision) {
    poly1.draw(ctx, 'yellow', 2);
    poly2.draw(ctx, 'green', 2);
  }else {
    poly1.draw(ctx, 'red', 2);
    poly2.draw(ctx, 'blue', 2);
  }

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
