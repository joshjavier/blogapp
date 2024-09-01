const _ = require('lodash')

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  if (blogs.length === 1) return blogs[0].likes

  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs
      .toSorted((a, b) => b.likes - a.likes)
      .map(({ title, author, likes }) => ({ title, author, likes }))[0]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorBlogs = _.transform(
    _.countBy(blogs, 'author'),
    (result, blogs, author) => {
      result.push({ author, blogs })
    }, [])

  return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = _.transform(
    _.groupBy(blogs, 'author'),
    (result, blogs, author) => {
      const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
      result.push({ author, likes })
    }, [])

  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
