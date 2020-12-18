const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const createSourceMap = data => {
  const sourceMap = new Map();
  const z = 0;
  const w = 0;

  for (let y = 0; y < data.length; y++) {
    const rows = data[y];
    for (let x = 0; x < rows.length; x++) {
      const cube = rows[x];
      if (cube === '#') {
        sourceMap.set(`${x}|${y}|${z}|${w}`, true);
      }
    }
    
  }
  return sourceMap;
}

const createNeighbors = sourceMap => {
  const resultMap = new Map();
  const notActives = [];

  for (const key of sourceMap.keys()) {
    const [x, y, z, w] = key.split('|').map(Number);
    let count = 0;
    for (let _w = -1; _w <= 1; _w++) {
      for (let _z = -1; _z <= 1; _z++) {
        for (let _y = -1; _y <= 1; _y++) {
          for (let _x = -1; _x <= 1; _x++) {
            if (_x === 0 && _y === 0 && _z === 0 && _w === 0) continue;

            const idx = `${x + _x}|${y + _y}|${z + _z}|${w + _w}`;

            if (sourceMap.has(idx)) {
              count++;
            } else {
              notActives.push([x + _x, y + _y, z + _z, w + _w]);
            }
          }
        }
      }
    }
    if (count === 2 || count === 3) {
      resultMap.set(key, true)
    }
  }

  for (const [x, y, z, w] of notActives) {
    let count = 0;
    for (let _w = -1; _w <= 1; _w++) {
      for (let _z = -1; _z <= 1; _z++) {
        for (let _y = -1; _y <= 1; _y++) {
          for (let _x = -1; _x <= 1; _x++) {
            if (_x === 0 && _y === 0 && _z === 0 && _w === 0) continue;

            const idx = `${x + _x}|${y + _y}|${z + _z}|${w + _w}`;
            if (sourceMap.has(idx)) {
              count++;
            }
          }
        }
      }
    }
    if (count === 3) {
      resultMap.set(`${x}|${y}|${z}|${w}`, true)
    }
  }

  return resultMap;
}

module.exports = () => getData('https://adventofcode.com/2020/day/17/input')
// module.exports = () => Promise.resolve(`
// .#.
// ..#
// ###
// `)
  .then(breakByNewLines)
  .then(R.map(R.split('')))
  .then(createSourceMap)
  .then(createNeighbors)
  .then(createNeighbors)
  .then(createNeighbors)
  .then(createNeighbors)
  .then(createNeighbors)
  .then(createNeighbors)
  .then(R.prop('size'))
