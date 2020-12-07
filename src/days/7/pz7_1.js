const { getData } = require('../../utils');

const prepareData = data => data;

module.exports = () => getData('https://adventofcode.com/2020/day/7/input')
  .then(prepareData);
