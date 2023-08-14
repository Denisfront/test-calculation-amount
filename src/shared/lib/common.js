function createIncreasingNumberGenerator() {
  let currentNumber = 0;

  return function () {
    currentNumber++;
    return currentNumber;
  };
}

export const generateNumber = createIncreasingNumberGenerator();
