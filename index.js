var populateObjForElement = require('./populateObjForElement');

module.exports = function populateOptionsPlugin(schema) {
  schema.query.setPopulateOptions = function(optionsToSet) {
    // Population information is stored in _mongooseOptions.populate. Note
    // that this data strucutre is a bit odd looking. The first level of
    // keys are the names of the fields to be populated. After that, the
    // data looks as you would expect.
    //    this._mongooseOptions.populate = {
    //      firstField: {
    //        path: "firstField"
    //        select: ['foo', 'bar']
    //      }
    //      secondField: {
    //         ...
    //      }
    //    }
    if (this._mongooseOptions && this._mongooseOptions.populate) {
      var keys = Object.keys(this._mongooseOptions.populate);
      for (var i = 0; i < keys.length; i++) {
        this._mongooseOptions.populate[keys[i]] = populateObjForElement(
          this._mongooseOptions.populate[keys[i]],
          optionsToSet
        );

      }
    }

    return this;
  };
};
