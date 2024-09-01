const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const user = req.user

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id,
    })

    const createdBlog = await blog.save()
    user.blogs = user.blogs.concat(createdBlog.id)
    await user.save()

    res.status(201).json(await createdBlog.populate('user', '-blogs'))
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const user = req.user
    const blog = await Blog.findById(id)
    if (blog.user.toString() !== user.id) {
      return res.status(403).json({ error: "you can't delete notes you didn't create" })
    }
    await blog.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body
  const blog = {
    title,
    author,
    url,
    likes: likes || 0
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      blog,
      { new: true, runValidators: true },
    )
    res.json(await updatedBlog.populate('user', '-blogs'))
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
