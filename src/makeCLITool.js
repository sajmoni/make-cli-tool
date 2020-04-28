const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const os = require('os')
const Mustache = require('mustache')
const execa = require('execa')

const displayDoneMessage = require('./message/done')

const tryGitInit = require('./git/init')
const tryGitCommit = require('./git/commit')

const getPackageJsonTemplate = require('./getPackageJsonTemplate.js')

const dependencies = ['yargs@15.1.0', 'chalk@3.0.0']

// const inkDependencies = ['ink', 'react']

// TODO: Output dependencies installed
const devDependencies = [
  // * Code quality
  'xo@0.29.1',
  'typescript@3.8.3',
  'husky@4.2.3',
  'lint-staged@10.1.0',
  // * --
  // * Testing
  'ava@3.5.2',
  // * --
  // * Other
  'rollup@2.7.2',
  '@rollup/plugin-commonjs@11.1.0',
  'np@6.2.0',
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

  try {
    // * Change directory so that Husky gets installed in the right .git folder
    process.chdir(rootPath)
  } catch (_) {
    console.log(
      `${chalk.red(
        '  Error: Could not change to project directory',
      )} ${chalk.cyan(rootPath)}`,
    )
    process.exit(1)
  }

  const initializedGit = tryGitInit()

  console.log()
  console.log('  Copying files from template.')

  const templateDirectory = `${__dirname}/template/folder`

  try {
    fs.copySync(templateDirectory, rootPath)
  } catch (error) {
    console.log(
      `${chalk.red('  Error: Could not copy template files: ')} ${error}`,
    )
  }

  // * Rename gitignore to prevent npm from renaming it to .npmignore
  // * See: https://github.com/npm/npm/issues/1862
  fs.copySync(
    `${__dirname}/template/gitignore`,
    path.join(rootPath, '.gitignore'),
  )

  const readmeTemplateString = fs
    .readFileSync(`${__dirname}/template/README.template.md`)
    .toString()
  const readme = Mustache.render(readmeTemplateString, { toolName })
  fs.writeFileSync(path.join(rootPath, 'README.md'), readme)

  const buildFileName = 'build-test.sh'

  const buildFileString = fs
    .readFileSync(`${__dirname}/template/${buildFileName}`)
    .toString()
  const buildFile = Mustache.render(buildFileString, { toolName })
  const buildPath = path.join(rootPath, 'build-test.sh')
  fs.writeFileSync(buildPath, buildFile)
  fs.chmodSync(buildPath, '755')

  const exampleProjectPackageJson = {
    name: 'example',
    private: true,
    scripts: {
      refresh: 'yarn cache clean && yarn install --force --no-lockfile',
    },
    dependencies: {
      [toolName]: `file:../${toolName}.tgz`,
    },
  }

  fs.mkdirSync(path.join(rootPath, 'example'))
  fs.writeFileSync(
    path.join(rootPath, 'example/package.json'),
    JSON.stringify(exampleProjectPackageJson, null, 2) + os.EOL,
  )

  console.log('  Installing packages.')
  console.log()

  const command = 'yarn'
  const defaultArgs = ['add', '--exact']
  const devArgs = defaultArgs.concat('--dev').concat(devDependencies)
  const prodArgs = defaultArgs.concat(dependencies)

  execa(command, devArgs)
    .then(() => execa(command, prodArgs))
    .then(() => {
      if (initializedGit) {
        tryGitCommit({ rootPath })
      }

      displayDoneMessage({ name: toolName, rootPath })
    })
    .catch(() => {
      // TODO: Add test case for this?
      console.log()
      console.log(chalk.red('  Aborting installation.'))
      console.log()
    })
}
