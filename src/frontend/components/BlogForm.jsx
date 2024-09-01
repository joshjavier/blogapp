import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onCreate = async (event) => {
    event.preventDefault()

    const newBlog = await createBlog({ title, author, url })

    if (newBlog) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <form onSubmit={onCreate}>
      <h2>create new</h2>
      <div>
        <label htmlFor="input-title">title:</label>
        {' '}
        <input
          type="text"
          id="input-title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="input-author">author:</label>
        {' '}
        <input
          type="text"
          id="input-author"
          name="author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="input-url">url:</label>
        {' '}
        <input
          type="text"
          id="input-url"
          name="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
