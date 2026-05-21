import axios from 'axios';

function snakeToCamel(str) {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase())
}

function transformKeys(obj) {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeys)
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key)
      acc[camelKey] = transformKeys(obj[key])
      return acc
    }, {})
  }
  return obj
}

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (response) => {
    response.data = transformKeys(response.data)
    return response
  },
  (error) => Promise.reject(error)
)

export default api
