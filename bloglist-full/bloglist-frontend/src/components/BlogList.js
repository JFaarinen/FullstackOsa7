import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    withStyles,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: blue[900],
        color: grey[50],
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const BlogList = () => {
    const blogs = useSelector(state => state.blogs);
    const classes = useStyles();

    return (
        <div>
            <h2>Blogs</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Author</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.sort((b1, b2) => b2.likes - b1.likes).map((blog, id) => (
                            <StyledTableRow key={id}>
                                <StyledTableCell><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></StyledTableCell>
                                <StyledTableCell>{blog.author}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default BlogList;