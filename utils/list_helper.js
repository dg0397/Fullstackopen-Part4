const dummy = (blogs) => {
  // ...
  return 1
};

const totalLikes = (blogs) => {
    const allLikes = blogs.map(blog => blog.likes);
    return allLikes.reduce((a,b) => a+b,0)
}

module.exports = {
  dummy,
  totalLikes
};
