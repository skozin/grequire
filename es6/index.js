import path from 'path'
import glob from 'glob'

/**
 * globRequire(module, '*.js')
 * globRequire(module, '*.js', { ...globOpts })
 */
export default function globRequire(fromModule, pattern, globOpts)
{
  if ('string' === typeof fromModule) {
    globOpts = pattern
    pattern = fromModule
    fromModule = module
  }
  let fromDir = path.dirname(fromModule.filename)
  let opts = {
    nodir: true
  }
  if (globOpts) Object.keys(globOpts).forEach(opt => {
    opts[ opt ] = globOpts[ opt ]
  })
  if (opts.cwd == undefined) {
    opts.cwd = (fromDir == __dirname) ? process.cwd() : fromDir
  }
  return glob.sync(pattern, opts).map(filename => {
    let absPath = path.resolve(opts.cwd, filename)
    if (absPath != __filename && absPath != fromModule.filename) {
      return { filename,
        exports: fromModule.require('./' + path.relative(fromDir, absPath))
      }
    }
  })
  .filter(defined)
}


const defined = (x) => !!x
