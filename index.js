const winston = require('winston')
const path = require('path')

const NODE_ENV = process.env['NODE_ENV']
const LOG_DIR = process.env['LOG_DIR'] || 'log'

module.exports = function () {
  let logger = winston.createLogger({
    level: 'info',
    format: winston.format.json()
  })

  if (NODE_ENV === 'test') {
    return logger.add(
      new winston.transports.File({ filename: path.join(LOG_DIR, 'test.log'), level: 'info' })
    )
  }

  if (NODE_ENV !== undefined) {
    logger.add(new winston.transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' }))
    logger.add(new winston.transports.File({ filename: path.join(LOG_DIR, 'combined.log'), level: 'info' }))
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
