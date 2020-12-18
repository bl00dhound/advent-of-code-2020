const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

module.exports = startData => (startData ? Promise.resolve(startData) : getData('https://adventofcode.com/2020/day/15/input'))
  .then(breakByNewLines)
  .then(R.pipe(
    R.head,
    R.split(','),
    R.map(Number),
  ));

