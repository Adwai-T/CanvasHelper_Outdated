import { Canvas } from "./src/Canvas.js";
import { drawImage, loadImage, rotateAndDrawImage } from "./src/Images.js";
import { Angle, Circle, Line, Point, Vector2i } from "./src/Primitives.js";
import { drawText } from "./src/Text.js";
import { Animation } from "./src/Animation.js";

const canvas = new Canvas(720, 480, "CanvasDiv", "canvas");
let ctx = canvas.ctx;
let canvasRect = canvas.canvas.getBoundingClientRect();

//---Display Mouse location
let mouse = new Vector2i(0, 0);
canvas.canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX - canvasRect.left;
  mouse.y = event.clientY - canvasRect.top;
});

// -- Load Image
let flameSprite = loadImage("../examples/resources/Blueflame_low.png");
let bullet = loadImage('../examples/resources/bullet_violet.png');

const drawMouse = function () {
  mouse.toPoint().draw(ctx, "grey", 3);
};

const fireAnim = new Animation();
fireAnim.spriteSheet = flameSprite;
fireAnim.numberOfSprites = 16;
fireAnim.calculateSpritePostions(new Vector2i(38, 55));
fireAnim.setTime(2.5);
fireAnim.addState('fullFlame', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2);
fireAnim.setState('fullFlame');
fireAnim.addState('lowFlame', [0, 1, 2, 3, 4], 1);


let bulletPosition = new Vector2i(0, 0);
let bulletDirectionAngle;
const calculate = function(deltaTime) {
  let direct = new Vector2i(mouse.x - bulletPosition.x, mouse.y - bulletPosition.y);
  let bulletDirectionAngle = direct.getDirection(true);
  console.log(bulletDirectionAngle);
}

const draw = function (deltaTime) {
  calculate(deltaTime);
  rotateAndDrawImage(ctx, bullet, new Vector2i(100, 100), (new Angle(0)).getRadian());
};

let deltaTime = 0;
let lastTimeStamp = 0;
const FPSCORDS = { x: canvas.width - 50, y: 20 };
//---Update
let update = function (timestamp) {
  deltaTime = timestamp - lastTimeStamp;
  canvas.clearCanvasWithColor('black');
  let fps = Math.round(1000 / deltaTime);
  if (fps >= 30) drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "green");
  else drawText(ctx, "FPS " + fps, FPSCORDS.x, FPSCORDS.y, "red");
  draw(deltaTime / 1000);
  drawMouse();
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
};
window.requestAnimationFrame(update);
