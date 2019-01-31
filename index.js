const winston = require('winston')
const path = require('path')

const NODE_ENV = process.env['NODE_ENV']

module.exports = function ({ directory = 'log' }) {
  let logger = winston.createLogger({
    level: 'info',
    format: winston.format.json()
  })

  if (NODE_ENV === 'test') {
    return logger.add(
      new winston.transports.File({ filename: path.join(directory, 'test.log'), level: 'info' })
    )
  }

  if (NODE_ENV !== undefined) {
    logger.add(new winston.transports.File({ filename: path.join(directory, 'error.log'), level: 'error' }))
    logger.add(new winston.transports.File({ filename: path.join(directory, 'combined.log'), level: 'info' }))
  }

  if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }))
  }

  return logger
}
