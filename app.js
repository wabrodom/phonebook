const express = require('express')
const mongoose = require('mongoose')
const configs = require('./utils/configs')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const personRouter = require('./controllers/person')
const middleware = require('./utils/middleware')

mongoose.connect(configs.MONGODB_URI)

app.use(cors())
app.use(express.json())

morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use('/api/persons', personRouter)

app.use(express.static('dist'))

app.get('/', (_request, response) => {
  response.send('<h1>backend with nodejs and express</h1>')
})

app.use(middleware.errorHandler)

module.exports = app