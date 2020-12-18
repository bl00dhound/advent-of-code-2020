const R = require('ramda');

const { breakByNewLines } = require('../../utils/string.util');

const find2020 = data => {
  while (data.length < 2020) {
    const turn = data.length + 1;
    const lastNum = data[data.length - 1];

    let lastTurn = null;
    for (let i = data.length - 2; i >= 0; i--) {
      if (data[i] === lastNum) {
        lastTurn = i + 1;
        break;
      }
        
    }

    let nextNum = 0;
    if (lastTurn !== null) {
      nextNum = turn - lastTurn - 1;
    }
    data.push(nextNum);
  }


  return data[data.length - 1];
}

// 2,0,6,12,1,3
// 0,3,6
// 14,1,17,0,3,20
module.exports = data => Promise.resolve(data)
  .then(breakByNewLines)
  .then(R.pipe(
    R.head,
    R.split(','),
    R.map(Number),
  ))
  .then(find2020)

