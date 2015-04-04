var grequire = require('../'),
    assert = require('chai').assert


/* 
 * The best way to use this module is to pass the global "module" object
 * to the first argument. This way, you wont't need to specify the base
 * directory: all requires will be relative to your module's directory.
 * Just like in case of the normal require.
 */
it('grequire(module, "./*.js")', function()
{
  var result = grequire(module, './*.js')

  assert.deepEqual(result, [{
    filename: './a.js',
    exports: { whoami: 'a' }
  }, {
    filename: './b.js',
    exports: { whoami: 'b' }
  }])
})


/* 
 * You may omit the "./" prefix from the pattern, all requires will still
 * be relative to your module's directory.
 */
it("grequire(module, '*.js')", function()
{
  var result = grequire(module, '*.js')

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'b.js',
    exports: { whoami: 'b' }
  }])
})


/* 
 * Absolute paths will work too.
 */
it("grequire(module, __dirname + '/*.js')", function()
{
  var result = grequire(module, __dirname + '/*.js')

  assert.deepEqual(result, [{
    filename: __dirname + '/a.js',
    exports: { whoami: 'a' }
  }, {
    filename: __dirname + '/b.js',
    exports: { whoami: 'b' }
  }])
})


/* 
 * You can pass additional glob options to the third agrument.
 * See github.com/isaacs/node-glob for all available options.
 */
it("grequire(module, '*.js', { cwd: __dirname + '/sub-1' }", function()
{
  var result = grequire(module, '*.js', { cwd: __dirname + '/sub-1' })

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'b.js',
    exports: { whoami: 'sub-1/b' }
  }])
})


/* 
 * By default, grequire will require only files.
 */
it("grequire(module, '*')", function()
{
  var result = grequire(module, '*')

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'b.js',
    exports: { whoami: 'b' }
  }])
})


/* 
 * You can change this using the "nodir: false" glob option.
 */
it("grequire(module, '*', { nodir: false })", function()
{
  var result = grequire(module, '*', { nodir: false })

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'b.js',
    exports: { whoami: 'b' }
  }, {
    filename: 'sub-1',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'sub-2',
    exports: { whoami: 'sub-2/a' }
  }])
})


/**
 * This allows to require node_modules, for example.
 */
it("grequire(module, '../node_modules/{ch*,mo*}', { nodir: false })", function()
{
  var result = grequire(module, '../node_modules/{ch*,mo*}', { nodir: false })

  assert.lengthOf(result, 2)

  assert.equal(result[0].filename, '../node_modules/chai')
  assert.equal(result[1].filename, '../node_modules/mocha')

  assert.strictEqual(result[0].exports, require('chai'))
  assert.strictEqual(result[1].exports, require('mocha'))
})


/* 
 * Let's check some other patterns.
 */
it("grequire(module, '*/*.js')", function()
{
  var result = grequire(module, '*/*.js')

  assert.deepEqual(result, [{
    filename: 'sub-1/a.js',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'sub-1/b.js',
    exports: { whoami: 'sub-1/b' }
  }, {
    filename: 'sub-2/a.js',
    exports: { whoami: 'sub-2/a' }
  }, {
    filename: 'sub-2/b.js',
    exports: { whoami: 'sub-2/b' }
  }])
})


it("grequire(module, '*/a.js')", function()
{
  var result = grequire(module, '*/a.js')

  assert.deepEqual(result, [{
    filename: 'sub-1/a.js',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'sub-2/a.js',
    exports: { whoami: 'sub-2/a' }
  }])
})


it("grequire(module, '**/a.js')", function()
{
  var result = grequire(module, '**/a.js')

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'sub-1/a.js',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'sub-2/a.js',
    exports: { whoami: 'sub-2/a' }
  }])
})


it("grequire(module, '*-1/{a,b}.*')", function()
{
  var result = grequire(module, '*-1/{a,b}.*')

  assert.deepEqual(result, [{
    filename: 'sub-1/a.js',
    exports: { whoami: 'sub-1/a' }
  }, {
    filename: 'sub-1/b.js',
    exports: { whoami: 'sub-1/b' }
  }])
})


/* 
 * Alternatively, you may omit the first "module" argument. This is not recommended,
 * howewer, because:
 *
 * - You'll need to specify the base directory using globOpts.cwd field, otherwise
 *   all requires will be relative to the app's working directory obtained from
 *   the process.cwd() call.
 *
 * - Inside the required modules, module.parent will point to the grequire module,
 *   instead of pointing directly to your module.
 *
 * - You are not protected from requiring your own module when the pattern matches
 *   it too.
 */
it("grequire('test/*.js')", function()
{
  var result = grequire('test/*.js')

  assert.deepEqual(result, [{
    filename: 'test/a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'test/b.js',
    exports: { whoami: 'b' }
  }, {
    filename: 'test/index.js',
    exports: {}
  }])
})


it("grequire('*.js', { cwd: __dirname })", function()
{
  var result = grequire('*.js', { cwd: __dirname })

  assert.deepEqual(result, [{
    filename: 'a.js',
    exports: { whoami: 'a' }
  }, {
    filename: 'b.js',
    exports: { whoami: 'b' }
  }, {
    filename: 'index.js',
    exports: {}
  }])
})


it("grequire(__dirname + '/*.js')", function()
{
  var result = grequire(__dirname + '/*.js')

  assert.deepEqual(result, [{
    filename: __dirname + '/a.js',
    exports: { whoami: 'a' }
  }, {
    filename: __dirname + '/b.js',
    exports: { whoami: 'b' }
  }, {
    filename: __dirname + '/index.js',
    exports: {}
  }])
})
