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

// Watch every API response for a `newlyEarnedBadges` field (sent by routes
// that trigger badge evaluation). Dispatches a window event the BadgeToastListener
// component picks up and turns into celebratory toasts.
function extractBadgesAndNotify(data) {
  if (data === null || data === undefined) return
  if (Array.isArray(data)) { data.forEach(extractBadgesAndNotify); return }
  if (typeof data !== 'object') return
  const codes = data.newlyEarnedBadges
  if (Array.isArray(codes) && codes.length > 0) {
    window.dispatchEvent(new CustomEvent('badge:earned', { detail: codes }))
  }
}

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (response) => {
    response.data = transformKeys(response.data)
    extractBadgesAndNotify(response.data)
    return response
  },
  (error) => Promise.reject(error)
)

export default api
