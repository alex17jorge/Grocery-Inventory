import axios from 'axios'

const baseURL = 'http://localhost:3001/items'

const getAll = () => {
  return axios.get(baseURL).then(response => response.data)
}

const create = (newItem) => {
  return axios.post(baseURL, newItem).then(response => response.data)
}

const update = (id, updatedItem) => {
  return axios.put(`${baseURL}/${id}`, updatedItem).then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseURL}/${id}`)
}

export default { getAll, create, update, remove }

