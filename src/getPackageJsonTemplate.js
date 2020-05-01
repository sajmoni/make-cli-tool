module.exports = ({ toolName }) => {
  const packageJsonTemplate = {
    name: toolName,
    license: 'MIT',
    version: '0.0.0',
    description: '',
    keywords: [],
    scripts: {
      build: 'rm -rf dist && rollup --config rollup.config.js',
      test: 'ava',
      release: 'yarn clean && yarn audit && yarn build && np',
      clean: `rm -f ${toolName}.tgz`,
      go: './build-test.sh',
    },
    bin: 'dist/bundle.js',
    files: ['dist/'],
    directories: {
      example: 'example',
    },
    ava: {
      babel: true,
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
        'pre-push': 'yarn test',
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
