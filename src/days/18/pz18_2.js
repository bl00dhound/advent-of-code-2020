const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const REGEX = /\([0-9*+ ]{2,}\)/g;
const PLUS_REGEX = /\d+ \+ \d+/g
const TRIM_EXTRA = /\(\(\d+ \+ \d+\)\)/g
const SIGNS = ['+', '*'];

const checkIsAtomicity = exp => {
  return !exp.slice(1, -1).includes('(')
}

const calculateTwoNumbers = strExp => {
  const [firstNum, sign, secondNum] = strExp.split(' ');

  return sign === '+' ? R.add(Number(firstNum), Number(secondNum)) : R.multiply(Number(firstNum), Number(secondNum));
}

const calculateNumbers = strExpr => () => {
  const splittedExpr = strExpr.split(' ');
  let result = Number(R.head(splittedExpr));
  let sign = '';

  for (let i = 1; i < splittedExpr.length; i++) {
    const element = splittedExpr[i];
    if (SIGNS.includes(element)) {
      sign = element;
      continue;
    }

    result = calculateTwoNumbers(`${result} ${sign} ${element}`);
      
  }
  return result;
}

const parenthesesReplace = match => {
  if (checkIsAtomicity(match)) {
    const temp = match.replace(REGEX, calculateNumbers(match.slice(1, -1)));
    return temp;
  }
  
  return match.replace(REGEX, parenthesesReplace);
}

const checkParentheses = exp => exp.includes('(');

const calculate = expression => {
  let replacedParentheses = expression.replace(PLUS_REGEX, match => `(${match})`);
  replacedParentheses = replacedParentheses.replace(TRIM_EXTRA, match => match.slice(1, -1));

  while (checkParentheses(replacedParentheses)) {
    replacedParentheses = replacedParentheses.replace(REGEX, parenthesesReplace)
    replacedParentheses = replacedParentheses.replace(PLUS_REGEX, match => `(${match})`);
    replacedParentheses = replacedParentheses.replace(TRIM_EXTRA, match => match.slice(1, -1));
  }

  return calculateNumbers(replacedParentheses)();
}

module.exports = () => getData('https://adventofcode.com/2020/day/18/input')
  .then(breakByNewLines)
  .then(R.map(calculate))
  .then(sums => sums.reduce(R.add))
