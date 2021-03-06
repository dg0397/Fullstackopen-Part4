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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
