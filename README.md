# mongoose-populate-options
[![Build Status](https://travis-ci.org/devcolor/mongoose-populate-options.svg?branch=master)](https://travis-ci.org/devcolor/mongoose-populate-options)

A Mongoose plugin for applying query options to every layer of population.

## Getting Started

### Installing

```bash
npm install mongoose-populate-options --save
```

### Usage

```js
MyModel.find()
  .populate('friends')
  .populate('teachers')
  .setPopulateOptions({ limit: 2 });
```
This will set mognoose options on the two populate calls, as if you'd defined options inline on each one.

*Note: Just like `setOptions`, order matters. `setPopulateOptions` will affect all populate calls before it, but not after it. Options from `setPopulateOptions` will overwrite options that have alread been set.*

*Note: This method does not set options on the query itself.*

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
