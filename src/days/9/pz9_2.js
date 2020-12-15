const R = require('ramda');
const { getData, sum } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const PREAMBLE = 25;

const checkIsValidNumber = (amount, set) => {
  let i = set.length - 1;
  let j = set.length - 2;

  while (i >= 0 && j >= 0) {
    const pairSum = set[i] + set[j];

    if (pairSum === amount) return true;

    if (j === 0) {
      i--;
      j = i - 1;
    } else {
      j--;
    }
  }

  return false;
};

const getSlice = (list, start, end) => list.slice(start, end + 1);

const getSumBeetweenPointers = (list, start, end) => getSlice(list, start, end).reduce(sum, 0);

const findTheSum = (list, amount) => {
  const filteredList = list.filter(elem => elem < amount);
  let i = filteredList.length - 1;
  let j = filteredList.length - 2;

  while (i >= 0 && j >= 0) {
    const segmentSum = getSumBeetweenPointers(list, j, i);

    if (segmentSum === amount) return getSlice(list, j, i);

    if (j === 0) {
      i--;
      j = i - 1;
    } else {
      j--;
    }
  }
  return false;
};

const findTheWrong = data => {
  let idx = PREAMBLE;
  while (idx < data.length) {
    const previousSet = data.slice(idx - PREAMBLE, idx);
    const isValid = checkIsValidNumber(data[idx], previousSet);

    if (!isValid) return findTheSum(data.slice(0, idx), data[idx]);

    idx++;
  }
  return null;
};

const prepareResult = result => {
  const [min, ...rest] = R.sort((a, b) => a - b, result);
  const max = rest[rest.length - 1];
  return min + max;
};

module.exports = () => getData('https://adventofcode.com/2020/day/9/input')
  .then(breakByNewLines)
  .then(R.map(Number))
  .then(findTheWrong)
  .then(R.tap(console.log))
  .then(prepareResult);
