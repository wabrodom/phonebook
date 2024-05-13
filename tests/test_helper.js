const Person = require('../models/phonebook')
const User = require('../models/user')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialPersons, 
  nonExistingId, 
  personsInDb, 
  usersInDb,
}