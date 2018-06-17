var pick = require('lodash.pick');

function populateObjForElement(element, optionsToInsert, allowedOptions) {

  if (typeof element === 'string') {

    if (element.includes(' ')) {
      // If there's a space, we need to break it up and treat it like an array.
      return populateObjForElement(
        element.split(' ').filter(function (elm) { return !!elm; }),
        optionsToInsert
      );
    }

    return {
      path: element,
      options: optionsToInsert,
    };
  }

  // Is it's an array recurse on each element
  if (Array.isArray(element)) {
    return element.map(
      function (elm) { return populateObjForElement(elm, optionsToInsert); }
    );
  }

  // Should be an object at this point with a path property.
  if (element && element.path) {
    var existingAllowedOptions = allowedOptions
      ? pick(element.options || {}, allowedOptions)
      : element.options || {};
    var optionsCopy = Object.assign({}, existingAllowedOptions, optionsToInsert);
    var newElement = Object.assign({}, element, { options: optionsCopy });
    if (newElement.populate) {
      newElement.populate = populateObjForElement(newElement.populate, optionsToInsert);
    }
    return newElement;
  }
}

module.exports = populateObjForElement;
