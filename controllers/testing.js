const testingRouter = require('express').Router()
const User = require('../models/user')
const Person = require('../models/person')

testingRouter.post('/reset', async (_request, response) => {
  await User.deleteMany({})
  await Person.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter