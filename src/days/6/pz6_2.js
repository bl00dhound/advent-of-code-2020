const { map } = require('lodash/fp');

const { getData } = require('../../utils');

const sum = (acc, num) => acc + num;

const prepareData = data => data
  .split('\n\n')
  .map(group => group.split('\n').filter(Boolean));

const countAnswers = (answers, smallest) => {
  let counter = 0;

  smallest.split('').forEach(letter => {
    let result = true;
    for (const answer of answers) {
      if (!answer.includes(letter)) result = false;
    }
    return result ? ++counter : 0;
  });

  return counter;
};

const checkGroupAnswers = group => {
  if (group.length === 1) return group[0].length;

  const smallestElementIdx = group.reduce(
    (acc, elem, idx, array) => (elem.length < array[acc].length ? idx : acc),
    0,
  );
  const smallestElement = group[smallestElementIdx];

  const groupWithoutSmallest = group.slice(0, smallestElementIdx).concat(
    group.slice(smallestElementIdx + 1),
  );

  return countAnswers(groupWithoutSmallest, smallestElement);
};

module.exports = () => getData('https://adventofcode.com/2020/day/6/input')
  .then(prepareData)
  .then(map(checkGroupAnswers))
  .then(data => data.reduce(sum));
