const express = require('express')
const mongoose = require('mongoose')
const configs = require('./utils/configs')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const personRouter = require('./controllers/persons')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const helmet = require('helmet')

mongoose.connect(configs.MONGODB_URI)

app.disable('x-powered-by')
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(middleware.tokenExtracter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/persons', personRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app