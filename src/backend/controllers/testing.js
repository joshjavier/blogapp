import { Router } from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const testingRouter = Router()

testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  res.sendStatus(204)
})

export default testingRouter
