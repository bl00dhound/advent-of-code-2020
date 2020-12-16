const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

module.exports = () => getData('https://adventofcode.com/2020/day/10/input')
  // module.exports = () => Promise.resolve(`
  // `)
  .then(breakByNewLines);
