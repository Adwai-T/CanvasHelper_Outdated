/**
 * Main canvas class, helps create canvas context and draw on it.
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {string} elementId - Id of element in Dom to which canvas element create is to be appended.
 * @param {string} id - id to be set of the created element.
 * @class
 */
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

  /**
   * Get canvas element created.
   * @param {string} id - sets id of the created canvas element.
   */
  setID(id) {
    this.id = id;
    this.canvas.id = id;
  }

  /**
   * Get canvas element created.
   * @returns {HTMLCanvasElement}
   */
  getCanvasElement() {
    return this.canvas;
  }

  /**
   * Get 2d Context of the Canvas Element
   * @returns {HTMLCanvasElement.context}
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Set style of the canvas. eg : "border:1px solid #000000; cursor: none" which is set by default.
   * @param {string} style
   */
  setStyle(style) {
    this.canvas.style = style;
  }

  /**
   * Clear the context of the Canvas Element
   */
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