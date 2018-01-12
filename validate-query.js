exports.command = 'validate-query <file>'
exports.desc = 'Validate GraphQL query'

const fs = require('fs')
const process = require('process')

const chalk = require('chalk')
const graphql = require('graphql')

const loadSchema = (config) => {
  try {
    return graphql.buildSchema(config.getSchemaSDL())
  } catch (error) {
    console.log(chalk.red(error.toString()))
  }
}

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => err ? reject(err) : resolve(data))
  })
}

const validateQuery = async (schema, queryFile) => {
  const queryText = await readFile(queryFile)
  try {
    const queryDoc = parse(queryText)
  } catch (error) {
    console.log(chalk.red(error.toString()))
    process.exit(1)
  }
  const errors = graphql.validate(schema, queryDoc)
  for (error of errors) {
    console.log(chalk.red(error.toString()))
  }
}

exports.handler = async (context, argv) => {
  const config = await context.getProjectConfig()
  const schema = loadSchema(config)
  await validateQuery(schema, argv.file)
}
