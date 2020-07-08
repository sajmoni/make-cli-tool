const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const os = require('os')
const Mustache = require('mustache')
const execa = require('execa')
const Listr = require('listr')

const displayDoneMessage = require('./message/done')
const createFileFromTemplate = require('./createFileFromTemplate')
const getPackageJsonTemplate = require('./getPackageJsonTemplate.js')

const dependencies = ['yargs@15.4.0', 'chalk@4.1.0']

const devDependencies = [
  // * Code quality
  'xo@0.32.1',
  'typescript@3.9.6',
  'husky@4.2.5',
  'lint-staged@10.2.11',
  // * --
  // * Testing
  'ava@3.9.0',
  // * --
  // * Other
  'rollup@2.18.2',
  '@rollup/plugin-commonjs@13.0.0',
  'np@6.2.5',
  // * --
]

const inkDependencies = [
  'ink@next',
  'react@16.13.1',
  'eslint-config-xo-react@0.23.0',
  'eslint-plugin-react@7.20.3',
  'eslint-plugin-react-hooks@4.0.5',
]

const inkDevDependencies = [
  '@babel/core@7.10.4',
  '@babel/preset-env@7.10.4',
  '@babel/preset-react@7.10.4',
  '@rollup/plugin-babel@5.0.4',
  '@types/react@16.9.41',
]

module.exports = ({ toolName, useInk }) => {
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
        const packageJsonTemplate = getPackageJsonTemplate({ toolName, useInk })

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
        } catch {
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
        const templateDirectory = path.join(__dirname, 'template/folder')

        try {
          fs.copySync(templateDirectory, rootPath)
        } catch (error) {
          throw new Error(`Could not copy template files: ${error}`)
        }

        // * Rename gitignore to prevent npm from renaming it to .npmignore
        // * See: https://github.com/npm/npm/issues/1862
        fs.copySync(
          path.join(__dirname, 'template/gitignore'),
          path.join(rootPath, '.gitignore'),
        )

        const readmeTemplateString = fs
          .readFileSync(path.join(__dirname, `template/README.template.md`))
          .toString()
        const readme = Mustache.render(readmeTemplateString, { toolName })
        fs.writeFileSync(path.join(rootPath, 'README.md'), readme)

        const buildFileName = 'build-test.sh'

        const buildFileString = fs
          .readFileSync(path.join(__dirname, `template/${buildFileName}`))
          .toString()
        const buildFile = Mustache.render(buildFileString, { toolName })
        const buildPath = path.join(rootPath, 'build-test.sh')
        fs.writeFileSync(buildPath, buildFile)
        fs.chmodSync(buildPath, '755')

        createFileFromTemplate({
          source: 'index.template.js',
          destination: 'src/index.js',
          options: {
            useInk,
          },
        })

        createFileFromTemplate({
          source: 'tsconfig.template.json',
          destination: 'tsconfig.json',
          options: {
            useInk,
          },
        })

        createFileFromTemplate({
          source: 'rollup.config.template.js',
          destination: 'rollup.config.js',
          options: {
            useInk,
          },
        })

        if (useInk) {
          fs.copySync(
            path.join(__dirname, 'template/App.js'),
            path.join(rootPath, 'src/App.js'),
          )
        }

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
        let devArgs = defaultArgs.concat('--dev').concat(devDependencies)
        let prodArgs = defaultArgs.concat(dependencies)

        if (useInk) {
          prodArgs = prodArgs.concat(inkDependencies)
          devArgs = devArgs.concat(inkDevDependencies)
        }

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
          } catch {
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
