const { build } = require('esbuild')

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'dist',
  banner: '#!/usr/bin/env node',
  external: [],
  platform: 'node',
}

const run = async () => {
  try {
    await build(buildOptions)
    console.log(`   Built to ${buildOptions.outdir}`)
    console.log()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

run()
