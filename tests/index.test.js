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

test.todo('Do not alter queries that have no populate fields');
test.todo('Does not affect subsequent population calls');
test.todo('Does not affect top level query options');

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
