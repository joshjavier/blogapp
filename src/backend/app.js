import express from 'express'
import cors from 'cors'
import { connect } from 'mongoose'

import { MONGODB_URI } from './utils/config.js'
import * as logger from './utils/logger.js'
import * as middleware from './utils/middleware.js'

import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import testingRouter from './controllers/testing.js'

const app = express()

logger.info('Connecting to the database...')

connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB!')
  })
  .catch((error) => {
    logger.error(error)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
  app.use('/', (_req, res) => res.send('ok'))
}

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('dist'))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
