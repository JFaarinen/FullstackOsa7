const messageReducer = (state = null, action) => {
    switch (action.type) {
        case 'NEW_MESSAGE':
            return action.data;
        case 'CLEAR_MESSAGE':
            return null;
        default:
            return state;
    }
}

let timeoutId;

export const newMessage = (message, time) => {
    return async dispatch => {
        dispatch({
            type: 'NEW_MESSAGE',
            data: message
        });

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            dispatch({
                type: 'CLEAR_MESSAGE'
            })
        }, time * 1000);
    };
};

export const clearMessage = () => {
    return {
        type: 'CLEAR_MESSAGE'
    };
};

export default messageReducer;