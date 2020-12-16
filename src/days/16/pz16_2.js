/* eslint-disable no-loop-func */
const R = require('ramda');
const { getData } = require('../../utils');

const { breakByNewLines } = require('../../utils/string.util');

const MY_TICKET_POSITION = 20;

let myTicketFields = [];
let nearbyTicketsFields = [];
let fieldValidation = {};

const FIELDS = [];

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
  FIELDS.push(fieldName);
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

const filterNearby = incorrectValues => R.pipe(
  R.reject(R.pipe(
    R.intersection(incorrectValues),
    R.prop('length'),
  )),
  R.concat(myTicketFields),
)(nearbyTicketsFields);

const check = (fn, values) => {
  const result = values.length > 0;
  for (let i = 0; i < values.length; i++) {
    const element = values[i];

    if (!fn(element)) return false;
  }
  return result;
};

const buildFieldsResultChecking = tickets => {
  const result = [];

  for (let index = 0; index < MY_TICKET_POSITION; index++) {
    const elements = R.pluck(index)(tickets);
    const fields = [];

    for (let j = 0; j < FIELDS.length; j++) {
      const field = FIELDS[j];
      const fn = fieldValidation[field];

      if (check(fn, elements)) {
        fields.push(field);
      }
    }
    result.push(fields);
  }

  return result;
};

const findOrder = fieldResults => {
  const fieldOrder = [];
  for (let i = 1; i <= MY_TICKET_POSITION; i++) {
    fieldResults.forEach((fields, idx) => {
      if (fields.length === i) {
        const diff = R.without(R.pluck(1, fieldOrder), fields);
        if (diff.length) {
          fieldOrder.push([idx, diff[0]]);
        }
      }
    });
  }

  return fieldOrder;
};

const resultCount = fields => {
  const myTicketValues = [];
  fields.forEach((field, idx) => {
    if (R.test(/^departure .*/)(field)) {
      myTicketValues.push(R.head(myTicketFields)[idx]);
    }
  });
  return myTicketValues;
};

module.exports = () => getData('https://adventofcode.com/2020/day/16/input')
  .then(breakByNewLines)
  .then(prepareData)
  .then(checkNearby)
  .then(R.uniq)
  .then(filterNearby)
  .then(R.tap(values => { nearbyTicketsFields = values; }))
  .then(buildFieldsResultChecking)
  .then(findOrder)
  .then(R.sort(([orderA], [orderB]) => orderA - orderB))
  .then(R.map(R.prop(1)))
  .then(resultCount)
  .then(R.reduce(R.multiply, 1));
