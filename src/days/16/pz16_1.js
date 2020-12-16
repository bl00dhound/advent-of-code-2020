const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const MY_TICKET_POSITION = 20;

let myTicketFields = [];
let nearbyTicketsFields = [];
let fieldValidation = {};

const transformToArray = (start, end) => R.pipe(
  R.slice(start, end),
  R.map(R.pipe(
    R.split(','),
    R.map(Number),
  )),
);

const buildValidationFn = (firstCondition, secondCondition) => value => {
  const [startFirst, endFirst] = firstCondition.split('-');
  const [startSecond, endSecond] = secondCondition.split('-');

  return (R.gte(value, Number(startFirst)) && R.lte(value, Number(endFirst)))
    || (R.gte(value, Number(startSecond)) && R.lte(value, Number(endSecond)));
};

const buildSchemaReducer = (acc, rawField) => {
  const [fieldName, , firstCondition, , secondCondition] = rawField.split(/(: | or )/g);
  return {
    ...acc,
    [fieldName]: buildValidationFn(firstCondition, secondCondition),
  };
};

const createValidationSchema = (start, end) => R.pipe(
  R.slice(start, end),
  R.reduce(buildSchemaReducer, {}),
);

const prepareData = rows => {
  myTicketFields = transformToArray(MY_TICKET_POSITION + 1, MY_TICKET_POSITION + 2)(rows);
  nearbyTicketsFields = transformToArray(MY_TICKET_POSITION + 3)(rows);

  fieldValidation = createValidationSchema(0, MY_TICKET_POSITION)(rows);
  return [myTicketFields, nearbyTicketsFields, fieldValidation];
};

const checkByAllValidators = validation => num => Object
  .values(validation)
  .some(fn => fn(num));

const checkNearby = ([, nearbyValues, validation]) => R.pipe(
  R.flatten,
  R.reject(checkByAllValidators(validation)),
)(nearbyValues);

module.exports = () => getData('https://adventofcode.com/2020/day/16/input')
// module.exports = () => Promise.resolve(`
// class: 1-3 or 5-7
// row: 6-11 or 33-44
// seat: 13-40 or 45-50
// your ticket:
// 7,1,14
// nearby tickets:
// 7,3,47
// 40,4,50
// 55,2,20
// 38,6,12
// `)
  .then(breakByNewLines)
  .then(prepareData)
  .then(checkNearby)
  .then(R.reduce(R.add, 0));
