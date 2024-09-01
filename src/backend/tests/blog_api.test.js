import { after, beforeEach, describe, it } from 'node:test'
import assert, { strictEqual } from 'node:assert/strict'
import { hash } from 'bcrypt'
import request from 'supertest'
import app from '../app.js'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import * as helper from './test_helper.js'

const api = request(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // add initial user
  const passwordHash = await hash('root', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // add initial data
  const blogs = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user.id }))
  await Blog.insertMany(blogs)
  user.blogs = user.blogs.concat(blogs.map(blog => blog.id))
  await user.save()
})

describe('GET /api/blogs', () => {
  it('returns the correct number of blog posts in JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    strictEqual(response.body.length, helper.initialBlogs.length)
  })

  it('each blog post has an `id` prop', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert(blogs.every(blog => 'id' in blog))
  })

  it('each blog post has a `user` prop', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert(blogs.every(blog => 'user' in blog))
  })
})

describe('POST /api/blogs', () => {
  const testBlog = {
    title: 'Untitled',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 99,
  }

  beforeEach(async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)

    token = response.body.token
  })

  it('returns the created blog in JSON', async () => {
    const response = await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const createdBlog = response.body
    strictEqual(createdBlog.author, 'John Doe')
    strictEqual(createdBlog.title, 'Untitled')
    strictEqual(createdBlog.likes, 99)
    assert('id' in createdBlog)
    assert('user' in createdBlog)
  })

  it('increases the number of blog posts by one', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api.post('/api/blogs').auth(token, { type: 'bearer' }).send(testBlog)
    const blogsAtEnd = await helper.blogsInDb()
    strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })

  it('`likes` prop defaults to 0 if missing from request body', async () => {
    const testBlogNoLikes = {
      title: 'This blog post has no likes',
      author: 'John Doe',
      url: 'https://example.com',
    }

    const response = await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(testBlogNoLikes)
      .expect(201)

    const createdBlog = response.body
    strictEqual(createdBlog.likes, 0)
  })

  it('responds with 400 Bad Request when `title` prop is missing', async () => {
    const blogWithoutTitle = { author: 'author', url: 'url' }
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithoutTitle)
      .expect(400)
  })

  it('responds with 400 Bad Request when `url` prop is missing', async () => {
    const blogWithoutURL = { title: 'title', author: 'author' }
    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blogWithoutURL)
      .expect(400)
  })

  it('fails if a token is invalid or not provided', async () => {
    // missing token
    await api.post('/api/blogs').send(testBlog).expect(401)
    // invalid token
    await api.post('/api/blogs').auth(null, { type: 'bearer' }).send(testBlog).expect(401)
  })
})

describe('DELETE /api/blogs/:id', () => {
  beforeEach(async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)

    token = response.body.token

    const blog = {
      title: 'Marginalia: 3 Years',
      author: 'Viktor Lofgren',
      url: 'https://www.marginalia.nu/log/a_101_marginalia-3-years/',
      likes: 107,
    }

    await api.post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blog)
      .expect(201)
  })

  it('returns 204 No Content', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[blogsAtStart.length - 1].id

    await api.delete(`/api/blogs/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })

  it('reduces the number of blog posts by one', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[blogsAtStart.length - 1].id

    await api.delete(`/api/blogs/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  it("fails if blog isn't created by the authenticated user", async () => {
    // create a new user
    const passwordHash = await hash('newuser', 10)
    const newuser = new User({ username: 'newuser', passwordHash })
    await newuser.save()

    // login with the new user
    const login = await api.post('/api/login').send({ username: 'newuser', password: 'newuser' })
    token = login.body.token

    // try deleting the blog post made by root user
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[blogsAtStart.length - 1].id

    await api.delete(`/api/blogs/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('PUT /api/blogs/:id', () => {
  beforeEach(async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)

    token = response.body.token

    const blog = {
      title: 'Write Dumb Code',
      author: 'Matthew Rocklin',
      url: 'https://matthewrocklin.com/write-dumb-code.html',
    }
    await api.post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(blog)
      .expect(201)
  })

  const updatedBlog = {
    title: 'Write Dumb Code',
    author: 'Matthew Rocklin',
    url: 'https://matthewrocklin.com/write-dumb-code.html',
    likes: 49,
  }

  it('returns 200 OK with the updated blog in JSON', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]
    const id = blogToUpdate.id
    const user = await User.findOne()

    await api
      .put(`/api/blogs/${id}`)
      .auth(token, { type: 'bearer' })
      .send({ ...updatedBlog, user: user.id })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('does not increase the number of blog posts', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[blogsAtStart.length - 1].id
    const user = await User.findOne()

    await api.put(`/api/blogs/${id}`)
      .auth(token, { type: 'bearer' })
      .send({ ...updatedBlog, user: user.id })

    const blogsAtEnd = await helper.blogsInDb()
    strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
