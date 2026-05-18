import axios from 'axios'

const service = axios.create({
  baseURL: '/api/travel',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function get(url, params) {
  return service.get(url, { params })
}

export function post(url, data) {
  return service.post(url, data)
}