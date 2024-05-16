const { test, after, beforeEach, describe } = require('node:test')
const assert  = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/person')
const User = require('../models/user')

const bcrypt = require('bcrypt')

const api = supertest(app)


describe('GET request: only the login user will...', () => {

  const userLoginInfo = {
    username: 'root',
    password: 'somePassword'
  }

  const otherUserLoginInfo = {
    username: 'otherUser',
    password: 'somePassword'
  }

  const mockOtherPersonList = [
    {
      'name': 'bobo',
      'number': '088-12345678',
    },
    {
      'name': 'dodo',
      'number': '088-12345678',
    }
  ]

  beforeEach( async () => {
    await User.deleteMany({})
    await Person.deleteMany({})

    const passwordHash = await bcrypt.hash('somePassword', 10)
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash
    })

    const otherUser = new User({
      username: 'otherUser',
      name: 'otherUser',
      passwordHash
    })
    await user.save()
    await otherUser.save()

    // initialize data in otherUser phonebook,
    // and make sure the main user for test cant access it
    const authorizationStr = await helper.loginGetAuthorizationStr(otherUserLoginInfo)
    const authorization = { Authorization : authorizationStr }


    for (let data of mockOtherPersonList) {
      await api
        .post('/api/persons')
        .set(authorization)
        .send(data)
    }
  })


  test('current user can view their own phonebook list', async () => {
    const authorizationStr = await helper.loginGetAuthorizationStr(userLoginInfo)
    const authorization = { Authorization : authorizationStr }

    const newPerson = {
      'name': 'jojo',
      'number': '088-12345678',
    }

    await api
      .post('/api/persons')
      .set(authorization)
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/persons')
      .set(authorization)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const responseCountDocument  = await api.get('/api/persons/info')
      .expect(200)

    const returnedPersons = response.body
    const textCountDocument = responseCountDocument.text


    assert.strictEqual(textCountDocument.search(/3 people/) > 0, true)
    assert.strictEqual(returnedPersons.length, 1)
  })

  test('the user can view a specific person on their list', async () => {
    // otherUser can view their specific phonebook list person info
    const authorizationStr = await helper.loginGetAuthorizationStr(otherUserLoginInfo)
    const authorization = { Authorization : authorizationStr }

    // grab all persons in phonebook
    const response = await api.get('/api/persons')
      .set(authorization)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returnedPersons = response.body

    // grab 1st person id, and send request on that id
    // make sure it return 1st person
    const firstPersonId = returnedPersons[0].id

    const responseForFirstPerson = await api
      .get(`/api/persons/${firstPersonId}`)
      .set(authorization)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstPersonName = responseForFirstPerson.body.name
    assert.strictEqual(firstPersonName, mockOtherPersonList[0].name)
  })


  test('return personObject have .id instead of _id', async () => {
    const authorizationStr = await helper.loginGetAuthorizationStr(otherUserLoginInfo)
    const authorization = { Authorization : authorizationStr }

    // grab all persons in otherUser phonebook
    const response = await api.get('/api/persons')
      .set(authorization)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // grab 1st person object and check
    const firstPerson = response.body[0]

    assert.strictEqual(firstPerson._id, undefined)
    assert.strictEqual(typeof firstPerson.id, 'string')
  })
})

describe.only('when user have valid token or invalid token', () => {
  beforeEach( async () => {
    await User.deleteMany({})
    await Person.deleteMany({})

    const passwordHash = await bcrypt.hash('somePassword', 10)
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash
    })

    await user.save()
  })

  const userLoginInfo = {
    username: 'root',
    password: 'somePassword'
  }


  test('no token or null in authorization header will get 401' , async() => {
    const newPerson = {
      'name': 'bomsama',
      'number': '011-12345678',
    }

    await api.post('/api/persons')
      .send(newPerson)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('user with valid token in header can POST 200', async () => {

    const authorizationStr = await helper.loginGetAuthorizationStr(userLoginInfo)

    const newPerson = {
      'name': 'jojo',
      'number': '088-12345678',
    }


    await api.post('/api/persons')
      .set({ Authorization: authorizationStr })
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    const names = personsAtEnd.map(b => b.name)
    assert(names.includes('jojo'))
  })

  test('only user who create personIfo will delete the peronsInfo', async() => {
    const token = await helper.loginGetAuthorizationStr(userLoginInfo)
    const authorization = { Authorization : token }

    const newPerson = {
      'name': 'jojo',
      'number': '088-12345678',
    }

    const response = await api
      .post('/api/persons')
      .set(authorization)
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddOne = await helper.personsInDb()

    const returnedPerson = response.body

    await api
      .delete(`/api/persons/${returnedPerson.id.toString()}`)
      .set(authorization)
      .expect(204)

    const personsAfterDelete = await helper.personsInDb()
    const names = personsAfterDelete.map(p => p.name)


    assert.strictEqual(personsAfterDelete.length, blogsAfterAddOne.length - 1)
    assert.strictEqual(names.includes(newPerson.name), false)

  })

  test.only('can update the document object by created user', async () => {
    const token = await helper.loginGetAuthorizationStr(userLoginInfo)
    const authorization = { Authorization : token }

    const newPerson = {
      'name': 'jojo',
      'number': '088-12345678',
      'note': 'last talk about lat strength, and his backpain'
    }
    // post new person to they list
    const response = await api
      .post('/api/persons')
      .set(authorization)
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const returnedPerson = response.body

    const modifiedObject = {
      'name': 'Jonathan',
      'number': '088-12345678',
    }

    const modifiedVersion = await api
      .put(`/api/persons/${returnedPerson.id.toString()}`)
      .set(authorization)
      .send(modifiedObject)
      .expect(200)

    const personsAfterUpdated = modifiedVersion.body
    // console.log('before', newPerson)
    // console.log('after', personsAfterUpdated)
    assert.strictEqual(personsAfterUpdated.name, modifiedObject.name)
    assert.strictEqual(personsAfterUpdated.note, newPerson.note)
  })

})

after(async () => {
  await mongoose.connection.close()
})



/*
// old test: Have no user authentication.
// so everyone can view all persons on root

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


describe('operation on personObject', () => {
  test('a valid person can be added ', async () => {
    const newPerson = {
      name: 'Vitamin',
      number: '011-12345678',
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

    const names = personsAtEnd.map(p => p.name)
    assert(names.includes('Vitamin'))
  })

  test('person without phone number is not added', async () => {
    const newPerson = {
      name: 'VitaminD',
      number: '',
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(400)

    const personsAtEnd = await helper.personsInDb()

    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
  })


  test('a person can be deleted', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]


    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .expect(204)

    const personsAtEnd = await helper.personsInDb()
    const names = personsAtEnd.map(p => p.name)
    assert(!names.includes(personToDelete.name))


    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length -1)
  })



})

*/