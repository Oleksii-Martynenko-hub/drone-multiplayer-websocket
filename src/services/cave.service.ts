import { maxMin } from '../utils/max-min';
import { randomNumber } from '../utils/random-number';
import { getClosestXFromYBezier } from '../utils/cubic-bezier';

/**
 *
 * @param complexity difficulty level of cave min 0 max 10
 * @param wallQuantity how many walls (positions.length - 1) will be generated
 * @param wallHeight increase to more accuracy calculate x position (less optimization)
 * @returns walls [number, number][], each array is position of cave wall by x axis,
 *  first number is left wall, second number is right wall
 * @description start from center (x = 0), with init width (~150-74, depends on complexity)
 */
export class CaveService {
  static readonly separators = { wall: ';', sides: ',' };

  private lastPosition = 0;
  private lastCaveWidth: number;

  private walls: [number, number][];
  private readonly maxCaveWidth: number;
  private readonly minCaveWidth: number;
  private readonly maxDistance: number;
  private readonly minDistance: number;
  private readonly maxWallsOfPart: number;
  private readonly minWallsOfPart: number;

  constructor(
    private readonly complexity = 0,
    private readonly wallQuantity = 1000,
    private readonly gameFieldWidth = 500,
    private readonly gameFieldPaddings = 20,
    private readonly wallHeight = 10
  ) {
    this.lastCaveWidth = Math.round(150 - 7.6 * this.complexity);

    // start position
    this.walls = [
      [
        this.lastPosition - this.lastCaveWidth / 2,
        this.lastPosition + this.lastCaveWidth / 2,
      ],
    ];

    this.maxCaveWidth = this.lastCaveWidth + this.lastCaveWidth / 3;
    this.minCaveWidth = this.lastCaveWidth - this.lastCaveWidth / 3;
    this.maxDistance = 300 + this.complexity * 10;
    this.minDistance = 10 + this.complexity * 5;
    this.maxWallsOfPart = 55 - 1.5 * this.complexity;
    this.minWallsOfPart = 25 - 1.5 * this.complexity;
  }

  getCaveWalls() {
    return this.walls;
  }

  static turnCaveDataToArray(caveDataString: string) {
    const data = caveDataString
      .split(this.separators.wall)
      .map((w) => w.split(this.separators.sides))
      .map(([l, r]) => [+l, +r]);

    return data as [number, number][];
  }

  static turnCaveDataToString(walls: [number, number][]) {
    const string = walls
      .map((w) => w.join(this.separators.sides))
      .join(this.separators.wall);

    return string;
  }

  generateCaveWalls(isString: true): string;
  generateCaveWalls(isString: false): [number, number][];
  generateCaveWalls(isString = false) {
    while (this.walls.length < this.wallQuantity) {
      const direction = this.getRandomDirection(this.lastPosition);

      const newWidth = randomNumber(this.maxCaveWidth, this.minCaveWidth);

      const { availableDistance, currentDirection } =
        this.getAvailableDistanceAndDirection(newWidth, direction);

      const curveEndPositionX = this.getRandomEndPositionX(
        availableDistance,
        currentDirection,
        this.lastPosition
      );

      const randomWallsAmount = randomNumber(
        this.maxWallsOfPart,
        this.minWallsOfPart
      );

      /**
       * generate X positions of curved path between two points exclude those points,
       * start point - end of last cave part (this.lastPosition)
       * end point - randomly generated X position destination by available distance and direction,
       * Y position increments by this.wallHeight through iteration of randomWallsAmount
       */
      this.generateAndPushPartOfCave(
        curveEndPositionX,
        randomWallsAmount,
        newWidth
      );

      if (this.walls.length > this.wallQuantity) break;

      // to more accuracy position of last point set it by hand
      this.getSidePositionsAndPush(curveEndPositionX, newWidth);

      this.lastCaveWidth = newWidth;
      this.lastPosition = curveEndPositionX;
    }

    if (isString) return CaveService.turnCaveDataToString(this.walls);

    return this.walls;
  }

  private generateAndPushPartOfCave(
    startX: number,
    wallsAmount: number,
    newWidth: number
  ) {
    const endY = wallsAmount * this.wallHeight;

    for (let y = this.wallHeight; y < endY; y += this.wallHeight) {
      if (this.walls.length > this.wallQuantity) break;

      const widthChangeStep = (newWidth - this.lastCaveWidth) / wallsAmount;
      const currentWidth =
        this.lastCaveWidth + widthChangeStep * (y / this.wallHeight);

      const newPositionX = getClosestXFromYBezier(
        y,
        { x: startX, y: 0 },
        { x: startX, y: endY / 2 },
        { x: this.lastPosition, y: endY / 2 },
        { x: this.lastPosition, y: endY }
      );

      this.getSidePositionsAndPush(newPositionX, currentWidth);
    }
  }

  private getSidePositionsAndPush(centerPosition: number, width: number) {
    const left = Math.round(centerPosition - width / 2);
    const right = Math.round(centerPosition + width / 2);
    [left, right] as [number, number];

    this.walls.push([left, right]);
  }

  private getRandomDirection(lastPosition: number) {
    const maxPos =
      this.gameFieldWidth / 2 - this.gameFieldPaddings - this.minCaveWidth / 2;

    const midPercent = 50;

    const percentMultiplier = midPercent / maxPos;

    const currentMoveLeftPercent =
      midPercent - lastPosition * -percentMultiplier;

    const isMoveLeft = Math.random() <= currentMoveLeftPercent / 100;

    return isMoveLeft ? -1 : 1;
  }

  private getAvailableDistanceAndDirection(width: number, direction: number) {
    const halfGameFieldWithoutPaddings =
      this.gameFieldWidth / 2 - this.gameFieldPaddings;

    const maxPosition = halfGameFieldWithoutPaddings - width / 2;
    const minPosition = -halfGameFieldWithoutPaddings + width / 2;

    const position = direction < 0 ? minPosition : maxPosition;

    const availableDistance = Math.abs(position - this.lastPosition);

    const isChangeDirection = availableDistance < this.minDistance;

    const currentDirection = (
      isChangeDirection ? direction * -1 : direction
    ) as -1 | 1;

    return { availableDistance, currentDirection };
  }

  private getRandomEndPositionX(
    availableDistance: number,
    currentDirection: -1 | 1,
    lastPosition: number
  ) {
    const currentMaxDistance = maxMin(
      availableDistance,
      this.maxDistance,
      this.minDistance
    );

    const randomDistance = randomNumber(currentMaxDistance, this.minDistance);
    const randomEndPositionX = randomDistance * currentDirection + lastPosition;

    return randomEndPositionX;
  }
}
