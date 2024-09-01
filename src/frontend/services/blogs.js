import axios from 'axios'
const baseURL = '/api/blogs'

let token

const setToken = (newToken) => {
  token = newToken
}

const getAll = async () => {
  const response = await axios.get(baseURL)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.post(baseURL, newBlog, config)
  return response.data
}

const like = async (blog) => {
  const response = await axios.put(`${baseURL}/${blog.id}`, {
    ...blog,
    likes: blog.likes + 1,
  })
  return response.data
}

const remove = (id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.delete(`${baseURL}/${id}`, config)
}

export default {
  getAll,
  create,
  like,
  remove,
  setToken,
}
