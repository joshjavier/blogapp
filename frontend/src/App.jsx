import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef(null)

  let timeoutId

  const clearAlert = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll()
      .then((blogs) => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(blogs)
      })
      .catch((error) => {
        if (error.response.status === 500) {
          console.log('cannot connect to the server')
        }
      })
  }, [])

  useEffect(() => {
    const userJSON = localStorage.getItem('bloglistUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const onChange = (event) => {
    switch (event.target.name) {
      case 'username':
        setUsername(event.target.value)
        break
      case 'password':
        setPassword(event.target.value)
        break
    }
  }

  const onLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage({ body: error.response.data.error })
      clearAlert()
    }
  }

  const onLogout = () => {
    localStorage.removeItem('bloglistUser')
    setUser(null)
    blogService.setToken(null)
    setErrorMessage({
      success: true,
      body: 'you\'ve been logged out',
    })
    clearAlert()
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      blogFormRef.current.toggleVisibility()

      setErrorMessage({
        success: true,
        body: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      })
      clearAlert()

      return newBlog
    } catch (error) {
      setErrorMessage({ body: error.response.data.error })
      clearAlert()
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.like(blog)
      setBlogs(blogs.map(blog => (
        blog.id === updatedBlog.id
          ? updatedBlog
          : blog
      )))
    } catch (error) {
      setErrorMessage({ body: error.response.data.error })
      clearAlert()
    }
  }

  const removeBlog = async (id) => {
    try {
      const response = await blogService.remove(id)
      if (response.status === 204) {
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    } catch (error) {
      setErrorMessage({ body: error.response.data.error })
      clearAlert()
    }
  }

  return user ? (
    <div>
      <h2>blogs</h2>

      <Notification errorMessage={errorMessage} />

      <p>
        {user.name}
        {' '}
        logged in
        {' '}
        <button onClick={onLogout}>log out</button>
      </p>

      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Toggleable>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  ) : (
    <div>
      <h2>log in to application</h2>

      <Notification errorMessage={errorMessage} />

      <LoginForm
        onSubmit={onLogin}
        onChange={onChange}
        username={username}
        password={password}
      />
    </div>
  )
}

export default App
