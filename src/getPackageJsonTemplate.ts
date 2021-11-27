const getPackageJsonTemplate = (toolName: string) => {
  const packageJsonTemplate = {
    name: toolName,
    license: 'MIT',
    version: '0.0.0',
    description: '',
    keywords: [],
    scripts: {
      build: 'tsc',
      version: 'npm run build',
      test: 'ava',
      clean: 'rm -rf dist',
      release: 'npm run clean && npm run build && np --no-tests',
      start:
        'chokidar "src" -c "npm run build && node dist/index.js" --initial --silent',
      go: './build-test.sh',
      qa: 'tsc && xo --fix',
    },
    bin: 'dist/index.js',
    files: ['dist/'],
    ava: {
      require: ['esbuild-runner/register'],
      extensions: ['ts'],
    },
    prettier: {
      trailingComma: 'all',
      semi: false,
      singleQuote: true,
      useTabs: false,
      bracketSpacing: true,
    },
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    xo: {
      prettier: true,
      env: ['es2020', 'node'],
      rules: {
        'unicorn/no-process-exit': 'off',
        'unicorn/filename-case': 'off',
        'capitalized-comments': 'off',
        'dot-notation': 'off',
      },
    },
  }

  return packageJsonTemplate
}

export default getPackageJsonTemplate
