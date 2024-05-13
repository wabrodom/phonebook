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