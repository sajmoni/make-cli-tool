module.exports = ({ toolName }) => {
  const packageJsonTemplate = {
    name: toolName,
    license: 'MIT',
    version: '0.0.0',
    description: '',
    keywords: [],
    scripts: {
      build: 'rm -rf dist && parcel build src/index.js --no-cache',
      test: 'ava',
      lint: 'eslint src',
      // eslint-disable-next-line quotes
      format: 'prettier --write "src/**/*.js"',
      // TODO: Revise
      typecheck: 'tsc src/*.js',
      'check-all': 'yarn lint && yarn typecheck ',
      plop: 'plop',
      release: 'yarn clean && yarn audit && yarn build && np',
      clean: `rm -f ${toolName}.tgz`,
      'build-test': './build-test.sh',
    },
    bin: 'dist/index.js',
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
    },
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
        'pre-push': 'yarn test',
      },
    },
  }

  return packageJsonTemplate
}
