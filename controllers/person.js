const personRouter = require('express').Router()
const Person = require('../models/phonebook')


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

personRouter.get('/', (_request, response) => {
  Person.find({}).then(phonebook => {
    response.json(phonebook)
  })
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

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


personRouter.post('/', (request, response, next) => {
  const body = request.body
  const name = body.name
  const number = body.number

  if (!name || !number) {
    return response.status(400).json({
      error: '400 Bad Request: name or number are missing',
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save()
    .then(returnedPerson => {
      response.json(returnedPerson)
    })
    .catch(error => next(error))

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