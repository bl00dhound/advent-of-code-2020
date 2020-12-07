const { get } = require('lodash');

const { getData } = require('../../utils');

const sideObject = {
  r: {
    r: {
      r: 7,
      l: 6,
    },
    l: {
      r: 5,
      l: 4,
    },
  },
  l: {
    r: {
      r: 3,
      l: 2,
    },
    l: {
      r: 1,
      l: 0,
    },
  },
};

const convertToArray = data => data.split('\n');

const splitByDirections = source => source.map(elem => [elem.slice(0, -3), elem.slice(-3)]);

const buildRowObject = () => {
  const layer7 = new Array(128).join('|').split('|').map((_, idx) => (idx % 2 === 0 ? idx : idx));
  const layer6 = [];

  let i = 0;

  // Yes, I know. This is peace of sh..t
  while (i < layer7.length) {
    layer6.push({
      f: layer7[i],
      b: layer7[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer5 = [];

  while (i < layer7.length / 2) {
    layer5.push({
      f: layer6[i],
      b: layer6[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer4 = [];

  while (i < layer7.length / 4) {
    layer4.push({
      f: layer5[i],
      b: layer5[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer3 = [];

  while (i < layer7.length / 8) {
    layer3.push({
      f: layer4[i],
      b: layer4[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer2 = [];

  while (i < layer7.length / 16) {
    layer2.push({
      f: layer3[i],
      b: layer3[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer1 = [];

  while (i < layer7.length / 32) {
    layer1.push({
      f: layer2[i],
      b: layer2[i + 1],
    });
    i += 2;
  }

  i = 0;
  const layer0 = [];

  while (i < layer7.length / 32) {
    layer0.push({
      f: layer1[i],
      b: layer1[i + 1],
    });
    i += 2;
  }

  return layer0[0];
};

const getRow = code => {
  const rowObject = buildRowObject(code);
  return get(rowObject, code.toLowerCase().split(''));
};

const getSide = code => get(sideObject, code.toLowerCase().split(''));

const findSeat = ([rowCode, sideCode]) => [getRow(rowCode), getSide(sideCode)];

const findSeats = directions => directions.map(findSeat);

const calculateResult = ([row, column]) => console.log(row, column) || row * 8 + column;

const calculateResults = seats => seats.filter(([el]) => el).map(calculateResult);

const sortByCount = counts => counts.sort((a, b) => b - a);

module.exports = () => getData('https://adventofcode.com/2020/day/5/input')
  .then(convertToArray)
  .then(splitByDirections)
  .then(findSeats)
  .then(calculateResults)
  .then(sortByCount)
  .then(data => {
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i] + 1 !== data[i - 1]) {
        console.log(data[i], data[i - 1], '****************** empty seat ********************');
      }
    }
    return data;
  });
