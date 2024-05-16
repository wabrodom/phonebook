const Person = require('../models/person')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialPersons = [
  {
    name: 'Joshua',
    number: '056-43123',
  },
  {
    name: 'Mila',
    number: '090-847239',
  }
]

const nonExistingId = async () => {
  const person = new Person({
    name: 'willremovethissoon',
    number: '012-12345678'
  })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(p => p.toJSON())
}

const personsInTheirDb = async (userId) => {
  const persons = await Person.find({ user: { id: userId } })
  return persons.map(p => p.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const loginGetAuthorizationStr = async (loginInfo) => {
  const userObjectWithToken = await api
    .post('/api/login')
    .send(loginInfo)
  const authorizationStr =  'bearer ' + userObjectWithToken.body.token
  return authorizationStr
}

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb,
  personsInTheirDb,
  usersInDb,
  loginGetAuthorizationStr,
}