import { Point, Rectangle, Vector2i } from "./Primitives.js";

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
 * Draw Image at position
 * @param {Context} context Canvas Context 2D
 * @param {Image} image Loaded Image reference
 * @param {Vector2i} position Origin Position, Upper right corner
 */
export function drawImage(context, image, position) {
  if (image && context) {
    context.drawImage(image, position.x, position.y);
  }
}

function _drawImageAndBoundRect(context, image, position) {
  new Rectangle(position, new Vector2i(image.width, image.height)).draw(
    context,
    "red"
  );
  drawImage(context, image, position);
}

/**
 * Draw a rotated image to canvas.
 * @param {Context} context Canvas Context
 * @param {Image} image Loaded Image reference
 * @param {Vector2i} position Position of upper right corner of image
 * @param {Angle} angle Angle in Radian
 */
export function rotateAndDrawImage(context, image, position, angle) {
  if (image && context) {
    context.save();
    let imageCenter = new Vector2i(
      position.x + image.width / 2,
      position.y + image.height / 2
    );
    context.translate(imageCenter.x, imageCenter.y);

    let center = new Point(0, 0, 5, "red");
    center.draw(context);
    context.rotate(angle);
    drawImage(
      context,
      image,
      new Vector2i(-image.width / 2, -image.height / 2)
    );
    context.restore();
  }
}

/**
 * Draw Sprite
 * @param { HTMLCanvasElement.context } context -
 * @param { ImageData } image - Sprite Sheet Full Image
 * @param { Rectangle } rect_ImageSource - Rectange representing required sprite image
 * @param { Rectangle } rect_drawImage - Rectange representing where in context the sprite is to be drawn.
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

//--- Tile Map Utility functions ---/

//--- Tiles
/**
 * Tiles and Tile Map Utilities
 * @class
 */
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
