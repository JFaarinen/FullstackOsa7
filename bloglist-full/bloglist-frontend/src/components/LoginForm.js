import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Togglable from './Togglable';
import { login } from '../reducers/userReducer';
import blogService from '../services/blogs';
import { newMessage } from '../reducers/messageReducer';
import loginService from '../services/login';
import {
    TextField,
    Button
} from '@material-ui/core';

const Login = () => {
    const dispatch = useDispatch();
    const logged = useSelector(state => state.user);

    const loginHandler = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        console.log('Logging in with ', username, password);
        try {
            const loggingUser = await loginService.login({ username, password });
            dispatch(login(loggingUser));
            console.log('LOGGED IN USER: ', logged);
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(loggingUser)
            );
            blogService.setToken(loggingUser.token);
            dispatch(newMessage(`User '${loggingUser.name}' logged in.`, 5));
        } catch (exception) {
            console.log(exception);
        }
    }

    const loginRef = useRef();

    return (
        <Togglable buttonLabel='Login' ref={loginRef}>
            <div>
                <h2>Log in to the application</h2>
                <form onSubmit={loginHandler}>
                    <div>
                        Username: <TextField
                            id="username"
                            type='text'
                            name="username"
                        />
                    </div>
                    <div>
                        Password: <TextField
                            id="password"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div>
                        <Button
                            variant="outlined"
                            color="primary"
                            id="loginButton"
                            type='submit'
                        >Login</Button>
                    </div>
                </form>
            </div>
        </Togglable>
    );
};

export default Login;