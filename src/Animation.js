import { drawSprite } from "./Images.js";
import { Rectangle, Vector2i } from "./Primitives.js";

export class Animation {
  // Sprite Image
  spriteSheet;
  // Sprites
  numberOfSprites;
  //vector Array of origins
  _spritePositions = [];
  _states = {
    currentState: "",
    currentFrame: 0,
  };
  spriteSize;

  time;
  _timePerFrame;
  _totalDeltaTime = 0;

  calculateSpritePostions(spriteSize) {
    this.spriteSize = spriteSize;
    this._spritePositions = [];
    let currentPosition = new Vector2i(0, 0);
    this._spritePositions.push(currentPosition.getNewVector());

    for (let i = 1; i < this.numberOfSprites; i++) {
      currentPosition.x += spriteSize.x;
      this._spritePositions.push(currentPosition.getNewVector());
    }
  }

  setSpriteOriginPositions(positions) {
    this._spritePositions = positions;
  }

  setTime(time) {
    this.time = time;
    this._timePerFrame = this.time / this.numberOfSprites;
    this._totalDeltaTime = 0;
  }

  addState(name, framesArray, animationTime) {
    let tpf= animationTime/framesArray.length;
    this._states[name] = {
      frames: framesArray,
      time: animationTime,
      timePerFrame: tpf,
    };
  }

  setState(name) {
    this._states.currentState = name;
    this._states.currentFrame = 0;
    this._totalDeltaTime = 0;
  }

  removeState(name) {
    delete this._states[name];
  }

  _getCurrentFramePosition(deltaTime) {
    this._totalDeltaTime += deltaTime;
    if (this._totalDeltaTime > this.time) {
      this._totalDeltaTime = 0;
      return this._spritePositions[0];
    } else {
      return this._spritePositions[
        Math.floor(this._totalDeltaTime / this._timePerFrame)
      ];
    }
  }

  _getCurrentStateFramePosition(deltaTime) {
    this._totalDeltaTime += deltaTime;
    if (this._totalDeltaTime >= this._states[this._states.currentState].time) {
      this._totalDeltaTime = 0;
      return this._spritePositions[this._states[this._states.currentState].frames[0]];
    } else {
      return this._spritePositions[this._states[this._states.currentState].frames[
        Math.floor(this._totalDeltaTime / this._states[this._states.currentState].timePerFrame)
      ]];
    }
  }

  draw(context, position, deltaTime, withState) {
    //--- Without a state, animate all frames in the sheet
    if(!withState) {
      drawSprite(
        context,
        this.spriteSheet,
        new Rectangle(this._getCurrentFramePosition(deltaTime), this.spriteSize),
        new Rectangle(position, this.spriteSize)
      );
    }
    else {
      let currentFramePosition = this._getCurrentStateFramePosition(deltaTime);
      drawSprite(
        context,
        this.spriteSheet,
        new Rectangle(currentFramePosition, this.spriteSize),
        new Rectangle(position, this.spriteSize)
      );
    }

  }
}
