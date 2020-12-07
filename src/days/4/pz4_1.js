const { getData } = require('../../utils');

const FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const splitByPassports = data => data.split('\n\n');

const getFieldsSet = rawPassport => {
  const result = rawPassport
    .split(/(\\n| )/)
    .filter(elem => elem !== ' ')
    .reduce((acc, elem) => acc.concat(elem.split('\n')), [])
    .map(elem => elem.replace(/:.*/, ''));
  return new Set(result);
};

const getFieldSets = rawPasports => rawPasports.map(getFieldsSet);

const checkFieldSet = (count, set) => {
  for (const field of FIELDS) {
    if (!set.has(field)) return count;
  }

  return count + 1;
};

const getValidationResult = passportFields => passportFields.reduce(checkFieldSet, 0);

module.exports = () => getData('https://adventofcode.com/2020/day/4/input')
  .then(splitByPassports)
  .then(getFieldSets)
  .then(getValidationResult);
