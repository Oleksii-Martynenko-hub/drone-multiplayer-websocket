import { maxMin } from './max-min';
import { randomNumber } from './random-number';
import { getClosestXFromYBezier } from './cubic-bezier';

const getLeftRightXByCenterAndWidth = (center: number, width: number) => {
  const left = Math.round(center - width / 2);
  const right = Math.round(center + width / 2);
  return [left, right];
};

const getPointsToCalcBezierX = (startX: number, endX: number, endY: number) => {
  return [
    { x: startX, y: 0 },
    { x: startX, y: endY / 2 },
    { x: endX, y: endY / 2 },
    { x: endX, y: endY },
  ] as const;
};

/**
 *
 * @param complexity difficulty level of cave min 0 max 10
 * @param wallQuantity how many walls (positions.length + 1) will be generated
 * @param wallHeight increase to more accuracy calculate x position (decr. optimization)
 * @returns walls [number, number][], each array is position of cave wall by x axis,
 *  first number is left wall, second number is right wall
 * @description start from center (x = 0), with init width (~150-74, depends on complexity)
 */

export const generateCaveWallsByComplexity = (
  complexity: number,
  wallQuantity = 1000,
  wallHeight = 10
) => {
  const gameFieldWidth = 500;
  const gameFieldPaddings = 20;

  let lastPosition = 0;
  let lastWidth = Math.round(150 - 7.6 * complexity);

  // start position
  const walls = [[lastPosition - lastWidth / 2, lastPosition + lastWidth / 2]];

  const maxWidth = lastWidth + lastWidth / 3;
  const minWidth = lastWidth - lastWidth / 3;
  const maxDistance = 300 + complexity * 10;
  const minDistance = 10 + complexity * 5;
  const maxWalls = 55 - 1.5 * complexity;
  const minWalls = 25 - 1.5 * complexity;

  while (walls.length < wallQuantity) {
    const moveLeftPercent = 50 - lastPosition * -0.25;
    let isMoveLeft = Math.random() <= moveLeftPercent / 100;

    const newWidth = randomNumber(maxWidth, minWidth);
    const maxPos = gameFieldWidth / 2 - gameFieldPaddings - newWidth / 2;
    const minPos = -(gameFieldWidth / 2 - gameFieldPaddings) + newWidth / 2;

    const availableDistance = Math.abs(
      (isMoveLeft ? minPos : maxPos) - lastPosition
    );
    const distance = maxMin(availableDistance, maxDistance, minDistance);
    isMoveLeft = availableDistance < minDistance ? !isMoveLeft : isMoveLeft;

    const moveBy = randomNumber(distance, minDistance);
    const moveToPosition = moveBy * (isMoveLeft ? -1 : 1) + lastPosition;
    const wallsAmount = randomNumber(maxWalls, minWalls);
    const distanceY = wallsAmount * wallHeight;
    const widthChangeStep = (newWidth - lastWidth) / wallsAmount;

    // generate positions between lastPosition and position destination
    for (let y = wallHeight; y < distanceY; y += wallHeight) {
      if (walls.length > wallQuantity) break;
      const currentWidth = lastWidth + widthChangeStep * (y / wallHeight);

      const newPositionX = getClosestXFromYBezier(
        y,
        ...getPointsToCalcBezierX(lastPosition, moveToPosition, distanceY)
      );

      walls.push(getLeftRightXByCenterAndWidth(newPositionX, currentWidth));
    }

    if (walls.length > wallQuantity) break;

    // to more accuracy position of last point set it by hand
    walls.push(getLeftRightXByCenterAndWidth(moveToPosition, newWidth));

    lastWidth = newWidth;
    lastPosition = moveToPosition;
  }

  return walls;
};
