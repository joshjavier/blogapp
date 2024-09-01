import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    padding: 10,
    border: '1px solid',
    marginBottom: 5,
  }

  const deleteBtnStyle = {
    background: 'red',
    color: 'white',
    fontWeight: 700,
    borderRadius: 4,
    border: '1px solid red',
  }

  const onLike = () => likeBlog(blog)

  const onRemove = () => {
    const proceed = confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (proceed) {
      removeBlog(blog.id)
    }
  }

  const isCreatedByCurrentUser = blog.user && blog.user.username === user.username

  return (
    <div className="blog" style={blogStyle}>
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
            <button onClick={onRemove} style={deleteBtnStyle}>
              remove
            </button>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Blog
