import React from 'react';
import {
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

const User = ({ user }) => {
    const classes = useStyles();

    if (!user) {
        return null;
    }
    return (
        <div className={classes.root}>
            <h2>{user.name}</h2>
            <h3>Added blogs</h3>
            <List>
                {user.blogs.map((blog, id) =>
                    <ListItem key={id}>
                        <ListItemIcon>
                            <ArrowForward />
                        </ListItemIcon>
                        <ListItemText primary={blog.title} />
                    </ListItem>)}
            </List>

        </div>
    );
}

export default User;