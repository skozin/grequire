This module provides a way to synchronously load multiple Node.js modules using
[glob pattern matching](https://github.com/isaacs/node-glob).


## Example

Require all sibling modules (relative to this module):

```js
var results = grequire(module, "./*.js")

console.log(results)
```

Output:

```js
[{
  filename: './sibling-1.js',
  exports: { /* exports of sibling-1 */ }
}, {
  filename: './sibling-2.js',
  exports: { /* exports of sibling-2 */ }
}]
```

Also see [the spec](https://github.com/skozin/grequire/blob/master/test/index.js), it shows
many different combinations of parameters, with comments.


## API

#### `grequire([module, ] pattern [, globOpts])`

* `module` The [module object](https://nodejs.org/api/modules.html#modules_the_module_object)
  that requires should be performed on behalf of. Usually this should be the free `module` variable, like in the example above.

* `pattern`, `globOpts` The glob pattern and options to use when matching files. See the
  [node-glob documentation](https://github.com/isaacs/node-glob).


Returns an array of items, where each item corresponds to one `require`d module, and
has the following contents:

```js
{
  /**
   * The filename of the loaded module. It may be absolute or relative,
   * depending on the pattern. See test/index.js for examples.
   */
  filename: String,
  /**
   * The loaded module's exports.
   */
  exports: AnyObject
}
```


## ES6

This module is written in ES6, and ES5 code is generated using [Babel](http://babeljs.io).

If you live in the future or use Babel (or some other transpiler), you may want to load
the non-transpiled ES6 code:

```js
import grequire from 'grequire/es6'
```

## License

MIT
