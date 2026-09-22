import type { User, LoginPayload, RegisterPayload, AuthResponse } from '~/types'

export function useAuth() {
  const { $api } = useNuxtApp()
  const user = useState<User | null>('auth-user', () => null)
  const tokenCookie = useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7 })

  const isLoggedIn = computed(() => !!tokenCookie.value)

  async function login(payload: LoginPayload) {
    const { data } = await $api.post<AuthResponse>('/auth/login', payload)
    tokenCookie.value = data.accessToken
    user.value = data.user
  }

  async function register(payload: RegisterPayload) {
    const { data } = await $api.post<AuthResponse>('/auth/register', payload)
    tokenCookie.value = data.accessToken
    user.value = data.user
  }

  async function fetchUser() {
    if (!tokenCookie.value) return
    try {
      const { data } = await $api.get<User>('/auth/me')
      user.value = data
    }
    catch {
      tokenCookie.value = null
      user.value = null
    }
  }

  function logout() {
    tokenCookie.value = null
    user.value = null
    navigateTo('/login')
  }

  return { user, isLoggedIn, login, register, fetchUser, logout }
}
