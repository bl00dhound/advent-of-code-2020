const breakByNewLines = str => str.split('\n').filter(Boolean);

const splitByParameter = param => data => data.split(param);

module.exports = {
  breakByNewLines,
  splitByParameter,
};
