const { test, after, beforeEach, describe } = require('node:test')
const assert  = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const bcrypt = require('bcrypt')
const User = require('../models/user')
const Person = require('../models/person')

const api = supertest(app)

describe('when there is one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('somePassword', 10)
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash
    })

    await user.save()

  })

  test('creation succeed with new username' , async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bombom',
      name: 'bombom',
      password: 'salainen',
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length +1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('bombom'))
  })

  test('POST request to add user that invalid form will get 400 Bad request', async () => {
    const usersAtStart = await helper.usersInDb()

    const usernameShort = {
      username: 'bo',
      name: 'bombom',
      password: '123',
    }

    const passwordShort = {
      username: 'bom',
      name: 'bombom',
      password: '12',
    }

    await api.post('/api/users')
      .send(usernameShort)
      .expect(400)

    await api.post('/api/users')
      .send(passwordShort)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

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


  test.only('no token or null in authorization header will get 401' , async() => {
    const newPerson = {
      'name': 'bomsama',
      'number': '011-12345678',
    }

    await api.post('/api/persons')
      .send(newPerson)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test.only('user with valid token in header can POST 200', async () => {

    const userObjectWithToken = await api
      .post('/api/login')
      .send(userLoginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newPerson = {
      'name': 'jojo',
      'number': '088-12345678',
    }

    const authorizationStr =  'bearer ' + userObjectWithToken.body.token

    await api.post('/api/persons')
      .set({ Authorization: authorizationStr })
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    const names = personsAtEnd.map(b => b.name)
    assert(names.includes('jojo'))
  })

  test.only('only user who create personIfo will delete the peronsInfo', async() => {

    const userObjectWithToken = await api
      .post('/api/login')
      .send(userLoginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token =  'bearer ' + userObjectWithToken.body.token
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
    console.log('names arr', names)

    assert.strictEqual(personsAfterDelete.length, blogsAfterAddOne.length - 1)
    // assert.strictEqual(names.includes(newPerson.name), false)

  })

})


after(async () => {
  await mongoose.connection.close()
})