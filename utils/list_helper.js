const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes);
  return allLikes.reduce((a, b) => a + b, 0);
};

const favoriteBlog = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes);
  const maxNumberOfLikes = Math.max(...allLikes);
  const blogMostLiked = blogs.find((blog) => blog.likes === maxNumberOfLikes);
  if (blogMostLiked) {
    const { title, author, likes } = blogMostLiked;
    return { title, author, likes };
  } else {
    return;
  }
};

const mostBlogs = (blogs) => {
  const authorsAndBlogs = blogs.reduce((a, b) => {
    if (a.map((blog) => blog["author"]).includes(b.author)) {
      const authorWithBlogs = a.find((blog) => blog.author === b.author);
      authorWithBlogs.blogs++;
      return a.map((blog) =>
        blog.author === authorWithBlogs.author ? authorWithBlogs : blog
      );
    } else {
      const authorObj = {
        author: b.author,
        blogs: 1,
      };
      a.push(authorObj);
      return a;
    }
  }, []);
  const allBlogs = authorsAndBlogs.map((author) => author.blogs);
  const maxNumberOfBlogs = Math.max(...allBlogs);
  const authorWithMostBlogs = authorsAndBlogs.find(
    (author) => author.blogs === maxNumberOfBlogs
  );
  if (authorWithMostBlogs) {
    return authorWithMostBlogs;
  } else {
    return;
  }
};

const mostLikes = (blogs) => {
  const authorsAndLikes = blogs.reduce((a, b) => {
    if (a.map((blog) => blog["author"]).includes(b.author)) {
      const authorWithLikes = a.find((blog) => blog.author === b.author);
      authorWithLikes.likes = authorWithLikes.likes + b.likes ;
      return a.map((blog) =>
        blog.author === authorWithLikes.author ? authorWithLikes : blog
      );
    } else {
      const authorObj = {
        author: b.author,
        likes: b.likes,
      };
      a.push(authorObj);
      return a;
    }
  }, []);
  const allLikes = authorsAndLikes.map((author) => author.likes);
  const maxNumberOfLikes = Math.max(...allLikes);
  const authorWithMostLikes = authorsAndLikes.find(
    (author) => author.likes === maxNumberOfLikes
  );
  if (authorWithMostLikes) {
    return authorWithMostLikes;
  } else {
    return;
  }
}

const blogs = [ 
  { 
      _id: "5a422a851b54a676234d17f7", 
      title: "React patterns", 
      author: "Michael Chan", 
      url: "https://reactpatterns.com/", 
      likes: 7, 
      __v: 0 
  }, 
  { 
      _id: "5a422aa71b54a676234d17f8", 
      title: "Go To Statement Considered Harmful", 
      author: "Edsger W. Dijkstra", 
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
      likes: 5,
       __v: 0 
  }, 
  { 
      _id: "5a422b3a1b54a676234d17f9", 
      title: "Canonical string reduction", 
      author: "Edsger W. Dijkstra", 
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
      likes: 12, 
      __v: 0 
  }, 
  { 
      _id: "5a422b891b54a676234d17fa", 
      title: "First class tests", 
      author: "Robert C. Martin", 
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", 
      likes: 10, 
      __v: 0 
  }, 
  { 
      _id: "5a422ba71b54a676234d17fb", 
      title: "TDD harms architecture", 
      author: "Robert C. Martin", 
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
      likes: 0, 
      __v: 0 
  }, { 
      _id: "5a422bc61b54a676234d17fc", 
      title: "Type wars", 
      author: "Robert C. Martin", 
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
      likes: 2, 
      __v: 0 
  }
]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
