var test = require('ava');
var populateObjForElement = require('../populateObjForElement');

test('No populate information', function (t) {
  var populateObj = populateObjForElement(undefined, { limit: 10 });
  t.is(populateObj, undefined);
});

test('Single populated field, specified as string', function (t) {
  var populateObj = populateObjForElement('foo', { limit: 10 });
  t.deepEqual(populateObj, { path: 'foo', options: { limit: 10 } });
});

test('Single populated field, specified as path object', function (t) {
  var populateObj = populateObjForElement({ path: 'foo' }, { limit: 10 });
  t.deepEqual(populateObj, { path: 'foo', options: { limit: 10 } });
});

test('Single populated field, specified as single element array', function (t) {
  var populateObj = populateObjForElement(['foo'], { limit: 10 });
  t.deepEqual(populateObj, [{ path: 'foo', options: { limit: 10 } }]);
});

test('Multiple fields, specified as string with spaces', function (t) {
  var populateObj = populateObjForElement('foo bar', { limit: 10 });
  t.deepEqual(
    populateObj,
    [
      { path: 'foo', options: { limit: 10 } },
      { path: 'bar', options: { limit: 10 } },
    ],
    'Should handle a single space.'
  );

  populateObj = populateObjForElement('   foo    bar    ', { limit: 10 });
  t.deepEqual(
    populateObj,
    [
      { path: 'foo', options: { limit: 10 } },
      { path: 'bar', options: { limit: 10 } },
    ],
    'Should handle multiple, errant spaces.'
  );

  populateObj = populateObjForElement('   foo  anotherone  bar    ', { limit: 10 });
  t.deepEqual(
    populateObj,
    [
      { path: 'foo', options: { limit: 10 } },
      { path: 'anotherone', options: { limit: 10 } },
      { path: 'bar', options: { limit: 10 } },
    ],
    'Should handle more than two fields in the string.'
  );
});

test('Multiple fields, specified as array of strings', function (t) {
  var populateObj = populateObjForElement(['foo', 'anotherone', 'bar'], { limit: 10 });
  t.deepEqual(
    populateObj,
    [
      { path: 'foo', options: { limit: 10 } },
      { path: 'anotherone', options: { limit: 10 } },
      { path: 'bar', options: { limit: 10 } },
    ]
  );
});

test('Multiple fields, specified as array of objects', function (t) {
  var populateObj = populateObjForElement(
    [{ path: 'foo' }, { path: 'bar' }],
    { limit: 10 }
  );
  t.deepEqual(
    populateObj,
    [
      { path: 'foo', options: { limit: 10 } },
      { path: 'bar', options: { limit: 10 } },
    ]
  );
});

test('Retention of other populated fields', function (t) {
  var populateObj = populateObjForElement({ path: 'foo', select: 'bar' }, { limit: 10 });
  t.deepEqual(populateObj, {
    path: 'foo',
    select: 'bar',
    options: { limit: 10 },
  });
});
test('Retention of other populate options', function (t) {
  var populateObj = populateObjForElement(
    { path: 'foo', options: { skip: 10 } },
    { limit: 10 }
  );
  t.deepEqual(populateObj, {
    path: 'foo',
    options: {
      skip: 10,
      limit: 10,
    },
  });
});

test('Overwrite existing options with undefined', function (t) {
  var populateObj = populateObjForElement(
    { path: 'foo', options: { skip: 10 } },
    { skip: undefined }
  );
  t.deepEqual(populateObj, {
    path: 'foo',
    options: {
      skip: undefined,
    },
  });
});

test('Single level nesting', function (t) {
  var populateObj = populateObjForElement(
    {
      path: 'foo',
      options: { skip: 10 },
      populate: {
        path: 'bar',
        options: { limit: 5 },
      },
    },
    { skip: undefined, comment: 'hey' });
  t.deepEqual(populateObj, {
    path: 'foo',
    options: { skip: undefined, comment: 'hey' },
    populate: {
      path: 'bar',
      options: { limit: 5, skip: undefined, comment: 'hey' },
    },
  });
});

test('Multiple level nesting', function (t) {
  var populateObj = populateObjForElement(
    [{
      path: 'foo',
      options: { skip: 10 },
      populate: [
        {
          path: 'bar',
          options: { limit: 5 },
          populate: 'one two three',
        },
        'inline',
      ],
    }],
    { skip: undefined, comment: 'hey' });
  t.deepEqual(populateObj, [{
    path: 'foo',
    options: { skip: undefined, comment: 'hey' },
    populate: [
      {
        path: 'bar',
        options: { limit: 5, skip: undefined, comment: 'hey' },
        populate: [
          {
            path: 'one',
            options: { skip: undefined, comment: 'hey' },
          },
          {
            path: 'two',
            options: { skip: undefined, comment: 'hey' },
          },
          {
            path: 'three',
            options: { skip: undefined, comment: 'hey' },
          },
        ],
      },
      {
        path: 'inline',
        options: { skip: undefined, comment: 'hey' },
      },
    ],
  }]);
});

test('Only allow approved options keys through', function (t) {
  var populateObj = populateObjForElement(
    { path: 'foo', options: { random: 'dangerous', skip: 10 } },
    { limit: 10 },
    ['skip']
  );
  t.deepEqual(populateObj, {
    path: 'foo',
    options: {
      skip: 10,
      limit: 10,
    },
  });
});

test('Malformed: no path property', function (t) {
  var populateObj = populateObjForElement({ options: { skip: 10 } }, { limit: 10 });
  t.is(populateObj, undefined);
});
