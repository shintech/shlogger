const winston = require('winston')
const path = require('path')

const NODE_ENV = process.env['NODE_ENV']

const defaults = {
  name: 'default'
}

module.exports = function ({ directory, pkg = defaults }) {
  const defaultName = pkg.name

  let logger = winston.createLogger({
    level: 'info',
    format: winston.format.json()
  })

  if (NODE_ENV === 'test') {
    return logger.add(
      new winston.transports.File({ filename: path.join(__dirname, 'log', `${defaultName}-test.log`), level: 'info' })
    )
  }

  if (directory !== undefined) {
    logger.add(new winston.transports.File({ filename: path.join(directory, `${defaultName}-error.log`), level: 'error' }))
    logger.add(new winston.transports.File({ filename: path.join(directory, `${defaultName}-combined.log`), level: 'info' }))
  }

  if (directory === undefined || NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }))
  }

  return logger
}
