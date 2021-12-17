import process from 'node:process'
import path from 'node:path'
import os from 'node:os'

import chalk from 'chalk'
import fs from 'fs-extra'
import execa from 'execa'
// @ts-expect-error will change to listr2
import Listr from 'listr'

import getPackageJsonTemplate from './getPackageJsonTemplate'
import createFileFromTemplate from './createFileFromTemplate'

const dependencies = ['yargs@17.3.0', 'chalk@4.1.0']

const devDependencies = [
  'typescript@4.5.4',
  'package-preview@4.0.0',
  'ava@3.15.0',
  'np@7.6.0',
  '@types/yargs@17.0.7',
  'chokidar-cli@3.0.0',
]

const makeCLITool = (toolName: string) => {
  const rootPath = path.resolve(toolName)

  console.log(` Creating a CLI tool in ${chalk.green(rootPath)}`)
  console.log()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const tasks = new Listr([
    {
      title: 'Create project folder',
      task: () => {
        if (fs.existsSync(rootPath)) {
          throw new Error('Project folder already exists')
        }

        fs.mkdirSync(rootPath)
        const packageJsonTemplate = getPackageJsonTemplate(toolName)

        fs.writeFileSync(
          path.join(rootPath, 'package.json'),
          JSON.stringify(packageJsonTemplate, null, 2) + os.EOL,
        )
      },
    },
    {
      title: 'Git init',
      task: () => {
        try {
          // * Change directory so that Husky gets installed in the right .git folder
          process.chdir(rootPath)
        } catch {
          throw new Error(`Could not change to project directory: ${rootPath}`)
        }

        try {
          execa.sync('git', ['init', '-b', 'main'])
        } catch {
          throw new Error('Git repo not initialized')
        }
      },
    },
    {
      title: 'Copy template files',
      task: () => {
        const templateDirectory = path.join(__dirname, `/../template`)

        try {
          fs.copySync(`${templateDirectory}/folder`, rootPath)
        } catch (error) {
          throw new Error(`Could not copy template files ${error.message}`)
        }

        // Rename gitignore to prevent npm from renaming it to .npmignore
        // See: https://github.com/npm/npm/issues/1862
        fs.moveSync(
          path.join(rootPath, 'gitignore'),
          path.join(rootPath, '.gitignore'),
        )

        createFileFromTemplate({
          source: `${templateDirectory}/README.template.md`,
          destination: path.join(rootPath, 'README.md'),
          options: { toolName },
        })

        const buildFileName = 'build-test.sh'
        const buildFileDestination = path.join(rootPath, buildFileName)

        createFileFromTemplate({
          source: `${templateDirectory}/${buildFileName}`,
          destination: buildFileDestination,
          options: { toolName },
        })

        fs.chmodSync(buildFileDestination, '755')
      },
    },
    {
      title: 'Install dependencies',
      task: async () => {
        const command = 'npm'
        const defaultArgs = ['install', '--save-exact']
        const devArgs = defaultArgs.concat('--save-dev').concat(devDependencies)
        const prodArgs = defaultArgs.concat(dependencies)

        return execa(command, devArgs)
          .then(() => execa(command, prodArgs))
          .catch(() => {
            throw new Error('Could not install dependencies')
          })
      },
    },
    {
      title: 'Git commit',
      task: () => {
        try {
          execa.sync('git', ['add', '-A'])

          execa.sync('git', [
            'commit',
            '--no-verify',
            '-m',
            'Initialize project using make-cli-tool',
          ])
        } catch {
          throw new Error('Could not create commit')
        }
      },
    },
  ])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  tasks
    .run()
    .then(() => {
      console.log()
      console.log(
        `${chalk.green(' Success!')} Created ${chalk.cyan(
          toolName,
        )} at ${chalk.cyan(rootPath)}`,
      )
      console.log()
      console.log(' Start by typing:')
      console.log()
      console.log(chalk.cyan(`   cd ${toolName}`))
      console.log()
      console.log(`   ${chalk.cyan('npm run go')}`)
      console.log()
    })
    .catch((error: unknown) => {
      console.log()
      console.error(chalk.red(error))
      console.log()
      process.exit(1)
    })
}

export default makeCLITool
