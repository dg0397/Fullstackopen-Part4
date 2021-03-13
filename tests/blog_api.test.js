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

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('The Next Mission')
})

test('likes property will be 0 by default', async () => {
    const newBlog = {
        title:'The Next Mission',
        author:"Brendan Eich",
        url:'https://brendaneich.com/2014/04/the-next-mission/'
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const [lastBlog] = blogsAtEnd.slice(-1);

        expect(lastBlog.likes).toBe(0)
})

test('if title and/or url are missing backend responds with the status code 400 Bad Request.', async () => {
    const newBlogWithoutTitle = {
        author:"Brendan Eich",
        url:'https://brendaneich.com/2014/04/the-next-mission/',
        likes:15,
    }
    const newBlogWithoutUrl = {
        title:'The Next Mission',
        author:"Brendan Eich",
        likes:15,
    }
    const newBlogWithoutTitleAndUrl = {
        author:"Brendan Eich",
        likes:15,
    }
    //testing a blog wihtout title
    await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)
        .expect('Content-Type',/application\/json/)
    //testing a blog wihtout url
    await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
        .expect('Content-Type',/application\/json/)
    //testing a blog wihtout title and url
    await api
        .post('/api/blogs')
        .send(newBlogWithoutTitleAndUrl)
        .expect(400)
        .expect('Content-Type',/application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})