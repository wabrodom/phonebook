import axios from 'axios'
const baseUrl = "/api/persons"

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
    const config = {
        headers: { Authorization: token }
    }
    const request = axios.get(baseUrl, config)
    return request.then(response => response.data) 
}

const getGeneralInfo = () => {
    const request = axios.get(`${baseUrl}/info`)
    return request.then(response => response.data) 
}


const create = async (object) => {
    const config = {
        headers: { Authorization: token }
    }

    const response = await axios.post(baseUrl, object, config)
    return response.data
}

const update = (id, newObject) => {
    const config ={
        headers: { Authorization: token }
    }

    const request = axios.put(`${baseUrl}/${id}`, newObject, config);
    return request.then(response => response.data)
}

const remove = async (id) => {
    const config ={
        headers: { Authorization: token }
      }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default {
    getGeneralInfo,
    getAll,
    create,
    remove,
    update,
    setToken,
}

