const { getData } = require('../../utils');

const TURNS = 35;
const TREE = '#';

const convertSection = sourceString => sourceString.split('\n');

const addToBaseSection = (baseStr, addStr) => {
  const baseArray = convertSection(baseStr);
  const addArray = convertSection(addStr);
  return baseArray.map((elem, idx) => `${elem}${addArray[idx]}`).join('\n');
};

const createTemplate = source => {
  let template = source.slice(0, -1);
  let i = 0;

  while (i < TURNS) {
    template = addToBaseSection(template, source.slice(0, -1));
    i++;
  }
  return template;
};

const createMatrix = source => {
  const oneLevelMatrix = convertSection(source);
  return oneLevelMatrix.map(elem => elem.split(''));
};

const checkIsTreeHere = (arr, row, column) => (arr[row][column] === TREE ? 1 : 0);

const moveDown = matrix => {
  const LAST_ROW = matrix.length - 1;
  let rowIdx = 1;
  let columnIdx = 3;
  let treeCount = 0;

  while (rowIdx <= LAST_ROW) {
    treeCount += checkIsTreeHere(matrix, rowIdx, columnIdx);
    rowIdx++;
    columnIdx += 3;
  }

  return treeCount;
};

module.exports = () => getData('https://adventofcode.com/2020/day/3/input')
  .then(createTemplate)
  .then(createMatrix)
  .then(moveDown);
