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


const UserList = () => {
    const users = useSelector(state => state.userdata);
    const classes = useStyles();
    return (
        <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>User</StyledTableCell>
                            <StyledTableCell>Blogs created</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, id) => (
                            <StyledTableRow key={id}>
                                <StyledTableCell><Link to={`/users/${user.id}`}>{user.name}</Link></StyledTableCell>
                                <StyledTableCell>{user.blogs.length}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}

export default UserList;