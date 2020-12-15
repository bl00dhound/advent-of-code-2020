const R = require('ramda');
const { getData, breakByNewLines, splitByParameter } = require('../../utils');

let accumulator = 0;
let visitedPositions = new Set();

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

const changeInstructions = action => instructions => {
  const elements = instructions.reduce((acc, elem, idx) => [...acc, [elem, idx]], []);
  const changeTo = action === 'nop' ? 'jmp' : 'nop';

  elements.forEach(([elem, idx]) => {
    const newInstructions = instructions
      .slice(0, idx)
      .concat(elem.replace(action, changeTo))
      .concat(instructions.slice(idx + 1));

    try {
      accumulator = 0;
      visitedPositions = new Set();

      runProgram(newInstructions);
    } catch (e) {
      console.log('\x1b[35m%s\x1b[0m', '************************************ START **************************************');
      console.log('BINGO', '****************** "BINGO" ********************');
      console.log(accumulator, '****************** accumulator ********************'); // TODO remove console.log
      console.log('\x1b[35m%s\x1b[0m', '************************************ END **************************************');
    }
  });
};

module.exports = () => getData('https://adventofcode.com/2020/day/8/input')
  .then(breakByNewLines)
  .then(R.tap(changeInstructions('nop')))
  .then(R.tap(changeInstructions('jmp')));
