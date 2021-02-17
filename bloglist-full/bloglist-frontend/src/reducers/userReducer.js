import loginService from '../services/login';

const userReducer = (state = null, action) => {
    console.log('LOGIN STATE: ', state);
    console.log('LOGIN ACTION: ', action);

    switch (action.type) {
        case 'LOGIN_USER':
            return state = action.data;
        case 'LOGOFF_USER':
            return state = null;
        case 'SET_USER':
            return action.data;
        default:
            return state;
    }
}

export const login = (user) => {
    return {
        type: 'LOGIN_USER',
        data: user
    }
}

export const setUser = (user) => {
    return async dispatch => {
        dispatch({
            type: 'SET_USER',
            data: user
        });
    };
};

export const logoff = () => {
    return async dispatch => {
        dispatch({
            type: 'LOGOFF_USER'
        });
    }
}



export default userReducer;