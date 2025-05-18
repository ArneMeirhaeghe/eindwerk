// src/api/axios.ts
import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Request logging + token injectie
instance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token")
    console.debug("[API Request]", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      token,
      data: config.data,
    })
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    console.error("[API Request Error]", error)
    return Promise.reject(error)
  }
)

// Response logging
instance.interceptors.response.use(
  (res) => {
    console.debug("[API Response]", {
      status: res.status,
      url: res.config.url,
      data: res.data,
    })
    return res
  },
  (error) => {
    console.error("[API Response Error]", error.response ?? error)
    return Promise.reject(error)
  }
)

export default instance
