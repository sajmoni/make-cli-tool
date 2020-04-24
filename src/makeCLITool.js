const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const os = require('os')

const getPackageJsonTemplate = require('./getPackageJsonTemplate.js')

const dependencies = ['yargs@15.1.0', 'chalk@3.0.0']

const inkDependencies = ['ink', 'react']

// TODO: Output dependencies installed
const devDependencies = [
  // * Code quality
  'eslint@6.8.0',
  'eslint-config-prettier@6.10.1',
  'typescript@3.8.3',
  'husky@4.2.3',
  'lint-staged@10.1.0',
  'prettier@2.0.2',
  // * --
  // * Testing
  '@ava/babel@1.0.1',
  'ava@3.5.2',
  'eslint-plugin-ava@10.2.0',
  // * --
  // * Other
  'parcel@2.0.0-alpha.3.2',
  'np@6.2.0',
  'plop@2.6.0',
  // * --
]

module.exports = ({ toolName }) => {
  const rootPath = path.resolve(toolName)

  if (fs.existsSync(rootPath)) {
    console.log()
    console.log(
      `${chalk.red('  Error: Project folder already exists')} ${chalk.cyan(
        rootPath,
      )}`,
    )
    console.log()
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  console.log()
  console.log(`  Creating a CLI tool in ${chalk.green(rootPath)}`)
  console.log()

  fs.mkdirSync(rootPath)

  const packageJsonTemplate = getPackageJsonTemplate({ toolName })

  fs.writeFileSync(
    path.join(rootPath, 'package.json'),
    JSON.stringify(packageJsonTemplate, null, 2) + os.EOL,
  )
}
