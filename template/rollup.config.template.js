{{ #useInk }}
import typescript from '@rollup/plugin-typescript'
{{ /useInk }}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // TODO: Handle non ink input (different templates)
  input: 'src/index.tsx',
  output: {
    banner: '#!/usr/bin/env node',
    dir: 'dist',
    format: 'cjs',
  },
  external: ['yargs', 'chalk'{{ #useInk }}, 'react', 'ink'{{ /useInk }}],
  plugins: [{{ #useInk }}typescript(){{ /useInk }}],
}
