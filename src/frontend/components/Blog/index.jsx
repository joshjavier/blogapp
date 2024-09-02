import { useState } from 'react'
import './style.css'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const onLike = () => likeBlog(blog)

  const onRemove = () => {
    const proceed = confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (proceed) {
      removeBlog(blog.id)
    }
  }

  const isCreatedByCurrentUser = blog.user && blog.user.username === user.username

  return (
    <div className="blog">
      {blog.title}
      {' '}
      {blog.author}
      {' '}
      <button
        onClick={() => setVisible(!visible)}
        aria-expanded={visible}
        aria-controls="blog-details"
      >
        {visible ? 'hide' : 'show'}
      </button>
      <div id="blog-details" style={{ display: visible ? '' : 'none' }}>
        <ul>
          <li>{blog.url}</li>
          <li>
            likes
            {' '}
            {blog.likes}
            {' '}
            <button onClick={onLike}>like</button>
          </li>
          <li>{blog.user && blog.user.name}</li>

          {isCreatedByCurrentUser && (
            <button onClick={onRemove} className="delete">
              remove
            </button>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Blog
