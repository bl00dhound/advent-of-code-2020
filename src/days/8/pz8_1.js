const { getData, breakByNewLines, splitByParameter } = require('../../utils');

let accumulator = 0;
const visitedPositions = new Set();

const parseInstruction = instruction => {
  const [action, rawValue] = splitByParameter(' ')(instruction);
  return [action, rawValue[0], Number(rawValue.slice(1))];
};

const addValue = (sum, sign, value) => (sign === '+' ? sum + value : sum - value);

const getNextPosition = (currentPosition, [action, sign, value]) => {
  switch (action) {
    case 'acc': {
      accumulator = addValue(accumulator, sign, value);
      return currentPosition + 1;
    }
    case 'jmp': {
      return addValue(currentPosition, sign, value);
    }
    default: {
      return currentPosition + 1;
    }
  }
};

const runProgram = instructions => {
  let accumulatorBackup = 0;
  let nextPosition = 0;
  let currentPosition = 0;

  while (true) {
    const instruction = instructions[currentPosition];

    accumulatorBackup = accumulator;
    nextPosition = getNextPosition(currentPosition, parseInstruction(instruction));

    if (visitedPositions.has(nextPosition)) return accumulatorBackup;

    visitedPositions.add(nextPosition);

    currentPosition = nextPosition;
  }
};

module.exports = () => getData('https://adventofcode.com/2020/day/8/input')
  .then(breakByNewLines)
  .then(runProgram);
