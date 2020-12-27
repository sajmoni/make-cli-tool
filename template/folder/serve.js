const { build } = require('esbuild')

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: false,
  outdir: 'dist',
  banner: '#!/usr/bin/env node',
  external: [],
  platform: 'node',
  logLevel: 'error'
}

const run = async () => {
  try {
    await build(buildOptions)
    
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

run()
