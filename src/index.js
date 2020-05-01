const commander = require('commander')
const chalk = require('chalk')
const CFonts = require('cfonts')

const packageJson = require('../package.json')
const displayNoToolNameMessage = require('./message/noToolName')
const makeCLITool = require('./makeCLITool')

let toolName

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<tool-name>')
  .usage(`${chalk.green('<tool-name>')} [options]`)
  .action((name) => {
    toolName = name
  })
  .on('--help', () => {
    console.log()
    console.log(`    Only ${chalk.green('<tool-name>')} is required.`)
    console.log()
  })
  .option('--use-ink', 'Use react for the command line')
  .parse(process.argv)

// ! Cannot get to here currently since commander will finish before if name not present
if (typeof toolName === 'undefined') {
  displayNoToolNameMessage({ program })
  process.exit(1)
}

console.log()
CFonts.say(`${packageJson.name}`, {
  font: 'tiny',
  colors: ['#f2a31b'],
  space: false,
})
console.log(` v${packageJson.version}`)
console.log()

makeCLITool({ toolName })
