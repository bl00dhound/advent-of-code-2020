module.exports = {
  byr: {
    type: 'number',
    min: 1920,
    max: 2002,
  },
  iyr: {
    type: 'number',
    min: 2010,
    max: 2020,
  },
  eyr: {
    type: 'number',
    min: 2020,
    max: 2030,
  },
  hgt: {
    type: 'string',
    fn: value => {
      switch (value.slice(-2)) {
        case 'cm': return Number(value.slice(0, -2)) >= 150 && Number(value.slice(0, -2)) <= 193;
        case 'in': return Number(value.slice(0, -2)) >= 59 && Number(value.slice(0, -2)) <= 76;
        default: return false;
      }
    },
  },
  hcl: {
    type: 'string',
    fn: value => /^#[0-9a-f]{6}$/.test(value),
  },
  ecl: {
    type: 'string',
    fn: value => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),
  },
  pid: {
    type: 'string',
    fn: value => /^[0-9]{9}$/.test(value),
  },
};
