const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require("./test_helper");

const Blog = require("../models/blog")

const api = supertest(app)


beforeAll(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsReturned = await helper.blogsInDb();


    expect(blogsReturned).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})