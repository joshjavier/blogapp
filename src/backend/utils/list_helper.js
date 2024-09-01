import { transform, countBy, maxBy, groupBy } from 'lodash'

export const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  if (blogs.length === 1) return blogs[0].likes

  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

export const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs
      .toSorted((a, b) => b.likes - a.likes)
      .map(({ title, author, likes }) => ({ title, author, likes }))[0]
}

export const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorBlogs = transform(
    countBy(blogs, 'author'),
    (result, blogs, author) => {
      result.push({ author, blogs })
    }, [])

  return maxBy(authorBlogs, 'blogs')
}

export const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = transform(
    groupBy(blogs, 'author'),
    (result, blogs, author) => {
      const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
      result.push({ author, likes })
    }, [])

  return maxBy(authorLikes, 'likes')
}
