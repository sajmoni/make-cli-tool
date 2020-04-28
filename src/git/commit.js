const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

module.exports = ({ rootPath }) => {
  try {
    execSync('git add -A')

    execSync(
      'git commit --no-verify -m "Initialize project using make-cli-tool"',
    )

    console.log()
    console.log('  Created git commit')
  } catch (error) {
    console.log()
    console.log(chalk.red('  Could not create commit'), error.message)

    // TODO: Should this be kept?
    // * It was not possible to commit.
    // * Maybe the commit author config is not set.
    // * Remove the Git files to avoid a half-done state.
    try {
      fs.removeSync(path.join(rootPath, '.git'))
    } catch (_) {
      // Ignore.
    }
  }
}
