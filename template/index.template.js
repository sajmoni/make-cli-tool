import yargs from 'yargs'
import chalk from 'chalk'

{{ #useInk }}
import React from 'react'
import { render } from 'ink'
import App from './App'

{{ /useInk }}
yargs.parse()

console.log()
console.log(` ${chalk.green('Tool was executed successfully!')}`)
console.log()
{{ #useInk }}

render(<App />)
{{ /useInk }}
