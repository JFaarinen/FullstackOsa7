import React from 'react';
import { filterChange } from '../reducers/filterReducer';
import { useDispatch, useSelector } from 'react-redux';

const AnecdoteFilter = (props) => {
    const filterValue = useSelector(state => state.filter);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Filter</h2>
            <input
                type='text'
                name='filter'
                value={filterValue}
                onChange={(e) => dispatch(filterChange(e.target.value))}
            />
        </div>
    )
}

export default AnecdoteFilter;