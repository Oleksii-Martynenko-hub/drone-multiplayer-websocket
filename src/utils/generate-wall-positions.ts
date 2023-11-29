import { maxMin } from './max-min';
import { randomNumber } from './random-number';

export const generateWallsByComplexity = (complexity: number) => {
  const startPosition = 0;
  const startWidth = Math.round(150 - 7.6 * complexity);

  const walls = [
    [startPosition - startWidth / 2, startPosition + startWidth / 2],
  ];

  const step = 30 + 4 * complexity;
  const coeff = 0.3 + 0.04 * complexity;
  const maxWidthChange = startWidth / 3;
  const widthStep = 7 + 0.3 * complexity;
  const maxWidth = startWidth + maxWidthChange;
  const minWidth = startWidth - maxWidthChange;

  let lastStep = randomNumber((step / 5) * -1, step / 5);
  let lastPosition = startPosition;
  let lastWidth = startWidth;

  for (let i = 0; i < 1000; i++) {
    const widthChange = randomNumber(widthStep * -1, widthStep);
    const newWidth = maxMin(lastWidth + widthChange, maxWidth, minWidth);

    const maxPos = 235 - newWidth / 2;
    const minPos = -235 + newWidth / 2;

    const stepCoeff = randomNumber(0.1, coeff);
    const currentStep = maxMin(
      (lastStep || randomNumber((step / 5) * -1, step / 5)) * stepCoeff,
      step,
      step * -1
    );
    const newPosition = maxMin(lastPosition + currentStep, maxPos, minPos);

    const left = Math.round(newPosition - newWidth / 2);
    const right = Math.round(newPosition + newWidth / 2);

    walls.push([left, right]);

    lastStep = Math.round(currentStep);
    lastPosition = newPosition;
    lastWidth = newWidth;
  }

  return walls;
};
