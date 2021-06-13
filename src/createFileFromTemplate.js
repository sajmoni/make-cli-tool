const fs = require('fs-extra')
const path = require('path')
const Mustache = require('mustache')

const createFileFromTemplate = ({ source, destination }) => {
  const templateString = fs
    .readFileSync(path.join(__dirname, `template/${source}`))
    .toString()
  const file = Mustache.render(templateString)
  fs.writeFileSync(destination, file)
}

module.exports = createFileFromTemplate
