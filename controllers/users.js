const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_request, response, next) => {
  try {
    const allUsers = await User.find({}).populate('phonebook', { name: 1, number: 1 })
    response.status(200).json(allUsers)
  } catch(exception) {
    next(exception)
  }
})


usersRouter.post('/', async (request, response, next)  => {
  const { username, name, password } = request.body

  if (username === undefined || password === undefined) {
    return response.status(400).json({
      error: 'username and password are required.'
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long.'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  try {
    const savedUser = await user.save()

    return response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})



module.exports = usersRouter