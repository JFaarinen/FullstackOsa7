import blogService from '../services/blogs';

const blogReducer = (state = [], action) => {

    switch (action.type) {
        case 'NEW_BLOG':
            const blog = action.data;
            console.log(blog);
            return state.concat(blog);
        case 'INIT_BLOGS':
            return action.data;
        case 'LIKE_BLOG':
            return state.map(blog =>
                blog.id !== action.data.id
                    ? blog
                    : action.data);
        case 'NEW_COMMENT':
            const commentedBlog = state.find(blog => blog.id === action.data.blog);
            const updComments = commentedBlog.comments.concat({
                comment: action.data.comment,
                id: action.data.id
            });
            const updBlog = { ...commentedBlog, comments: updComments };
            return state.map(blog =>
                blog.id !== action.data.blog
                    ? blog
                    : updBlog);
        case 'REMOVE_BLOG':
            return state.filter(blog => blog.id !== action.data);
        default:
            return state;
    }
}

export const newBlog = (content) => {
    return async dispatch => {
        const blog = await blogService.addNew(content);
        //console.log('Blogi serveriltä', blog);
        dispatch({
            type: 'NEW_BLOG',
            data: blog
        });
    };
};

export const addComment = (content, id) => {
    return async dispatch => {
        const comment = await blogService.comment(content, id);
        console.log(comment);
        dispatch({
            type: 'NEW_COMMENT',
            data: comment
        });
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll();
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs
        });
    };
};

export const like = (likedBlog) => {
    return async dispatch => {
        const blog = await blogService.like(likedBlog);
        dispatch({
            type: 'LIKE_BLOG',
            data: blog
        });
    };
};

export const remove = (id) => {
    return async dispatch => {
        await blogService.remove(id);
        dispatch({
            type: 'REMOVE_BLOG',
            data: id
        });
    };
};

export default blogReducer;