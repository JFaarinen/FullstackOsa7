import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
const setToken = newToken => {
  token = `bearer ${newToken}`;
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addNew = async (newBlog) => {

  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
}

const like = async (likedBlog) => {

  const likeUrl = `${baseUrl}/${likedBlog.id}`;
  const response = await axios.put(likeUrl, likedBlog);
  return response.data;
}

const comment = async (comment, id) => {
  const commentUrl = `${baseUrl}/${id}/comments`;
  const response = await axios.post(commentUrl, comment);
  return response.data;
}

const remove = (id) => {

  const config = {
    headers: { Authorization: token }
  }
  const removeUrl = `${baseUrl}/${id}`;
  const req = axios.delete(removeUrl, config);
  return req.then(res => res.data);
}

export default { getAll, addNew, like, setToken, remove, comment }