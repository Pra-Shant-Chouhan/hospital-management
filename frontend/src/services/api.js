import axios from 'axios'

let authToken = null

export const setAuthToken = (token) => {
    authToken = token
}

export const clearAuthToken = () => {
    authToken = null
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
})

export default api
