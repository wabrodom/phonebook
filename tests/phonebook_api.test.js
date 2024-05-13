const { test, after, beforeEach, expect } = require('node:test')
const assert  = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/phonebook')

const api = supertest(app)


beforeEach(async () => {
  await Person.deleteMany({})

  for (let p of helper.initialPersons) {
    let personObject =  new Person(p)
    await personObject.save()

  }
})


test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
  const response = await api.get('/api/persons')

  assert.strictEqual(response.body.length, 2)
})

test('the first person is Joshua', async () => {
  const response = await api.get('/api/persons')

  const contents = response.body.map(e => e.name)
  assert(contents.includes('Joshua'))
})

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

test('a person can be viewed', async () => {
  const personsAtStart = await helper.personsInDb()

  const personToView = personsAtStart[0]


  const resultNote = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, personToView)
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

test('return personObject have .id instead of _id', async () => {
  const response = await api.get('/api/persons')
  const firstPerson = response.body[0]

  assert.strictEqual(firstPerson._id, undefined)
  assert.strictEqual(typeof firstPerson.id, 'string')
})

after(async () => {
  await mongoose.connection.close()
})