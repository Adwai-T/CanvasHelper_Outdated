export class Canvas {
  constructor(width, height, elementId, id) {
    Canvas.numberOfCanvas++;
    this.width = width;
    this.height = height;

    //Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.tabIndex = 1;
    this.canvas.style = "border:1px solid #000000; cursor: none";
    document.getElementById(elementId).appendChild(this.canvas);

    if (typeof id === "string") {
      this.canvas.id = id;
      this.id = id;
    }

    this.ctx = this.canvas.getContext("2d");
  }

  setID(id) {
    this.id = id;
  }

  getCanvasElement() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

/**
 * Get a Random Color in Hex
 */
export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Load and return Image
 * @param {string} source
 * @returns{ Image }
 */
export function loadImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}

/**
 * Load Files from server.
 * @param {string} relative path to file resource
 * @returns { Promise }
 */
export function loadFile(src) {
  return new Promise((resolve, reject) => {
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", src);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE) {
        console.log("resolve");
        return resolve(xhttp.response);
      }
    };
  });
}

/**
 *
 * @param { canvas.ctx } context
 * @param { image } image
 * @param { Rectangle } rect_ImageSource
 * @param { Rectangle } rect_drawImage
 */
export function drawSprite(context, image, rect_ImageSource, rect_drawImage) {
  if (image) {
    context.drawImage(
      image,
      rect_ImageSource.vec.x,
      rect_ImageSource.vec.y,
      rect_ImageSource.width,
      rect_ImageSource.height, //src coords
      rect_drawImage.vec.x,
      rect_drawImage.vec.y,
      rect_drawImage.width,
      rect_drawImage.height //dst coords
    );
  }
}

//--- Vector

/**
 * Create a Vector of two integer
 * All things vector are calculated to the origin.
 */
export class Vector2i {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toPoint() {
    return new Point(this.x, this.y);
  }

  isEqual(vector) {
    if (this.x === vector.x && this.y === vector.y) {
      return true;
    } else return false;
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getMagnitudeSquare() {
    return this.x * this.x + this.y * this.y;
  }

  /**Turn a non-zero vector into a vector of unit length*/
  normalize() {
    let length = this.getMagnitude();

    if (length > 0) {
      this.x = this.x / length;
      this.y = this.y / length;
    }
  }

  getNormalized() {
    let length = this.getMagnitude();

    if (length > 0) {
      return new Vector2i(this.x / length, this.y / length);
    } else return new Vector2i(0, 0);
  }

  getSlope() {
    return this.y / this.x;
  }

  getDirection(inDegrees) {
    if (inDegrees) {
      return (Math.atan(this.y / this.x) * 180) / Math.PI;
    }
    return Math.atan(this.y / this.x);
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
  }

  /**
   * Multiply a scalar value with this vector.
   * The parameter to pass is a scalar value not a vector.
   */
  scaleVector(value) {
    this.x *= value;
    this.y *= value;
  }

  getScaledVector(value) {
    return new Vector2i(this.x * value, this.y * value);
  }

  /**Add another vector to this vector */
  addVector(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  getAdditionVector(vector) {
    return new Vector2i(this.x + vector.x, this.y + vector.y);
  }

  /**Subtract given vector from this vector */
  subtractVector(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  getSubtractionVector(vector) {
    return new Vector2i(this.x - vector.x, this.y - vector.y);
  }

  /**Add scaled vector to this vector */
  addScaledVector(vector, scale) {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
  }

  /**Component Product : Similar to adding and subtracting. Has no direct geometric significance. */
  componentProduct(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  }

  getComponentProductVector(vector) {
    return new Vector2i(this.x * vector.x, this.y * vector.y);
  }

  /**Scalar Product of given vector with this vector. */
  getScalarProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  getDotProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  getInnerProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  //The scalar value returned =>
  //a.b = |a||b|cos(theta) =>
  //theta represents the angle between the two given vectors

  getAngleBetweenVector(vector, inRadian) {
    let angle = Math.acos(
      this.getDotProduct(vector) / (this.getMagnitude * vector.getMagnitude)
    );

    if (inRadian) return angle;
    else return toDegree(angle);
  }

  getProjectionVector(vector) {
    let dotProdcut = this.getDotProduct(vector) / vector.getMagnitudeSquare();
    return vector.getScaledVector(dotProdcut);
  }

  getReflectionVector(normal) {
    let projectVector = this.getProjectionVector(normal);
    console.log(projectVector);
    projectVector.scaleVector(2);
    console.log(projectVector);
    // return this.getSubtractionVector(projectVector);
    return projectVector.getSubtractionVector(this);
  }

  getNormal(antiClockwise) {
    if (antiClockwise) {
      return new Vector2i(-1 * this.y, this.x);
    }
    return new Vector2i(this.y, -1 * this.x);
  }

  translate(vec) {
    this.addVector(vec);
  }

  getTranslated(vec) {
    return this.getAdditionVector(vec);
  }

  reflectX() {
    this.y = -this.y;
  }

  getReflectX() {
    return new Vector2i(this.x, -this.y);
  }

  reflectY() {
    this.x = -this.x;
  }

  getReflectY() {
    return new Vector2i(-this.x, this.y);
  }

  reflectOrigin() {
    this.x = -this.x;
    this.y = -this.y;
  }

  getReflectOrigin() {
    return new Vector2i(-this.x, -this.y);
  }
}

Vector2i.vectorFromTwoPoints = function (point1, point2) {
  return new Vector2i(point1.x - point2.x, point1.y - point2.y);
};

//--- Angle Utility functions
export function toRadian(angle) {
  return angle * 0.0174533;
}

export function toDegree(angle) {
  return angle * 57.295754;
}

//--- Text
export function drawText(ctx, text, x, y, color, font, align) {
  if (color) ctx.fillStyle = color;
  if (font) ctx.font = font;
  if (align) ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

//--- Points

/**
 * Create A point of two integer positions x and y.
 * Has a draw function
 */
export class Point {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = 1;
    if (size) {
      this.size = size;
    }
    this.color = "black";
    if (color) {
      this.color = color;
    }
  }

  draw(context, color, size) {
    if (!color) {
      color = this.color;
    }

    if (!size) {
      size = this.size;
    }

    context.fillStyle = color;
    if (size > 1) {
      context.beginPath();
      context.arc(this.x, this.y, size, 0, 2 * Math.PI);
      context.fill();
    } else {
      context.fillRect(this.x, this.y, 1, 1);
    }
  }

  toVector() {
    return new Vector2i(this.x, this.y);
  }
}

/**
 * Join points in an array, sequenced according to index of the points.
 * @param {context} context
 * @param {Array} points
 * @param {string} color
 * @param {Number} thickness
 */
Point.joinPointArray = function (context, points, color, thickness) {
  if (typeof color === "string") {
    context.strokeStyle = color;
  }

  if (typeof thickness === "number" && thickness > 1) {
    context.lineWidth = thickness;
  }

  if (Array.isArray(points)) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();
  }
};

//--- Lines
export class Line {
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }

  draw(context, color, thickness) {
    if (typeof color === "string") {
      context.strokeStyle = color;
    }

    if (typeof thickness === "number") {
      context.lineWidth = thickness;
    }

    context.beginPath();
    context.moveTo(this.point1.x, this.point1.y);
    context.lineTo(this.point2.x, this.point2.y);
    context.stroke();
  }

  getSlope() {
    return (this.point1.y - this.point2.y) / (this.point1.x - this.point2.x);
  }

  getLength() {
    return Math.sqrt(
      Math.pow(this.point1.x - this.point2.x, 2) +
        Math.pow(this.point1.y - this.point2.y, 2)
    );
  }

  getAngleWithXAxis(inDegrees) {
    if (inDegrees) {
      return (Math.atan(this.getSlope()) * 180) / Math.PI;
    } else {
      return Math.atan(this.getSlope());
    }
  }
}

/**
 * Get the point of intersection between two lines.
 * @param {Line} line1
 * @param {Line} line2
 */
Line.getIntersectionPoint = function (line1, line2) {
  const x1 = line1.point1.x;
  const y1 = line1.point1.y;
  const x2 = line1.point2.x;
  const y2 = line1.point2.y;
  const x3 = line2.point1.x;
  const y3 = line2.point1.y;
  const x4 = line2.point2.x;
  const y4 = line2.point2.y;

  //Line line intersection on wiki : https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  let intersectionPoint = new Point(0, 0);

  //Cant divide by zero, denominator can be negative value;
  if (denominator !== 0) {
    intersectionPoint.x =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      denominator;
    intersectionPoint.y =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      denominator;
    return intersectionPoint;
  } else return false;
};

/**
 * Get the angle between two given lines.
 * @param {Line} line1
 * @param {Line} line2
 * @param {boolean} inDegrees
 */
Line.getAngleBetweenLines = function (line1, line2, inDegrees) {
  let m1 = line1.getSlope();
  let m2 = line2.getSlope();

  if (inDegrees) {
    return (Math.atan((m1 - m2) / (1 + m1 * m2)) * 180) / Math.PI;
  }
  return Math.atan((m1 - m2) / (1 + m1 * m2));
};

//--- Rectangle
export class Rectangle {
  constructor(vec1, vec2) {
    this.vec = vec1;
    this.width = vec2.x;
    this.height = vec2.y;
    this.vec_center = new Vector2i(
      (vec1.x + vec2.x + vec1.x) / 2,
      (vec1.y + vec2.y + vec1.y) / 2
    );
    this.color = "black";
    this.isSolid = true;
  }

  draw(context, color) {
    if (typeof color === "string") {
      context.fillStyle = color;
    } else {
      context.fillStyle = this.color;
    }
    if(this.isSolid)
      context.fillRect(this.vec.x, this.vec.y, this.width, this.height);
    else 
      context.strokeRect(this.vec.x, this.vec.y, this.width, this.height);
  }

  drawSprite(context, image, vec_startLocation, img_width, img_height) {
    if (image) {
      context.drawImage(
        image,
        vec_startLocation.x,
        vec_startLocation.y,
        img_width,
        img_height, //src coords
        this.vec.x,
        this.vec.y,
        this.width,
        this.height //dst coords
      );
    }
  }

  rotateSpriteAndDraw(
    context,
    image,
    angle,
    vec_startLocation,
    img_width,
    img_height
  ) {
    if (image) {
      context.save();
      context.translate(
        this.vec.x + this.width / 2,
        this.vec.y + this.height / 2
      );
      context.rotate(angle); //* Math.PI / 180);
      //We dont need to have the x and y  position of the image as we have already
      //translated to that location and draw the image directly.
      context.drawImage(
        image,
        vec_startLocation.x,
        vec_startLocation.y,
        img_width,
        img_height,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      context.restore();
    }
  }
}

//--- Circle
//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
export class Circle {
  constructor(center, radius, color, isSolid, thickness) {
    this.center = center;
    this.radius = radius;
    this.isSolid = typeof(isSolid) === 'boolean' ? isSolid : false;
    this.thickness =  typeof(thickness)=== 'number' ? isSolid : 1;
    this.color = typeof(color) === 'string' ? color : 'black';
  }

  draw(ctx, thickness, color) {
    color = typeof(color) === 'string' ? color : this.color;
    thickness = typeof(color) === 'number' ? thickness : this.thickness;

    if(this.isSolid) {
      ctx.fillStyle = color;
    }else {
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
    this.isSolid ? ctx.fill() : ctx.stroke();
  }
}

Circle.checkCollision = function(c1, c2) {
  let minDist = c1.radius + c2.radius;
  let dist = Math.pow(c1.center.x - c2.center.x, 2) + Math.pow(c1.center.y - c2.center.y, 2);
  minDist = minDist * minDist;
  if(minDist > dist) {
    return true;
  }else {
    return false;
  }
}

Circle.resolveCollision = function(c1, c2) {
  let minDist = c1.radius + c2.radius;
  let dist = Math.pow(c1.center.x - c2.center.x, 2) + Math.pow(c1.center.y - c2.center.y, 2);
  dist = Math.sqrt(dist);
  if(minDist > dist) {

    let offset = minDist - dist;
    let axis = Vector2i.vectorFromTwoPoints(c1.center, c2.center);
    axis.normalize();
    axis.scaleVector(offset);
    
    c2.center.subtractVector(axis);
    return;
  }else {
    return false;
  }
}

//--- Polygon
export class Polygon {
  constructor() {

    this.vertices = [];
    /**
   * Only works if the polygon is created with createPolygonWithNumberOfSides.
   * Center Value should only be used if necessary.
   * Use the recalcuateCenter function to update the value of center as it is not update automatically once it is created.
   */
    this.center = new Vector2i(0, 0);
    this.radius = 0;
    //In radians
    this.angle = 0;
    this.color = 'black';
  }

  addPoint(vec) {
    this.vertices.push(vec);
  }

  removeLastPoint() {
    this.vertices.pop();
  }

  getVertices() {
    return this.vertices;
  }

  moveToPoint(origin) {
    this.vertices.forEach((vec) => {
      vec.reflectX();
      vec.translate(origin);
    });
  }

  createPolygonWithNumberOfSides(centreX, centreY, radius, numPoints) {

    this.center = new Vector2i(centreX, centreY);
    this.radius = radius;

    let angle = (2 * Math.PI) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      let x = centreX + radius * Math.sin(i * angle);
      let y = centreY + radius * Math.cos(i * angle);

      this.vertices.push(new Vector2i(x, y));
    }
  }

  recalculateVertices() {
    let angle = (2 * Math.PI) / (this.vertices.length);
    let newVertices = [];
    
    for (let i = 0; i < this.vertices.length; i++) {
      let x = this.center.x + this.radius * Math.sin(i * angle);
      let y = this.center.y + this.radius * Math.cos(i * angle);

      newVertices.push(new Vector2i(x, y));
    }

    this.vertices = newVertices;
  }

  /**
   * Only works if the polygon is created with createPolygonWithNumberOfSides.
   * Also polygon can be translated but not rotated for it to work.
   */
  recalculateCenter() {
    let vertex = this.vertices[this.vertices.length - 1];
    this.center.x = vertex.x;
    this.center.y = vertex.y - this.radius;
  }

  // recalculateVerticesAccordingToAngle(){
  //   this.vertices.forEach((v, i) => {
  //     this.vertices[i].x = this.vertices[i].x * Math.cos(this.angle) - this.vertices[i].y * Math.sin(this.angle);
  //     this.vertices[i].y = this.vertices[i].x * Math.sin(this.angle) - this.vertices[i].y * Math.cos(this.angle);
  //   });
  // }

  getAxes() {
    let axes = [];

    for (let i = 0; i < this.vertices.length; i++) {
      let j = (i + 1) % this.vertices.length;

      axes.push(
        new Vector2i(
          this.vertices[j].x - this.vertices[i].x,
          this.vertices[j].y - this.vertices[i].y
        )
      );
    }

    return axes;
  }

  getNormals() {
    let normals = [];

    for (let i = 0; i < this.vertices.length; i++) {
      let j = (i + 1) % this.vertices.length;

      normals.push(
        new Vector2i(
          -1 * (this.vertices[j].y - this.vertices[i].y),
          this.vertices[j].x - this.vertices[i].x
        ).getNormalized()
      );
    }

    return normals;
  }

  /**
   * Polygons are drawn based on the vertices array,
   * and does not take into consideration the center value.
   */
  draw(ctx, thickness, color) {
    if(!color || color == undefined) {
      color = this.color;
    }

    if(!thickness || thickness == undefined) {
      thickness = 1;
    }

    for (let i = 0; i < this.vertices.length - 1; i++) {

      new Line(this.vertices[i], this.vertices[i + 1]).draw(
        ctx,
        color,
        thickness
      );
    }
    new Line(this.vertices[0], this.vertices[this.vertices.length - 1]).draw(
      ctx,
      color,
      thickness
    );
  }
}

/**
 * Returns true if there is a collision.
 */
Polygon.SatCollision = function (poly1, poly2) {
  let v1 = poly1.vertices;
  let v2 = poly2.vertices;

  //Check for Normals of poly1 axes
  for (let i = 0; i < v1.length; i++) {
    let j = (i + 1) % v1.length;
    let normal = new Vector2i(
      -1 * (v1[j].y - v1[i].y),
      v1[j].x - v1[i].x
    ).getNormalized();

    let max1 = -Infinity;
    let min1 = Infinity;
    v1.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max1 = Math.max(max1, dot);
      min1 = Math.min(min1, dot);
    });

    let max2 = -Infinity;
    let min2 = Infinity;
    v2.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max2 = Math.max(max2, dot);
      min2 = Math.min(min2, dot);
    });

    if (!(
      (min1 < max2 && min1 > min2) ||
      (min2 < max1 && min2 > min1)
    )) {
      return false;
    }
  }

  //Check for Normals of poly2 axes
  for (let i = 0; i < v2.length; i++) {
    let j = (i + 1) % v2.length;
    let normal = new Vector2i(
      -1 * (v2[j].y - v2[i].y),
      v2[j].x - v2[i].x
    ).getNormalized();

    let max1 = -Infinity;
    let min1 = Infinity;
    v1.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max1 = Math.max(max1, dot);
      min1 = Math.min(min1, dot);
    });

    let max2 = -Infinity;
    let min2 = Infinity;
    v2.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max2 = Math.max(max2, dot);
      min2 = Math.min(min2, dot);
    });

    if (!(
      (min1 < max2 && min1 > min2) ||
      (min2 < max1 && min2 > min1)
    )) {
      return false;
    }
  }
  return true;
};

Polygon.SatStaticResolution = function (poly1, poly2) {
  let v1 = poly1.vertices;
  let v2 = poly2.vertices;

  let overlap1 = Infinity;
  let overlap2 = Infinity;
  let overlap = Infinity;
  
  //Check for Normals of poly1 axes
  for (let i = 0; i < v1.length; i++) {
    let j = (i + 1) % v1.length;
    let normal = new Vector2i(
      -1 * (v1[j].y - v1[i].y),
      v1[j].x - v1[i].x
    ).getNormalized();

    let max1 = -Infinity;
    let min1 = Infinity;
    v1.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max1 = Math.max(max1, dot);
      min1 = Math.min(min1, dot);
    });

    let max2 = -Infinity;
    let min2 = Infinity;
    v2.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max2 = Math.max(max2, dot);
      min2 = Math.min(min2, dot);
    });

    if (!(
      (min1 < max2 && min1 > min2) ||
      (min2 < max1 && min2 > min1)
    )) {
      return false;
    }
    overlap1 = Math.min(Math.min(max1, max2) - Math.max(min1, min2), overlap1);
  }

  //Check for Normals of poly2 axes
  for (let i = 0; i < v2.length; i++) {
    let j = (i + 1) % v2.length;
    let normal = new Vector2i(
      -1 * (v2[j].y - v2[i].y),
      v2[j].x - v2[i].x
    ).getNormalized();

    let max1 = -Infinity;
    let min1 = Infinity;
    v1.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max1 = Math.max(max1, dot);
      min1 = Math.min(min1, dot);
    });

    let max2 = -Infinity;
    let min2 = Infinity;
    v2.forEach((v) => {
      let dot = normal.getDotProduct(v);
      max2 = Math.max(max2, dot);
      min2 = Math.min(min2, dot);
    });

    if (!(
      (min1 < max2 && min1 > min2) ||
      (min2 < max1 && min2 > min1)
    )) {
      return false;
    }

    overlap2 = Math.min(Math.min(max1, max2) - Math.min(min1, min2), overlap2);
  }

  /*
  * Commented section of code can be used to resolve collision by using side,
  * but it wont work for rotated shapes.
  */

  overlap = Math.min(overlap1, overlap2);
  // poly1.recalculateCenter();
  // poly2.recalculateCenter();
  // console.log(poly2.center, poly2.vertices[poly2.vertices.length - 1]);

  let transVec = new Vector2i(poly2.center.x - poly1.center.x, poly2.center.y - poly1.center.y);
  transVec.normalize();
  transVec.scaleVector(overlap);

  poly1.center.x  = poly1.center.x - transVec.x;
  poly1.center.y  = poly1.center.y - transVec.y;

  poly1.recalculateVertices();

  // poly1.vertices.forEach((vertex, i) => {
  //   poly1.vertices[i].subtractVector(transVec);
  // });
  return false;
};

//--- Tile Map Utility functions
export class Tiles {}

/**
 * Precalculate the origin coordinate for each tile in a tile map and store in an array.
 * @param {number} rows
 * @param {number} columns
 * @param {number} tileSize
 */
Tiles.generateTileArray = function (rows, columns, tileSize) {
  let tileArray = [];

  for (let row = 0; rows > row; row++) {
    for (let col = 0; columns > col; col++) {
      tileArray.push(new Vector2i(col * tileSize, row * tileSize));
    }
  }

  return tileArray;
};

/**
 * This gives the cell number calculated going from left to right and returning to leftmost column for next row.
 * Row and Column are not origin points of the rectangle representing the tile but actual row and column number.
 * @param {number} row
 * @param {number} column
 * @param {number} totalColumns
 */
Tiles.getCellNumber = function (row, column, totalColumns) {
  return row * column + column - totalColumns;
};

/**
 * Gives Row Number count starting from 1
 * @param {number} cellNumber
 * @param {number} totalColumns
 */
Tiles.getRow = function (cellNumber, totalColumns) {
  let row = cellNumber / totalColumns;
  let deltarow = row - Math.floor(row);
  if (deltarow !== 0) {
    row++;
  }
  return Math.floor(row);
};

/**
 * Gives Column Number count starting from 1
 * @param {number} cellNumber
 * @param {number} totalColumns
 */
Tiles.getColumn = function (cellNumber, totalColumns) {
  let colNumber = cellNumber % totalColumns;

  if (colNumber === 0) {
    return totalColumns;
  } else return colNumber;
};

/**
 * Draw a single tile at given position from the Tile image to the screen.
 * @param {Canvas.context} context
 * @param {image} tilesImage
 * @param {Vector2i} imageOrigin UpperRight corner of selected tile
 * @param {number} tileSizeOfImage Original Tile size in image
 * @param {Vector2i} drawOrigin Upper Right corner the Tile to be drawn
 * @param {number} drawTileSize Size of tile to be drawn
 */
Tiles.drawTile = function (
  context,
  tilesImage,
  imageOrigin,
  tileSizeOfImage,
  drawOrigin,
  drawTileSize
) {
  context.drawImage(
    tilesImage,
    imageOrigin.x,
    imageOrigin.y,
    tileSizeOfImage,
    tileSizeOfImage,
    drawOrigin.x,
    drawOrigin.y,
    drawTileSize,
    drawTileSize
  );
};

//--- Entities help function

//add gravity
export function addPhysics() {

}
