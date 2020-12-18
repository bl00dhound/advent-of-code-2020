const R = require('ramda');

const { breakByNewLines } = require('../../utils/string.util');

const find2020 = data => {
  const spoken = Array(30000000);

  for (let i = 0; i < data.length; i++) {
    spoken[data[i]] = i + 1;
  }

  let turn = data.length + 1;
  let lastNum = data[data.length - 1];
  while (turn <= 30000000) {
    let lastTurn = spoken[lastNum];
    let nextNum = 0;

    if (lastTurn != null) {
      nextNum = turn - lastTurn - 1;
    }

    spoken[lastNum] = turn - 1;

    if (turn % 100000 === 0) {
      console.log(turn/1000000, '****************** turn ********************'); // TODO remove console.log
    }
    turn++;
    lastNum = nextNum;
  }


  return lastNum;
}

// 2,0,6,12,1,3
// 0,3,6
// 0,3,6
module.exports = () => Promise.resolve(`
14,1,17,0,3,20
`)
  .then(breakByNewLines)
  .then(R.pipe(
    R.head,
    R.split(','),
    R.map(Number),
  ))
  .then(find2020)

