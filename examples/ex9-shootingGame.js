import {
  Canvas,
  drawText,
  Point,
  Vector2i,
  Circle,
  Rectangle,
  Circles,
  moveTowards,
} from "../src/Canvas.js";

console.log("Started");

let ScreenX = 800;
let ScreenY = 800;

const canvas = new Canvas(ScreenX, ScreenY, "CanvasDiv", "canvas");
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

let actor = new Circle(new Vector2i(origin.x, origin.y), 10, "blue", false, 2);
actor.speed = 3;
let enemySpeed = 0.02;

class bullet {
  constructor(origin, direction) {
    this.size = 2;
    this.o = origin;
    this.d = direction;
    this.circle = new Circle(this.o, this.size, true);
    this.scale;
  }

  next(s) {
    let dir = new Vector2i(this.d.x, this.d.y);
    dir.scaleVector(s);
    this.o.subtractVector(dir);
    this.circle = new Circle(this.o, this.size, true);
  }
}

let bullets = [];
let walls = [];
let enemies = [];
let previousFireTime = 0;

//Add ememies
let numberOfEnemies = 500;
for (let i = 0; i < numberOfEnemies; i++) {
  enemies.push(
    new Circle(
      new Vector2i(Math.random() * ScreenX, Math.random() * ScreenY),
      6,
      "red",
      true
    )
  );
}

//Add Walls
let numberOfWalls = 50;
for (let i = 0; i < numberOfWalls; i++) {
  walls.push(
    new Rectangle(
      new Vector2i(Math.random() * ScreenX, Math.random() * ScreenY),
      new Vector2i(Math.random() * 50, Math.random() * 50)
    )
  );
}

//Calculate next frames
let calculate = function (time) {
  if (A) {
    actor.center.x -= 3;
  }
  if (D) {
    actor.center.x += 3;
  }

  if (W) {
    actor.center.y -= 3;
  }

  if (S) {
    actor.center.y += 3;
  }

  previousFireTime += time;
  if (previousFireTime > 0.02) {
    previousFireTime = 0;
  }

  // moveTowards(c2.center, actor.center, enemySpeed);

  // Circles.circleRectCollisionResolve(actor, r2);

  if (mouseDown && previousFireTime == 0) {
    let to = new Vector2i(mouse.x, mouse.y);
    let from = new Vector2i(actor.center.x, actor.center.y);
    let towards = Vector2i.vectorFromTwoPoints(
      new Vector2i(actor.center.x, actor.center.y),
      new Vector2i(to.x, to.y)
    );
    towards.normalize();
    bullets.push(new bullet(from, towards));
  }

  bullets = bullets.filter((bullet) => {
    if (
      bullet.o.x >= ScreenX ||
      bullet.o.y >= ScreenY ||
      bullet.o.y <= 0 ||
      bullet.o.x <= 0
    ) {
    } else {
      bullet.next(5);
      for (let i = 0; i < walls.length; i++) {
        if (Circles.circleRectCollision(bullet.circle, walls[i])) {
          return;
        }
      }
      for (let i = 0; i < enemies.length; i++) {
        if (Circles.checkCollision(bullet.circle, enemies[i])) {
          enemies = enemies.filter((enemy, j) => {
            if (i === j) return;
            return enemy;
          });
          return;
        }
      }

      bullet.circle.draw(ctx);
      return bullet;
    }
  });

  //Ememy Enemy Collision
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (i == j) {
      } else {
        Circles.resolveCollision(enemies[i], enemies[j]);
      }
    }
  }

  //Wall Enemy and Actor collision
  walls.forEach((wall) => {
    Circles.circleRectCollisionResolve(actor, wall);
    enemies.forEach((enemy) => {
      moveTowards(enemy.center, actor.center, enemySpeed);
      Circles.circleRectCollisionResolve(enemy, wall);
    });
  });
};

let draw = function (deltaTime) {
  // tiles.forEach(tile => {
  //   new Rectangle(tile, tileSizeVector).toggleFilled().draw(ctx);
  // });
  calculate(deltaTime);
  actor.draw(ctx);
  walls.forEach((wall) => {
    wall.draw(ctx, "pink");
  });
  enemies.forEach((enemy) => {
    enemy.draw(ctx);
  });

  //mouse pointer
  mouse.draw(ctx, "blue", 5);
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
