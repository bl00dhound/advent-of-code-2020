const R = require('ramda');

const _map = R.map;
const _pipe = R.pipe;
const _reject = R.reject;
const _test = R.test;
const _evolve = R.evolve;
const _ifElse = R.ifElse;
const _reduce = R.reduce;
const _tap = R.tap;

const {
  getData, breakByNewLines, splitByParameter,
} = require('../../utils');

const MY_BAG_COLOR = 'shiny gold';
const EMPTY_BAG = 'no other';

let rootObject = {};
const bagColorSet = new Set();

const prepareData = _map(splitByParameter(' contain '));

const removeBags = str => str.replace(/ .{3,5}$/, '');

const buildParentObject = ([first, childrenString]) => {
  const parent = removeBags(first);
  const children = _pipe(
    splitByParameter(', '),
    _reject(_test(/^no other.*/)),
  )(childrenString);

  if (!children.length === 0) return { [parent]: {} };
  return { parent, children };
};

const buildChildren = ({ parent, children }) => ({
  parent,
  children: _ifElse(
    () => !children.length,
    () => ({}),
    _pipe(
      _map(_pipe(
        splitByParameter(' '),
        ([count, ...color]) => ({ count, color: color.join(' ') }),
        _evolve({
          count: Number,
          color: removeBags,
        }),
      )),
      _reduce((acc, { color, count }) => ({ ...acc, [color]: count }), {}),
    ),
  )(children),
});

const buildRoot = ({ parent, children }) => ({ [parent]: children });

const getCountedChildren = bag => root => {
  const children = root[bag];
  console.log(children, '****************** children ********************'); // TODO remove console.log

  bagColorSet.add(bag);

  return Object.keys(children);
};

const walkTheChildren = bags => {
  console.log(bags, '****************** bags ********************'); // TODO remove console.log
  if (!bags.length) return 0;

  const children = bags.reduce(
    (acc, child) => [...acc, ...getCountedChildren(child)(rootObject)],
    [],
  );

  return walkTheChildren(children);
};

const findShinyGoldBugs = _pipe(
  getCountedChildren(MY_BAG_COLOR),
  walkTheChildren,
  () => {
    bagColorSet.delete(MY_BAG_COLOR);
    console.log(bagColorSet);
    return bagColorSet.size;
  },
);

module.exports = () => getData('https://adventofcode.com/2020/day/7/input')
// module.exports = () => Promise.resolve(`light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.
// `)
  .then(breakByNewLines)
  .then(prepareData)
  .then(_map(_pipe(
    buildParentObject,
    buildChildren,
    buildRoot,
  )))
  .then(_reduce((acc, parent) => ({
    ...acc,
    [Object.keys(parent)[0]]: Object.values(parent)[0],
  }), {}))
  // eslint-disable-next-line no-unused-vars
  .then(_tap(root => { rootObject = root; }))
  .then(findShinyGoldBugs);
