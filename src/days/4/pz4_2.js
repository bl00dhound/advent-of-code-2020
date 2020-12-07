const { getData } = require('../../utils');
const Schema = require('./passportSchema');

const FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const splitByPassports = data => data.split('\n\n');

const getFieldsSet = rawPassport => rawPassport
  .split(/(\\n| )/)
  .filter(elem => elem !== ' ')
  .reduce((acc, elem) => acc.concat(elem.split('\n')), []);

const getFieldSets = rawPasports => rawPasports.map(getFieldsSet);

const buildPassport = set => set.reduce((acc, elem) => {
  const [key, value] = elem.split(':');
  return key ? { ...acc, [key]: value } : acc;
}, {});

const buildPassports = sets => sets.map(buildPassport);

const validateFields = passport => {
  for (const key of Object.keys(passport)) {
    const value = passport[key];
    const currentChecking = Schema[key];

    switch (currentChecking && currentChecking.type) {
      case 'number': {
        const num = Number(value);

        if (Number.isNaN(num)) return 0;
        if (num < currentChecking.min) return 0;
        if (num > currentChecking.max) return 0;
        break;
      }
      case 'string': {
        if (!currentChecking.fn(value)) return 0;
        break;
      }
      // eslint-disable-next-line no-continue
      default: continue;
    }
  }
  return 1;
};

const validatePassport = passport => {
  for (const field of FIELDS) {
    if (!passport[field]) return 0;
  }
  return validateFields(passport);
};

const validatePassports = passports => passports.map(validatePassport);

module.exports = () => getData('https://adventofcode.com/2020/day/4/input')
  .then(splitByPassports)
  .then(getFieldSets)
  .then(buildPassports)
  .then(validatePassports)
  .then(results => results.reduce((acc, el) => acc + el));
