/*

  The Separating Axis Theorem (SAT for short) essentially states
  if you are able to draw a line to separate two polygons,
  then they do not collide.

  This is visualization of sat.

*/

import {
  Canvas,
  drawText,
  Point,
  Vector2i,
  Polygon,
  Line,
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

let origin = new Vector2i(0, 0);
let center = new Vector2i(250, 250);

let update1 = function () {
  let square = new Polygon();
  square.createPolygonWithNumberOfSides(mouse.x - 250, mouse.y - 250, 70, 5);

  let sqV = square.vertices;
  let drawSquare = new Polygon();
  sqV.forEach((vertex) => {
    drawSquare.addPoint(vertex.getTranslated(center));
  });

  let triangle = new Polygon();
  triangle.addPoint(new Vector2i(120, 120));
  triangle.addPoint(new Vector2i(125, 30));
  triangle.addPoint(new Vector2i(300, 75));
  let triV = triangle.vertices;
  let drawTriangle = new Polygon();
  triV.forEach((vertex) => {
    drawTriangle.addPoint(vertex.getTranslated(center));
  });

  //Calculate Normal For each side of the Square
  let normals = [];
  let axises = [];
  for (let i = 0; i < sqV.length; i++) {
    let normal = undefined;
    let axis = undefined;

    if (i == sqV.length - 1) {
      axis = Vector2i.vectorFromTwoPoints(sqV[0], sqV[i]);
    } else {
      axis = Vector2i.vectorFromTwoPoints(sqV[i], sqV[i + 1]);
    }

    normal = axis.getNormal().getNormalized();
    normals.push(normal);
    axises.push(axis);
  }
  let refAxises = normals.map((axis) => {
    return axis.getReflectOrigin();
  });

  //calculate normals for each side of triangle
  let triNormals = [];
  let triAxises = [];
  for (let i = 0; i < triV.length; i++) {
    let normal = undefined;
    let axis = undefined;

    if (i == triV.length - 1) {
      axis = Vector2i.vectorFromTwoPoints(triV[0], triV[i]);
    } else {
      axis = Vector2i.vectorFromTwoPoints(triV[i], triV[i + 1]);
    }

    normal = axis.getNormal().getNormalized();
    triNormals.push(normal);
    triAxises.push(axis);
  }
  let refAxisesTri = triNormals.map((axis) => {
    return axis.getReflectOrigin();
  });

  //--- Projections for square
  let projections = [];
  let intersectionIndexSquare = [];
  let intersectionIndexTri = [];
  normals.forEach((normal) => {
    let max = undefined,
      min = undefined;
    let maxproj = undefined,
      minproj = undefined;

    let minSquare = undefined;
    let maxSquare = undefined;

    sqV.forEach((vertex) => {
      let dotprod = vertex.getDotProduct(normal);
      if (max == undefined && min == undefined) {
        max = dotprod;
        min = dotprod;
        maxproj = vertex.getProjectionVector(normal);
        minproj = maxproj;
      }

      if (dotprod > max) {
        max = dotprod;
        maxproj = vertex.getProjectionVector(normal);
      }
      if (dotprod < min) {
        min = dotprod;
        minproj = vertex.getProjectionVector(normal);
      }
    });
    minSquare = min;
    maxSquare = max;
    projections.push(new Line(maxproj, minproj));

    maxproj = undefined;
    minproj = undefined;
    min = undefined;
    max = undefined;

    let minTri = undefined;
    let maxTri = undefined;

    triV.forEach((vertex) => {
      let dotprod = vertex.getDotProduct(normal);
      if (max == undefined && min == undefined) {
        max = dotprod;
        min = dotprod;
        maxproj = vertex.getProjectionVector(normal);
        minproj = maxproj;
      }

      if (dotprod > max) {
        max = dotprod;
        maxproj = vertex.getProjectionVector(normal);
      }
      if (dotprod < min) {
        min = dotprod;
        minproj = vertex.getProjectionVector(normal);
      }
    });
    minTri = min;
    maxTri = max;
    projections.push(new Line(maxproj, minproj));

    if (
      (minTri < maxSquare && minTri > minSquare) ||
      (minSquare < maxTri && minSquare > minTri)
    ) {
      intersectionIndexSquare.push(true);
    } else intersectionIndexSquare.push(false);
  });

  //---Projections for triangle
  let tirPorjections = [];
  triNormals.forEach((normal) => {
    let max = undefined,
      min = undefined;
    let maxproj = undefined,
      minproj = undefined;

    let minSquare = undefined;
    let maxSquare = undefined;

    sqV.forEach((vertex) => {
      let dotprod = vertex.getDotProduct(normal);
      if (max == undefined && min == undefined) {
        max = dotprod;
        min = dotprod;
        maxproj = vertex.getProjectionVector(normal);
        minproj = maxproj;
      }

      if (dotprod > max) {
        max = dotprod;
        maxproj = vertex.getProjectionVector(normal);
      }
      if (dotprod < min) {
        min = dotprod;
        minproj = vertex.getProjectionVector(normal);
      }
    });
    minSquare = min;
    maxSquare = max;
    tirPorjections.push(new Line(maxproj, minproj));

    maxproj = undefined;
    minproj = undefined;
    min = undefined;
    max = undefined;
    let minTri = undefined;
    let maxTri = undefined;

    triV.forEach((vertex) => {
      let dotprod = vertex.getDotProduct(normal);
      if (max == undefined && min == undefined) {
        max = dotprod;
        min = dotprod;
        maxproj = vertex.getProjectionVector(normal);
        minproj = maxproj;
      }

      if (dotprod > max) {
        max = dotprod;
        maxproj = vertex.getProjectionVector(normal);
      }
      if (dotprod < min) {
        min = dotprod;
        minproj = vertex.getProjectionVector(normal);
      }
    });
    minTri = min;
    maxTri = max;
    tirPorjections.push(new Line(maxproj, minproj));

    if (
      (minTri < maxSquare && minTri > minSquare) ||
      (minSquare < maxTri && minSquare > minTri)
    ) {
      intersectionIndexTri.push(true);
    } else intersectionIndexTri.push(false);
  });

  //---Translate to cneter
  //For Square
  normals.forEach((axis) => {
    axis.scaleVector(300);
    axis.translate(center);
  });
  refAxises.forEach((axis) => {
    axis.scaleVector(300);
    axis.translate(center);
  });
  let drawProjection = projections.map((projection) => {
    let vector = projection.point1.getTranslated(center);
    let vector2 = projection.point2.getTranslated(center);
    return new Line(vector, vector2);
  });
  //For Triangle
  triNormals.forEach((axis) => {
    axis.scaleVector(300);
    axis.translate(center);
  });
  refAxisesTri.forEach((axis) => {
    axis.scaleVector(300);
    axis.translate(center);
  });
  let drawProjectionTri = tirPorjections.map((projection) => {
    let vector = projection.point1.getTranslated(center);
    let vector2 = projection.point2.getTranslated(center);
    return new Line(vector, vector2);
  });

  mouse.draw(ctx, "lightgrey", 3);
  drawTriangle.draw(ctx, "green", 2);
  drawSquare.draw(ctx, "red", 2);
  let collision = true;
  // console.log(intersectionIndexSquare);
  intersectionIndexSquare.forEach((bool) => {
    if (!bool) {
      collision = false;
      return;
    }
  });
  intersectionIndexTri.forEach((bool) => {
    if(!bool) {
      collision = false;
      return;
    }
  });
  if (collision) {
    drawSquare.draw(ctx, "blue", 3);
  }

  //Draw for square
  normals.forEach((axis, i) => {
    new Line(axis, refAxises[i]).draw(ctx, "violet", 1);
  });
  intersectionIndexSquare.forEach((intesects, i) => {
    if (intesects) {
      drawProjection[i * 2].draw(ctx, "black", 2);
      drawProjection[i * 2 + 1].draw(ctx, "black", 2);
    } else {
      drawProjection[i * 2].draw(ctx, "red", 2);
      drawProjection[i * 2 + 1].draw(ctx, "red", 2);
    }
  });
  //Draw for Triangle
  triNormals.forEach((axis, i) => {
    new Line(axis, refAxisesTri[i]).draw(ctx, "blue", 1);
  });
  drawProjectionTri.forEach((proj) => {
    proj.draw(ctx, "green", 1);
  });
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
  update1();
  window.requestAnimationFrame(update);
  lastTimeStamp = timestamp;
};
window.requestAnimationFrame(update);
