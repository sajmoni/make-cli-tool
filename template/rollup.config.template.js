import commonjs from '@rollup/plugin-commonjs'
{{ #useInk }}
import babel from '@rollup/plugin-babel'
{{ /useInk }}

const OUTPUT_FOLDER = 'dist'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.js',
  output: {
    banner: '#!/usr/bin/env node',
    file: `${OUTPUT_FOLDER}/bundle.js`,
    format: 'cjs',
  },
  external: ['yargs', 'chalk'{{ #useInk }}, 'react', 'ink'{{ /useInk }}],
  plugins: [{{ #useInk }}babel({ babelHelpers: 'bundled' }), {{ /useInk }}commonjs()],
}
