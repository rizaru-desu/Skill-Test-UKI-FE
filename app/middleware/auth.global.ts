export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('accessToken')
  const publicPages = ['/login', '/register']

  if (!token.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token.value && publicPages.includes(to.path)) {
    return navigateTo('/')
  }
})
