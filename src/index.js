const currentPuzzleStart = require('./days/16/pz16_2');

const start = Date.now();

const checkTime = result => {
  console.log(`It took: ${Date.now() - start}ms`);
  return result;
};

currentPuzzleStart()
  .then(console.log)
  .then(checkTime)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    return process.exit(1);
  });
