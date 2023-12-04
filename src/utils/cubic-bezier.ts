import { Point } from 'src/types/common';

export const cubicBezier = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const p = {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };

  return p;
};

export const getCubicBezierY = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): number => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
  return y;
};

export const getCubicBezierX = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): number => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  return x;
};

export const getClosestXFromYBezier = (
  yTarget: number,
  sP: Point,
  cP1: Point,
  cP2: Point,
  eP: Point,
  yTolerance = 0.45
): number => {
  const bezierArgs = [sP, cP1, cP2, eP] as const;

  let lower = 0;
  let upper = 1;
  let percent = (upper + lower) / 2;

  let y = getCubicBezierY(...bezierArgs, percent);

  while (Math.abs(yTarget - y) > yTolerance) {
    if (yTarget > y) lower = percent;
    else upper = percent;

    percent = (upper + lower) / 2;
    y = getCubicBezierY(...bezierArgs, percent);
  }

  return getCubicBezierX(...bezierArgs, percent);
};
