const personRouter = require('express').Router()
const Person = require('../models/phonebook')
const middleware = require('../utils/middleware')

personRouter.get('/info', (_request, response, next) => {
  Person.countDocuments({})
    .then(info => {
      const personsLength = info
      const personsLengthText = `<p> Phonebook has info for ${personsLength} people.</p>`
      const time = `<p>${new Date()}</p>`
      response.send(`${personsLengthText} ${time}`)
    })
    .catch(error => next(error))
})

personRouter.get('/', (_request, response, next) => {
  Person
    .find({}).populate('user', { username: 1, name: 1 })
    .then(phonebook => {
      response.json(phonebook)
    })
    .catch(error => next(error))
})

personRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(foundPerson => {
      if (foundPerson) {
        return response.json(foundPerson)
      } else {
        response.statusCode = 404
        response.statusMessage = 'Not found person identifier'
        response.send('not found the person')
      }
    })
    .catch(error => next(error))
})

personRouter.delete('/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})


personRouter.post('/', middleware.userExtracter ,  async (request, response, next) => {
  const { name, number } = request.body

  try {
    const user = request.user

    if (user === null) {
      return response.status(400).json({
        error: 'the user id is not found.'
      })
    }

    const newPerson = new Person({
      name,
      number,
      user: user._id
    })

    const savedPerson = await newPerson.save()
    user.phonebook = user.phonebook.concat(savedPerson._id)
    await user.save()

    const populatedPerson = await savedPerson.populate('user', { name: 1, username:1 })

    response.statusCode = 201
    response.json(populatedPerson)

  } catch(exception) {
    next(exception)
  }

})

personRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const updatePerson = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(
    request.params.id,
    updatePerson,
    { new : true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personRouter