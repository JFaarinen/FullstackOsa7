import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog> Component testing', () => {
    let component;

    const blog = {
        title: 'Testblog',
        author: 'Test Author',
        url: 'http://www.testblog.com',
        likes: 10,
        user: {
            username: 'testuser',
            name: 'Blog User'
        }
    }

    beforeEach(() => {
        component = render(
            <Blog blog={blog} />
        );
    });


    test('renders  title and author', () => {
        expect(component.container).toHaveTextContent('Testblog');
        expect(component.container).toHaveTextContent('Test Author');
        expect(component.container.querySelector('.details')).toHaveStyle('display: none');
    });

    test('renders url and number of likes after \'View\' button is clicked', () => {
        const button = component.getByText('View');
        fireEvent.click(button);
        expect(component.container.querySelector('.details')).not.toHaveStyle('display: none');
        expect(component.container).toHaveTextContent('http://www.testblog.com');
        expect(component.container).toHaveTextContent('Likes: 10');
    });

});

describe('<Blog> button testing', () => {
    test('if \'Like\' -button is pressed twice, handler is called two times', () => {
        const blog = {
            title: 'Testblog',
            author: 'Test Author',
            url: 'http://www.testblog.com',
            likes: 10,
            user: {
                username: 'testuser',
                name: 'Blog User'
            }
        }

        const mockHandler = jest.fn();
        const likedBlog = render(<Blog blog={blog} handleLike={mockHandler} />);

        const button = likedBlog.getByText('Like');
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockHandler.mock.calls).toHaveLength(2);
    });
});


