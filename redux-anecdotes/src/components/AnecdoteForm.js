import React from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer'
import { newNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
    const dispatch = useDispatch();

    const addAnecdote = async (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        console.log('content: ', content);
        event.target.anecdote.value = '';
        dispatch(createAnecdote(content));
        dispatch(newNotification(`New anecdote: ${content}`, 10));

    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name='anecdote' /></div>
                <button type='submit'>Add anecdote</button>
            </form>
        </div>
    );
}

export default AnecdoteForm;