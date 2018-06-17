# mongoose-populate-options
[![Build Status](https://travis-ci.org/devcolor/mongoose-populate-options.svg?branch=master)](https://travis-ci.org/devcolor/mongoose-populate-options)

A Mongoose plugin for applying query options to every layer of population.

## Getting Started

### Installing

```bash
npm install mongoose-populate-options --save
```

### Usage

#### Typical Case

```js
const setPopulateOptions = require('mongoose-populate-options');

MySchema.plugin(setPopulateOptions);

MyModel.find()
  .populate('friends')
  .populate('teachers')
  .setPopulateOptions({ limit: 2 });
```
This will set mognoose options on the two populate calls, as if you'd defined options inline on each one.

*Note: Just like `setOptions`, order matters. `setPopulateOptions` will affect all populate calls before it, but not after it. Options from `setPopulateOptions` will overwrite options that have alread been set.*

*Note: This method does not set options on the query itself.*

#### Resticting Options
You can restrict which options are allowed to be set in the options of populate commands. This can be useful when handling API requests where any arbitrary option can be sent by the client.

```js
MyModel.find()
  .populate('friends')
  .setPopulateOptions({ limit: 2 }, ['limit', 'skip']);
```

#### Submodule
You can also load the submodule that will give will take a populate value (e.g. `friends` or `{ path: 'friends', options: { limit: 10 } }` and return an object that has the new options inserted at every level. This may be useful when manually dealing with options, like within an API.

```js
const populateObfForElement = require('mongoose-populate-options/populateObfForElement');

const newPopulate = populateObfForElement(myOptions.populate, { limit: 5 });
```

## Contributing

### Running the tests

```bash
npm test
```

### Style

```bash
./node_modules/.bin/eslint .
```

## Author

Makinde Adeagbo

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
