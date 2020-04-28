const commander = require('commander')
const chalk = require('chalk')

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

if (typeof toolName === 'undefined') {
  displayNoToolNameMessage({ program })
  process.exit(1)
}

// TODO: Make this output look nicer
console.log()
console.log(`  ${packageJson.name}`)
console.log()
console.log(`  version: ${packageJson.version}`)
console.log()

makeCLITool({ toolName })
