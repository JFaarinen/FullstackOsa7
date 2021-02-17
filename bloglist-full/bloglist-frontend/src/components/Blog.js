import React from 'react';
import { useDispatch } from 'react-redux';
import { like, remove, addComment } from '../reducers/blogReducer';
import { newMessage } from '../reducers/messageReducer';
import {
  Button,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons/';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  if (!blog) {
    return null;
  }
  console.log(blog);

  const likeBlog = async () => {
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    dispatch(like(likedBlog));
  }

  const removeBlog = async () => {
    console.log(blog.user);
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      dispatch(remove(blog.id));
      dispatch(newMessage('blog is removed', 5));
    }
  }

  const sendComment = async (e) => {
    e.preventDefault();
    const comment = {
      comment: e.target.comment.value
    }
    console.log(comment);
    dispatch(addComment(comment, blog.id));
    e.target.comment.value = '';
  }

  const blogstyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div className='blog' style={blogstyle}>
      {blog.title}: {blog.author}
      <div>
        <div>{blog.url}</div>
        <div>Likes: {blog.likes}
          <Button
            variant="outlined"
            color="primary"
            id="likeButton"
            onClick={likeBlog}
          >Like </Button>
        </div>
        <div>Added by: {blog.user.name}</div>
        <div><Button
          variant="outlined"
          color="primary"
          id="removeButton"
          onClick={removeBlog}
        >Remove</Button></div>
      </div>
      <h2>Comments:</h2>
      <form onSubmit={sendComment}>
        <input type='text' name='comment'></input>
        <Button
          name='Comment'
          variant="outlined"
          color="primary"
          id="commentButton"
          type='submit'
        >Add comment </Button>
      </form>
      <List>
        {blog.comments.map((c) =>
          <ListItem key={c.id}>
            <ListItemIcon>
              <ArrowForward />
            </ListItemIcon>
            <ListItemText primary={c.comment} />
          </ListItem>)}
      </List>
    </div>
  );
};

export default Blog
