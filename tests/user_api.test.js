const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const api = supertest(app)

// beforeEach(async () => {
//  await User.deleteMany({})
//  await User.insertMany(helper.initialBlogs)
// })

describe('addding a user when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('success with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dg0397',
      name: 'Dionisio Gonzalez',
      password: '123456789'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('fails - username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'master',
      password: 'secret'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error missing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'ezio',
      password: 'eden'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error missing password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'masterEzio',
      name: 'ezio'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error missing both password and username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'ezio'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error - password must be at least 3 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dg0397',
      name: 'Dionisio Gonzalez',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error - username must be at least 3 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dg',
      name: 'Dionisio Gonzalez',
      password: '1245'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails - validation error - username and password must be at least 3 characters length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dg',
      name: 'Dionisio Gonzalez',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
