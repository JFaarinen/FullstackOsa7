import React, { useEffect } from 'react';
import UserList from './components/UserList';
import User from './components/User';
import Home from './components/Home';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';
import LoginForm from './components/LoginForm';
import Message from './components/Message';
import blogService from './services/blogs';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/userDataReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logoff } from './reducers/userReducer';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { Container, Button } from '@material-ui/core';

const App = () => {
  const dispatch = useDispatch();
  const logged = useSelector(state => state.user);
  const users = useSelector(state => state.userdata);
  const blogs = useSelector(state => state.blogs);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  const matchUser = useRouteMatch('/users/:id');
  const matchBlog = useRouteMatch('/blogs/:id');
  const user = matchUser ? users.find(user => user.id === String(matchUser.params.id)) : null;
  const blog = matchBlog ? blogs.find(blog => blog.id === String(matchBlog.params.id)) : null;

  // Kirjautuneen käyttäjän noutaminen localStoragesta
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    console.log('OLD USER: ', loggedUserJSON);

    if (loggedUserJSON !== null) {
      console.log('what the fuck is this?');
      const oldUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(oldUser));
      blogService.setToken(oldUser.token);
    }
  }, [dispatch]);

  // ref viittaus toisesta komponentista
  // const newBlogRef = useRef();

  //Uloskirjautumisen käsittelijä
  const logoffHandler = async (event) => {
    event.preventDefault();
    console.log('logging out...');
    window.localStorage.removeItem('loggedUser');
    dispatch(logoff());
  }

  const padding = { padding: 5 };

  return (
    <Container>
      <div>
        <h1>Bloglist Application</h1>

        <Message />
        {logged === null ?
          <LoginForm />
          : <div>
            <div>
              <Link style={padding} to="/">Home</Link>
              <Link style={padding} to="/users">Users</Link>
              <Link style={padding} to="/blogs">Blogs</Link>
            </div>
            <p>{logged.name} is logged in.
          <Button
                variant="outlined"
                color="primary"
                id="logoffButton"
                onClick={logoffHandler}
              >Log off</Button>
            </p>
            <Switch>
              <Route path="/users/:id">
                <User user={user} />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/blogs/:id">
                <Blog blog={blog} />
              </Route>
              <Route path="/blogs">
                <NewBlog />
                <BlogList />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>

          </div>
        }

      </div>
    </Container>
  );
};

export default App