const listHelper = require('../utils/list_helper');
const listOfBlogs = require('./blogs');

describe('dummy test', () => {
    test('dummy returns one', () => {
        const blogs = [];

        const result = listHelper.dummy(blogs);
        expect(result).toBe(1);
    });
});

describe('total likes', () => {
    const listWithOneBlog = [{
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }];

    test('when given empty list, returns 0', () => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    });

    test('when list has several blogs, returns the sum of likes', () => {
        const result = listHelper.totalLikes(listOfBlogs);
        expect(result).toBe(36);
    });

});

describe('favorite blog', () => {
    const listWithOneBlog = [{
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }];
    test('with empty list results null', () => {
        const result = listHelper.favoriteBlog([]);
        expect(result).toEqual(null);
    });

    test('when given list with one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog);
        expect(result).toEqual(listWithOneBlog[0]);
    });

    test('when given list with several blogs, returns the one with most likes', () => {
        const result = listHelper.favoriteBlog(listOfBlogs);
        console.log(result);
        expect(result).toEqual(listOfBlogs[2]);
    });
});



