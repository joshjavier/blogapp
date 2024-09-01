const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  const { username, password, name } = req.body

  if (!password) {
    return res.status(400).json({ error: 'password is required' })
  } else if (password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ username, passwordHash, name })

  try {
    const createdUser = await user.save()
    res.status(201).json(createdUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', '-user')
  res.json(users)
})

usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.sendStatus(204)
})

module.exports = usersRouter
