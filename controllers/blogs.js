const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const blogDeleted = await Blog.findByIdAndRemove(id)
  if (blogDeleted) {
    logger.info(blogDeleted)
    response.status(204).end()
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
