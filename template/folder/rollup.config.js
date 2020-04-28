import commonjs from '@rollup/plugin-commonjs'

const OUTPUT_FOLDER = 'dist'
export default {
  input: 'src/index.js',
  output: {
    banner: '#!/usr/bin/env node',
    file: `${OUTPUT_FOLDER}/bundle.js`,
    format: 'cjs',
  },
  external: ['yargs', 'chalk'],
  plugins: [commonjs()],
}
