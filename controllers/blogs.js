const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blogToDelete = await Blog.findById(id)
  if (blogToDelete) {
    if (blogToDelete.user.toString() === decodedToken.id) {
      const blogDeleted = await Blog.findByIdAndRemove(id)
      logger.info(blogDeleted)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'unauthorized action - token invalid' })
    }
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const blogReturned = await Blog.findById(id)
  if (blogReturned) {
    logger.info(blogReturned.toJSON())
    response.json(blogReturned.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    likes: request.body.likes
  }

  const blogReturned = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (blogReturned) {
    logger.info(blogReturned.toJSON())
    response.json(blogReturned)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
