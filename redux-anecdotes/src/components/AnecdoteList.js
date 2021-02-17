import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { newNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes;
        } else {
            return state.anecdotes.filter(a =>
                a.content.toLowerCase()
                    .includes(state.filter.toLowerCase()));
        }
    });

    const dispatch = useDispatch();

    const vote = (id) => {
        const votedAnecdote = anecdotes.find(a => a.id === id);
        console.log('voted anecdote: ', votedAnecdote);
        dispatch(voteAnecdote(votedAnecdote));
        dispatch(newNotification(`voted: ${votedAnecdote.content}`, 10));
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnecdoteList;