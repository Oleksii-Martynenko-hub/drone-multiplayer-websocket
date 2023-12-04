export function randomNumber(max: number, min = 0, isFloat = false) {
  const result = Math.random() * (max - min + (isFloat ? 0 : 1)) + min;
  return isFloat ? result : Math.floor(result);
}
