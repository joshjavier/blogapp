const morgan = require('morgan')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

morgan.token('request-body', (req) => JSON.stringify(req.body))
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :request-body',
  {
    skip: () => process.env.NODE_ENV === 'test',
  }
)

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'username must be unique' })
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: err.message })
  }

  next(err)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('Authorization')
  req.token = auth && auth.startsWith('Bearer ')
    ? auth.replace('Bearer ', '')
    : null

  next()
}

const userExtractor = async (req, res, next) => {
  try {
    if (req.method === 'POST' || req.method === 'DELETE') {
      const payload = jwt.verify(req.token, process.env.SECRET)
      const user = await User.findById(payload.id)
      req.user = user
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
