const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require("./test_helper");

const Blog = require("../models/blog")

const api = supertest(app)


beforeEach(async () => {
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

test('the unique identifier property of the blog posts is named id', async () => {
    const blogsReturned = await helper.blogsInDb()
    const blogToView = blogsReturned[0];
    expect(blogToView.id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title:'The Next Mission',
        author:"Brendan Eich",
        url:'https://brendaneich.com/2014/04/the-next-mission/',
        likes:15,
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain('The Next Mission')
})

afterAll(() => {
    mongoose.connection.close()
})