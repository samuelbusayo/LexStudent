import axios from 'axios'

let serverPort = 3001

export function setServerPort(port: number) {
  serverPort = port
  api.defaults.baseURL = `http://localhost:${port}/api`
}

const api = axios.create({
  baseURL: `http://localhost:${serverPort}/api`,
  headers: { 'Content-Type': 'application/json' },
})

function snakeToCamel(str: string) {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase())
}

function transformKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeys)
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[snakeToCamel(key)] = transformKeys(obj[key])
      return acc
    }, {})
  }
  return obj
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    response.data = transformKeys(response.data)
    return response
  },
  (error) => Promise.reject(error)
)

export default api
