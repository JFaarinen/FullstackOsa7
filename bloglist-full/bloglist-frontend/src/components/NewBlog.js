import React, { useState, useRef } from 'react';
import Togglable from '../components/Togglable';
import { useDispatch } from 'react-redux';
import { newBlog } from '../reducers/blogReducer';
import { newMessage } from '../reducers/messageReducer';
import { Button } from '@material-ui/core';

const NewBlog = () => {
    const newBlogRef = useRef();
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    }

    const addBlog = async (event) => {
        event.preventDefault();
        const blogObject = {
            title: event.target.title.value,
            author: event.target.author.value,
            url: event.target.url.value
        }
        console.log('BLOG to add:', blogObject);
        newBlogRef.current.toggleVisibility();
        dispatch(newBlog(blogObject));
        dispatch(newMessage(`a new blog '${blogObject.title}' by '${blogObject.author}' added.`, 5));
        setTitle('');
        setAuthor('');
        setUrl('');
    }

    return (
        <div>
            <h2>Create new blog</h2>
            <Togglable buttonLabel='Add new' ref={newBlogRef}>
                <form onSubmit={addBlog}>
                    <div>
                        Title: <input
                            id='titlefield'
                            type='text'
                            value={title}
                            name='title'
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div>
                        Author: <input
                            id='authorfield'
                            type='text'
                            value={author}
                            name='author'
                            onChange={handleAuthorChange}
                        />
                    </div>
                    <div>
                        Url: <input
                            id='urlfield'
                            type='text'
                            value={url}
                            name='url'
                            onChange={handleUrlChange}
                        />
                    </div>
                    <div><Button
                        name='Create'
                        variant="outlined"
                        color="primary"
                        id="createBlog"
                        type='submit'
                    >Create</Button>
                    </div>
                </form>
            </Togglable>
        </div>
    )
};

export default NewBlog;