import { after, beforeEach, describe, it } from 'node:test'
import assert, { strictEqual } from 'node:assert/strict'
import mongoose from 'mongoose'
import { hash } from 'bcrypt'
import request from 'supertest'
import app from '../app.js'
import User from '../models/user.js'

const api = request(app)

describe('logging in', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await hash('root', 10)
    const user = new User({ username: 'root', passwordHash, name: 'Walter White' })
    await user.save()
  })

  it('returns the token with status code 200 if successful', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert('token' in response.body)
    strictEqual(response.body.username, 'root')
    strictEqual(response.body.name, 'Walter White')
  })

  it('fails when username or password is missing', async () => {
    const resUsernameOnly = await api.post('/api/login').send({ username: 'root' }).expect(401)
    const resPasswordOnly = await api.post('/api/login').send({ password: 'root' }).expect(401)

    assert(resUsernameOnly.body.error.includes('invalid'))
    assert(resPasswordOnly.body.error.includes('invalid'))
  })

  it('fails when password is wrong', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'fruit' })
      .expect(401)

    assert(response.body.error.includes('invalid'))
  })

  it("fails when user doesn't exist in db", async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'walterwhite', password: 'bluesky' })
      .expect(401)

    assert(response.body.error.includes('invalid'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
