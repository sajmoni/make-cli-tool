module.exports = {
  '**/*.js?(x)': () => 'tsc',
  'src/**/*.{js,md}': ['xo --fix'],
}
