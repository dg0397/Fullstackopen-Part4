const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes)
  return allLikes.reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes)
  const maxNumberOfLikes = Math.max(...allLikes)
  const blogMostLiked = blogs.find((blog) => blog.likes === maxNumberOfLikes)
  if (blogMostLiked) {
    const { title, author, likes } = blogMostLiked
    return { title, author, likes }
  } else {

  }
}

const mostBlogs = (blogs) => {
  const authorsAndBlogs = blogs.reduce((a, b) => {
    if (a.map((blog) => blog.author).includes(b.author)) {
      const authorWithBlogs = a.find((blog) => blog.author === b.author)
      authorWithBlogs.blogs++
      return a.map((blog) =>
        blog.author === authorWithBlogs.author ? authorWithBlogs : blog
      )
    } else {
      const authorObj = {
        author: b.author,
        blogs: 1
      }
      a.push(authorObj)
      return a
    }
  }, [])
  const allBlogs = authorsAndBlogs.map((author) => author.blogs)
  const maxNumberOfBlogs = Math.max(...allBlogs)
  const authorWithMostBlogs = authorsAndBlogs.find(
    (author) => author.blogs === maxNumberOfBlogs
  )
  if (authorWithMostBlogs) {
    return authorWithMostBlogs
  } else {

  }
}

const mostLikes = (blogs) => {
  const authorsAndLikes = blogs.reduce((a, b) => {
    if (a.map((blog) => blog.author).includes(b.author)) {
      const authorWithLikes = a.find((blog) => blog.author === b.author)
      authorWithLikes.likes = authorWithLikes.likes + b.likes
      return a.map((blog) =>
        blog.author === authorWithLikes.author ? authorWithLikes : blog
      )
    } else {
      const authorObj = {
        author: b.author,
        likes: b.likes
      }
      a.push(authorObj)
      return a
    }
  }, [])
  const allLikes = authorsAndLikes.map((author) => author.likes)
  const maxNumberOfLikes = Math.max(...allLikes)
  const authorWithMostLikes = authorsAndLikes.find(
    (author) => author.likes === maxNumberOfLikes
  )
  if (authorWithMostLikes) {
    return authorWithMostLikes
  } else {

  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
