/*

  SAT collision resolution example with triangle and squares.

*/

import { Canvas, drawText, Point, Vector2i, Polygon, Line, getRandomColor } from "../src/Canvas.js";

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

let poly2 = new Polygon();
poly2.createPolygonWithNumberOfSides(origin.x-100, origin.y -100, 60, 3);

let polygonArr = [];
for(let i = 0; i < 50; i++) {
  let offsetX = Math.random() * 450;
  let offsetY = Math.random() * 450;
  let radius = Math.random() * 80;
  let poly = new Polygon();
  poly.createPolygonWithNumberOfSides(offsetX, offsetY, radius,4);
  poly.color = getRandomColor();
  polygonArr.push(poly);
}

let draw = function () {
  mouse.draw(ctx, 'lightgrey', 3);

  let poly1 = new Polygon();
  poly1.createPolygonWithNumberOfSides(mouse.x, mouse.y, 20, 3);

  polygonArr.push(poly1);

  polygonArr.forEach((poly1, i) => {
    polygonArr.forEach((poly2, j) => {
      if(i == j) {

      }else {
        Polygon.SatStaticResolution(poly2, poly1);
      }
    });

    // if(poly1.center.x > 550 || poly1.center.y > 550) {
    //   polygonArr.
    // }
  });

  polygonArr.pop();

  poly1.draw(ctx, 2,'red');
  polygonArr.forEach(poly => {
    poly.draw(ctx);
  });
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
