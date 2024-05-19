const personRouter = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')
const middleware = require('../utils/middleware')

personRouter.get('/info', async (_request, response, next) => {
  try {
    const personsLength = await Person.countDocuments({})
    const usersLength = await User.countDocuments({})
    response.status(200).json({
      user: usersLength,
      contactPersons: personsLength
    })
  } catch(error) {
    next(error)
  }
})

personRouter.get('/', middleware.userExtracter, (request, response, next) => {
  const user = request.user

  if (user.phonebook === undefined) {
    return
  }

  Person
    .find({ user:  user._id  })
    .populate('user', { username: 1, name: 1 })
    .then(phonebook => {
      response.json(phonebook)
    })
    .catch(error => next(error))
})

personRouter.get('/:id', middleware.userExtracter, async (request, response, next) => {
  const personId = request.params.id


  try {
    const user = request.user

    if (user === null) {
      return response.status(400).json({
        error: 'Bad request. The user id is not found.'
      })
    }

    if (user.phonebook === undefined) {
      return
    }

    const foundPerson = await Person
      .findById(personId)
      .populate('user', { username: 1, name: 1 })

    if (foundPerson.user._id.toString() === user._id.toString()) {
      return response.status(200).json(foundPerson)
    } else {
      response.statusCode = 404
      response.statusMessage = 'Not found person identifier'
      response.send('not found the person')
    }
  } catch (error) {
    next(error)
  }
})

personRouter.delete('/:id', middleware.userExtracter ,async (request, response, next) => {
  const personId = request.params.id
  try {
    const user = request.user

    if (user === null) {
      return response.status(400).json({
        error: 'Bad request. The user id is not found.'
      })
    }

    if (user.phonebook === undefined) {
      return
    }

    const foundPerson = await Person.findById(personId)

    if (foundPerson.user._id.toString() === user._id.toString()) {
      const deletePerson = await Person.findByIdAndDelete(personId)
      user.phonebook = user.phonebook.filter(personId => {
        personId.toString() !== deletePerson._id.toString()
      })

      await user.save()
      return response.status(204).end()
    }
    else {
      return response.status(400).json({
        error: 'Bad request. The user is not added this person'
      })
    }
  } catch(exception) {
    next(exception)
  }
})


personRouter.post('/', middleware.userExtracter ,  async (request, response, next) => {
  const { name, number, note } = request.body

  try {
    const user = request.user

    if (user === null ) {
      return response.status(400).json({
        error: 'the user id is not found.'
      })
    }
    // in case of got response from jwt.verify throw, has to filter out these action
    if (user.phonebook === undefined) {
      return
    }

    const newPerson = new Person({
      name,
      number,
      note: !note ? '' : note,
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

personRouter.put('/:id', middleware.userExtracter, (request, response, next) => {
  const body = request.body

  const user = request.user

  if (user === null ) {
    return response.status(400).json({
      error: 'the user id is not found.'
    })
  }

  if (user.phonebook === undefined) return

  const updatePerson = {
    name: body.name,
    number: body.number,
  }

  if (body.note) {
    updatePerson.note = body.note
  }

  Person.findByIdAndUpdate(
    request.params.id,
    updatePerson,
    { new : true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.status(200).json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personRouter