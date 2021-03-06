import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'

const OUTPUT_FOLDER = 'dist'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.js',
  output: {
    banner: '#!/usr/bin/env node',
    file: `${OUTPUT_FOLDER}/bundle.js`,
    format: 'cjs',
    exports: 'default',
  },
  external: [
    'commander',
    'chalk',
    'path',
    'fs-extra',
    'os',
    'mustache',
    'execa',
    'child_process',
    'listr',
    'cfonts',
  ],
  plugins: [
    commonjs(),
    json(),
    copy({
      targets: [{ src: 'template/*', dest: `${OUTPUT_FOLDER}/template` }],
    }),
  ],
}
