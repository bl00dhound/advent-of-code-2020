const { getData } = require('../../utils');

const getUniqCounter = sourceStr => {
  const set = new Set(sourceStr.split(''));
  return set.size;
};

const sum = (acc, num) => acc + num;

const prepareData = data => data
  .split('\n\n')
  .map(
    group => group
      .split('\n')
      .reduce((acc, elem) => acc + elem),
  )
  .map(getUniqCounter)
  .reduce(sum);

module.exports = () => getData('https://adventofcode.com/2020/day/9/input')
  .then(prepareData);
