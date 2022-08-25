import { Canvas, Line, Point, Vector2i } from "../src/Canvas.js";

console.log("Started"); 

let canvas = new Canvas(500, 500, 'CanvasDiv', 'canvas');
let ctx = canvas.ctx;
let canvasRect = canvas.canvas.getBoundingClientRect();

//---Display Mouse location
let mouse = new Point(0, 0);
canvas.canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX - canvasRect.left;
  mouse.y = event.clientY - canvasRect.top;
});

let allVec = [];
let origin = new Vector2i(250,250);

let vec = new Vector2i(50, 10);
vec.scaleVector(2);
let normal1 = vec.getNormal();
let normal2 = vec.getNormal(true);
allVec.push(vec, normal1, normal2);

let vec2 = new Vector2i(50, 50);
allVec.push(vec2);

let vec2proj = vec2.getProjectionVector(vec);
allVec.push(vec2proj);

let reflectionVector = vec2.getReflectionVector(vec);
allVec.push(reflectionVector);

//--Translate to new origin at center of canvass
allVec.forEach(vec => {
  vec.reflectX()
  vec.translate(origin);
});

let draw = function() {
  origin.toPoint().draw(ctx, "black", 2);
  mouse.draw(ctx, "lightgrey", 3);

  vec.toPoint().draw(ctx, "green", 2);
  normal1.toPoint().draw(ctx, "red", 2);
  normal2.toPoint().draw(ctx, "red", 2);
  vec2.toPoint().draw(ctx, "blue", 2);
  vec2proj.toPoint().draw(ctx, "purple", 2);
  reflectionVector.toPoint().draw(ctx, "purple", 2);
  allVec.forEach(vec => {
    new Line(vec, origin).draw(ctx, "black", 1);    
  });

  new Line(vec2, reflectionVector).draw(ctx, 'purple', 1);
}

let deltaTime = 0;
let lastTimeStamp = 0;
//---Update
let update = function(timestamp) {
  deltaTime = timestamp - lastTimeStamp;
  // console.log(1000/deltaTime);
  canvas.clearCanvas();
  draw();
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
}
window.requestAnimationFrame(update)