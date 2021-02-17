import React from 'react';
import { useSelector } from 'react-redux';

const Message = () => {
    const message = useSelector(state => state.message);

    if (!message) {
        return null;
    }

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }

    return (<div style={style}>
        {message}
    </div>);
}

export default Message;