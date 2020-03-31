const chalk = require('chalk')

module.exports = ({ name, rootPath }) => {
  console.log()
  console.log(
    `${chalk.green('  Success!')} Created ${chalk.cyan(name)} at ${chalk.cyan(
      rootPath,
    )}`,
  )
  console.log()
  console.log('  Start by typing:')
  console.log()
  console.log(chalk.cyan(`    cd ${name}`))
  console.log()
  console.log(`    ${chalk.cyan('yarn go')}`)
  console.log()
  console.log('  Good luck!')
  console.log()
}
