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

const dependencies = ['yargs@16.2.0', 'chalk@4.1.0']

const devDependencies = [
  // * Code quality
  'xo@0.36.1',
  'typescript@4.1.3',
  'tslib@2.0.3',
  'husky@4.3.6',
  'lint-staged@10.5.3',
  // * --
  // * Testing
  'ava@3.14.0',
  '@babel/register@7.12.10',
  '@babel/core@7.12.10',
  '@babel/preset-env@7.12.11',
  '@babel/preset-typescript@7.12.7',
  // * --
  // * Other
  'esbuild@0.8.26',
  'np@7.1.0',
  'chokidar-cli@2.1.0',
  '@types/yargs@15.0.12',
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
          // TODO: Handle non ink case
          destination: 'src/index.tsx',
        })

        createFileFromTemplate({
          source: 'tsconfig.template.json',
          destination: 'tsconfig.json',
        })

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
