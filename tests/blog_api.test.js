const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsReturned = await helper.blogsInDb()

    expect(blogsReturned).toHaveLength(helper.initialBlogs.length)
  })

  test('all blogs are returned', async () => {
    const blogsReturned = await api.get('/api/blogs')
    expect(blogsReturned.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogsReturned = await helper.blogsInDb()

    const titles = blogsReturned.map(blog => blog.title)

    expect(titles).toContain('React patterns')
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const blogsReturned = await helper.blogsInDb()
    const blogToView = blogsReturned[0]
    expect(blogToView.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'The Next Mission',
      author: 'Brendan Eich',
      url: 'https://brendaneich.com/2014/04/the-next-mission/',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('The Next Mission')
  })

  test('likes property will be 0 by default', async () => {
    const newBlog = {
      title: 'The Next Mission',
      author: 'Brendan Eich',
      url: 'https://brendaneich.com/2014/04/the-next-mission/'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const [lastBlog] = blogsAtEnd.slice(-1)

    expect(lastBlog.likes).toBe(0)
  })

  describe('if title and/or url are missing fails with status code 400 - data invaild.', () => {
    test('testing a blog wihtout title', async () => {
      const newBlogWithoutTitle = {
        author: 'Brendan Eich',
        url: 'https://brendaneich.com/2014/04/the-next-mission/',
        likes: 15
      }

      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('testing a blog wihtout url', async () => {
      const newBlogWithoutUrl = {
        title: 'The Next Mission',
        author: 'Brendan Eich',
        likes: 15
      }
      await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('testing a blog wihtout title and url', async () => {
      const newBlogWithoutTitleAndUrl = {
        author: 'Brendan Eich',
        likes: 15
      }
      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitleAndUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 malformatted id', async () => {
    const invalidId = 'a123pi9'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const returnedBlog = await api.get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(returnedBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 400 malformatted id', async () => {
    const invalidId = 'a123pi9'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
})

describe('updating the information of an individual blog post', () => {
  test('succeeds with a valid id and data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: 678 }

    const returnedBlog = await api.put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToUpdate = JSON.parse(JSON.stringify(updatedBlog))

    expect(returnedBlog.body).toEqual(processedBlogToUpdate)
  })
  test('fails with statuscode 400 malformatted id', async () => {
    const invalidId = 'a123pi9'
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: 678 }

    await api.put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    const blogToViewAtEnd = blogsAtEnd[0]

    expect(blogToViewAtEnd).toEqual(blogToUpdate)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    console.log(validNonexistingId)
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: 678 }

    await api.put(`/api/blogs/${validNonexistingId}`)
      .send(updatedBlog)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    const blogToViewAtEnd = blogsAtEnd[0]

    expect(blogToViewAtEnd).toEqual(blogToUpdate)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
