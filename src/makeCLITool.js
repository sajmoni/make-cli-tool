const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const os = require('os')
const Mustache = require('mustache')
const execa = require('execa')
const Listr = require('listr')

const displayDoneMessage = require('./message/done')

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

  let initializedGit

  console.log(` Creating a CLI tool in ${chalk.green(rootPath)}`)
  console.log()

  const tasks = new Listr([
    {
      title: 'Create project folder',
      task: () => {
        if (fs.existsSync(rootPath)) {
          throw new Error('Project folder already exists')
        }

        fs.mkdirSync(rootPath)
        const packageJsonTemplate = getPackageJsonTemplate({ toolName })

        fs.writeFileSync(
          path.join(rootPath, 'package.json'),
          JSON.stringify(packageJsonTemplate, null, 2) + os.EOL,
        )
        return true
      },
    },
    {
      title: 'Git init',
      exitOnError: false,
      task: () => {
        try {
          // * Change directory so that Husky gets installed in the right .git folder
          process.chdir(rootPath)
        } catch (_) {
          throw new Error(`Could not change to project directory: ${rootPath}`)
        }

        try {
          execa.sync('git', ['init'])

          initializedGit = true
          return true
        } catch (error) {
          throw new Error(`Git repo not initialized ${error}`)
        }
      },
    },
    {
      title: 'Copy template files',
      task: () => {
        const templateDirectory = `${__dirname}/template/folder`

        try {
          fs.copySync(templateDirectory, rootPath)
        } catch (error) {
          throw new Error(`Could not copy template files: ${error}`)
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

        return true
      },
    },
    {
      title: 'Install dependencies',
      task: () => {
        const command = 'yarn'
        const defaultArgs = ['add', '--exact']
        const devArgs = defaultArgs.concat('--dev').concat(devDependencies)
        const prodArgs = defaultArgs.concat(dependencies)

        return execa(command, devArgs)
          .then(() => execa(command, prodArgs))
          .catch((error) => {
            throw new Error(`Could not install dependencies, ${error}`)
          })
      },
    },
    {
      title: 'Git commit',
      exitOnError: false,
      skip: () => !initializedGit,
      task: () => {
        try {
          execa.sync('git', ['add', '-A'])

          execa.sync('git', [
            'commit',
            '--no-verify',
            '-m',
            'Initialize project using make-cli-tool',
          ])
          return true
        } catch (error) {
          // * It was not possible to commit.
          // * Maybe the commit author config is not set.
          // * Remove the Git files to avoid a half-done state.
          try {
            fs.removeSync(path.join(rootPath, '.git'))
            throw new Error(`Could not create commit ${error}`)
          } catch (_) {
            throw new Error(`Could not create commit ${error}`)
          }
        }
      },
    },
  ])

  tasks
    .run()
    .then(() => {
      displayDoneMessage({ name: toolName, rootPath })
    })
    .catch((error) => {
      console.log()
      console.error(chalk.red(error))
      console.log()
      process.exit(1)
    })
}
