const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    const match = !user || !password
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!match) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    const payload = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' })

    res.json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
