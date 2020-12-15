const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const PREAMBLE = 25;

const checkIsValidNumber = (amount, set) => {
  let i = set.length - 1;
  let j = set.length - 2;

  while (i >= 0 && j >= 0) {
    const sum = set[i] + set[j];

    if (sum === amount) return true;

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

    if (!isValid) return data[idx];

    idx++;
  }
  return false;
};

module.exports = () => getData('https://adventofcode.com/2020/day/9/input')
// module.exports = () => Promise.resolve(`
// 35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576
// `)
  .then(breakByNewLines)
  .then(R.map(Number))
  .then(findTheWrong);
