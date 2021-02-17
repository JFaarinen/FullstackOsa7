import React, { useState, useEffect, useRef } from 'react';
import Button from './components/Button';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import Message from './components/Message';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState();

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, []);

    // Kirjautuneen käyttäjän noutaminen localStoragesta
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    // ref viittaus toisesta komponentista
    const newBlogRef = useRef();

    //Kirjautumisen käsittelijä
    const loginHandler = async (event) => {
        event.preventDefault();
        console.log('Logging in with ', username, password);

        try {
            const loggingUser = await loginService.login({
                username, password
            });
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(loggingUser)
            );
            setUser(loggingUser);
            blogService.setToken(loggingUser.token);
            showMessage(`User '${loggingUser.name}' logged in.`);
            setUsername('');
            setPassword('');
        } catch (exception) {
            showMessage('wrong username/password', 'error');
        }
    }

    const showMessage = (message, type = 'message') => {
        setMessage({ message, type });
        setTimeout(() => {
            setMessage(null)
        }, 5000);
    }

    const logoffHandler = async (event) => {
        event.preventDefault();
        console.log('logging out...');
        window.localStorage.removeItem('loggedUser');
        setUser(null);
    }

    const addBlog = async (blogObject) => {
        const newBlog = await blogService.addNew(blogObject);
        newBlogRef.current.toggleVisibility();
        setBlogs(blogs.concat(newBlog));
        showMessage(`a new blog '${blogObject.title}' by '${blogObject.author}' added.`);
    }

    const likeBlog = async (id) => {
        const blogToLike = blogs.find(blog => blog.id === id);
        const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1, user: blogToLike.user.id }
        await blogService.like(id, likedBlog);
        setBlogs(blogs.map(blog => blog.id === id ? { ...blogToLike, likes: blogToLike.likes + 1 } : blog));
    }

    const removeBlog = async (id) => {
        const blogToRemove = blogs.find(blog => blog.id === id);
        const ok = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
        if (ok) {
            await blogService.remove(id);
            setBlogs(blogs.filter(blog => blog.id !== id));
            showMessage('blog is removed');
        }
    }

    return (
        <div>
            <h1>Bloglist Application</h1>
            <Message message={message} />
            {user === null ?
                <Togglable buttonLabel='Login'>
                    <LoginForm
                        loginHandler={loginHandler}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                    />
                </Togglable>
                : <div>
                    <p>{user.name} is logged in.
          <Button name='Log off' handler={logoffHandler} />
                    </p>
                    <Togglable buttonLabel='Add new' ref={newBlogRef}>
                        <NewBlog
                            createBlog={addBlog}
                        />
                    </Togglable>
                    <h2>blogs</h2>
                    {blogs.sort((b1, b2) => b2.likes - b1.likes).map(blog =>
                        <Blog
                            key={blog.id}
                            blog={blog}
                            handleLike={() => likeBlog(blog.id)}
                            handleRemove={() => removeBlog(blog.id)}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default App