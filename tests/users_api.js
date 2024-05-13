const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)



after(async () => {
  await mongoose.connection.close()
})