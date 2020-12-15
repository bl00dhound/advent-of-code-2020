const R = require('ramda');

const {
  getData, breakByNewLines, splitByParameter,
} = require('../../utils');

const MY_BAG_COLOR = 'shiny gold';
const EMPTY_BAG = 'other';

let rootObject = {};
const bagColorSet = new Set();
const bagColorArray = [];

const prepareData = R.map(splitByParameter(' contain '));

const removeBags = str => str.replace(/ .{3,5}$/, '');

const buildParentObject = ([first, childrenString]) => {
  const parent = removeBags(first);
  const children = R.pipe(
    splitByParameter(', '),
    // R.reject(R.test(/^no other.*/)),
  )(childrenString);

  if (!children.length === 0) return { [parent]: {} };
  return { parent, children };
};

const buildChildren = ({ parent, children }) => ({
  parent,
  children: R.ifElse(
    () => !children.length,
    () => ({}),
    R.pipe(
      R.map(R.pipe(
        splitByParameter(' '),
        ([count, ...color]) => ({ count, color: color.join(' ') }),
        R.evolve({
          count: Number,
          color: removeBags,
        }),
      )),
      R.reduce((acc, { color, count }) => ({ ...acc, [color]: count }), {}),
    ),
  )(children),
});

const buildRoot = ({ parent, children }) => ({ [parent]: children });

const getCountedChildren = bag => root => {
  const children = root[bag];

  bagColorSet.add(bag);
  bagColorArray.push(bag);

  return Object.keys(children);
};

const walkTheChildren = bags => {
  if (!bags.length) return 0;

  const children = bags.reduce(
    (acc, child) => [...acc, ...getCountedChildren(child)(rootObject)],
    [],
  );

  return walkTheChildren(children);
};

const findShinyGoldBugs = R.pipe(
  getCountedChildren(MY_BAG_COLOR),
  walkTheChildren,
  () => {
    bagColorSet.delete(MY_BAG_COLOR);
    console.log(bagColorArray.length, '<----- values');
    console.log(bagColorArray, '<----- bags array');
    console.log(bagColorSet, '<--- unique values');
    return bagColorSet.size;
  },
);

const checkTheChildren = targetColor => color => {
  const children = Object.keys(rootObject[color] || []);

  console.log(color, children, '****************** color, children ********************'); // TODO remove console.log
  if (children.includes(targetColor)) {
    return true;
  }
  if (children.includes(EMPTY_BAG)) {
    return false;
  }

  return children.some(checkTheChildren(targetColor));
};

const contains = targetColor => color => {
  const children = rootObject[color];

  return Object.keys(children).some(checkTheChildren(targetColor));
};

const walkByBags = R.pipe(
  R.keys,
  // R.reject(R.equals(MY_BAG_COLOR)),
  R.filter(contains(MY_BAG_COLOR)),
  R.tap(R.pipe(R.uniq, R.prop('length'), console.log)),
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
  // .then(_tap(data => console.log(data.length, '#################33')))
  .then(prepareData)
  .then(R.map(R.pipe(
    buildParentObject,
    buildChildren,
    buildRoot,
  )))
  .then(R.reduce((acc, parent) => ({
    ...acc,
    [Object.keys(parent)[0]]: Object.values(parent)[0],
  }), {}))
  // eslint-disable-next-line no-unused-vars
  .then(R.tap(root => { rootObject = root; }))
  .then(walkByBags);
// .then(findShinyGoldBugs);
