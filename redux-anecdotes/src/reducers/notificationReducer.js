const notificationReducer = (state = null, action) => {
    console.log('Notification state: ', state);
    console.log('Notification action: ', action);

    switch (action.type) {
        case 'NEW_NOTIFICATION':
            return action.data;
        case 'CLEAR_NOTIFICATION':
            return null;
        default:
            return state;
    }
}

let timeoutId;

export const newNotification = (notification, time) => {
    return async dispatch => {
        dispatch({
            type: 'NEW_NOTIFICATION',
            data: notification
        });

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            dispatch({
                type: 'CLEAR_NOTIFICATION'
            })

        }, time * 1000);
    }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION',
    }
}

export default notificationReducer;