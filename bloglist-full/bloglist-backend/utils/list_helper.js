const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const likes = blogs.map(b => b.likes)
        .reduce(((sum, item) => sum + item), 0);

    return likes;
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const withMostVotes = (best, current) => {
        if (!best) {
            return current;
        }
        return best.likes > current.likes ? best : current;
    }



    return blogs.reduce(withMostVotes, null);
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}