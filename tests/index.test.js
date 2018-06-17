var test = require('ava');
var mongoose = require('mongoose');
var populateOptionsPlugin = require('../index');

test.before(function (t) {
  var schema = new mongoose.Schema({ friend: { type: String, ref: 'Org' } });
  schema.plugin(populateOptionsPlugin);
  t.context.Org = mongoose.model('Org', schema);
});

test('setPopulateOptions should be available on query', function (t) {
  t.is(
    typeof t.context.Org.find().setPopulateOptions,
    'function',
    'Query.setPopulateOptions should be a function'
  );
});

test('Query helper should return query (chainable)', function (t) {
  var Org = t.context.Org;
  var options = { limit: 10 };
  var query = Org.find().populate('foo');
  t.is(
    query.setPopulateOptions(options),
    query,
    'setPopulateOptions should return the query'
  );
});

test('Do not alter queries that have no populate fields', function (t) {
  var Org = t.context.Org;
  var options = { limit: 10 };
  var query = Org.find().setPopulateOptions(options);

  t.is(
    query._mongooseOptions.populate,
    undefined,
    'Population config should not be established when there was none before'
  );
});

test('Does not affect top level query options', function (t) {
  var Org = t.context.Org;
  var query = Org.find()
    .setOptions({ limit:5 }).setPopulateOptions({ limit: 10 });

  t.is(
    query.options.limit,
    5
  );
});

test('Options should be set', function (t) {
  var Org = t.context.Org;
  var options = { limit: 10 };
  var query = Org.find()
    .skip(5)
    .populate('foo')
    .populate('bar')
    .setPopulateOptions(options);

  t.is(
    query._mongooseOptions.populate.foo.path,
    'foo',
    'Population config should be expanded into object'
  );
  t.deepEqual(
    query._mongooseOptions.populate.foo.options,
    options,
    'Population options should be set'
  );
  t.deepEqual(
    query._mongooseOptions.populate.bar.options,
    options,
    'Population options should be set for all populated fields'
  );
});

test('Does not affect subsequent population calls', function (t) {
  var Org = t.context.Org;
  var options = { limit: 10 };
  var query = Org.find()
    .skip(5)
    .populate('foo')
    .setPopulateOptions(options)
    .populate('bar');

  t.is(
    query._mongooseOptions.populate.foo.path,
    'foo',
    'Population config should be expanded into object'
  );
  t.deepEqual(
    query._mongooseOptions.populate.foo.options,
    options,
    'Population options should be set'
  );
  t.is(
    query._mongooseOptions.populate.bar.options,
    undefined,
    'setPopulateOptions should affect subsequent populate calls'
  );
});

test('Only allowed fields shold remain', function (t) {
  var Org = t.context.Org;
  var options = { limit: 10 };
  var query = Org.find()
    .skip(5)
    .populate({ path: 'foo', options: { lean: true, skip: 5 } })
    .setPopulateOptions({ limit: 10 }, ['lean']);

  t.is(
    query._mongooseOptions.populate.foo.options.skip,
    undefined,
    'Pre-existing options that are not allowed should be removed'
  );
  t.is(
    query._mongooseOptions.populate.foo.options.limit,
    10,
    'New options should stay'
  );
  t.is(
    query._mongooseOptions.populate.foo.options.lean,
    true,
    'Allowed options should still be present'
  );
});
