import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('accessToken')

  const api = axios.create({
    baseURL: config.public.apiUrl as string,
    timeout: 10000,
  })

  api.interceptors.request.use((requestConfig) => {
    if (tokenCookie.value) {
      requestConfig.headers.Authorization = `Bearer ${tokenCookie.value}`
    }
    return requestConfig
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenCookie.value = null
        navigateTo('/login')
      }
      return Promise.reject(error)
    },
  )

  return {
    provide: {
      api,
    },
  }
})
