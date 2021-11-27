import process from 'node:process'

import commander from 'commander'
import chalk from 'chalk'
// @ts-expect-error No types for this lib
import CFonts from 'cfonts'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJson from '../package.json'
import makeCLITool from './makeCLITool'

let toolName

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<tool-name>')
  .usage(`${chalk.green('<tool-name>')} [options]`)
  .action((name: string) => {
    toolName = name
  })
  .on('--help', () => {
    console.log()
    console.log(`  Only ${chalk.green('<tool-name>')} is required.`)
    console.log()
  })
  .parse(process.argv)

// ! Cannot get to here currently since commander will finish before if name not present
if (typeof toolName === 'undefined') {
  console.log()
  console.error(' Please specify the project directory:')
  console.log(
    `   ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
  )
  console.log()
  console.log(' For example:')
  console.log(`   ${chalk.cyan(program.name())} ${chalk.green('my-cli-tool')}`)
  console.log()
  console.log(
    `   Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
  )
  process.exit(1)
}

console.log()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
CFonts.say(`${packageJson.name}`, {
  font: 'tiny',
  colors: ['#f2a31b'],
  space: false,
})
console.log(` v${packageJson.version}`)
console.log()

makeCLITool(toolName)
