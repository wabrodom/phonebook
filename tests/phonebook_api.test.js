const { test, after, beforeEach, describe } = require('node:test')
const assert  = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/person')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)


beforeEach(async () => {
  await Person.deleteMany({})

  for (let p of helper.initialPersons) {
    let personObject =  new Person(p)
    await personObject.save()

  }
})

describe('when initialize data in phonebook db', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all persons are return in its toute', async () => {
    const response = await api.get('/api/persons')

    assert.strictEqual(response.body.length, helper.initialPersons.length)
  })

  test('the first person is "Joshua"', async () => {
    const response = await api.get('/api/persons')

    const contents = response.body.map(e => e.name)
    assert(contents.includes('Joshua'))
  })

})

describe('viewing specific person', () => {
  test('a person can be viewed', async () => {
    const personsAtStart = await helper.personsInDb()

    const personToView = personsAtStart[0]

    const resultNote = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, personToView)
  })

  test('return personObject have .id instead of _id', async () => {
    const response = await api.get('/api/persons')
    const firstPerson = response.body[0]

    assert.strictEqual(firstPerson._id, undefined)
    assert.strictEqual(typeof firstPerson.id, 'string')
  })
})

// describe('operation on personObject', () => {
//   test('a valid person can be added ', async () => {
//     const newPerson = {
//       name: 'Vitamin',
//       number: '011-12345678',
//     }

//     await api
//       .post('/api/persons')
//       .send(newPerson)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)

//     const personsAtEnd = await helper.personsInDb()
//     assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

//     const names = personsAtEnd.map(p => p.name)
//     assert(names.includes('Vitamin'))
//   })

//   test('person without phone number is not added', async () => {
//     const newPerson = {
//       name: 'VitaminD',
//       number: '',
//     }

//     await api
//       .post('/api/persons')
//       .send(newPerson)
//       .expect(400)

//     const personsAtEnd = await helper.personsInDb()

//     assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
//   })


//   test('a person can be deleted', async () => {
//     const personsAtStart = await helper.personsInDb()
//     const personToDelete = personsAtStart[0]


//     await api
//       .delete(`/api/persons/${personToDelete.id}`)
//       .expect(204)

//     const personsAtEnd = await helper.personsInDb()
//     const names = personsAtEnd.map(p => p.name)
//     assert(!names.includes(personToDelete.name))


//     assert.strictEqual(personsAtEnd.length, helper.initialPersons.length -1)
//   })



// })

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bombom',
      name: 'bom bom',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected username to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })


})

after(async () => {
  await mongoose.connection.close()
})