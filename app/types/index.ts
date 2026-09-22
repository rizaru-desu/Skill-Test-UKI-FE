export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface Credential {
  id: number
  name: string
  username: string
  password: string
  url: string | null
  notes: string | null
  categoryId: number | null
  groupId: number | null
  category: CredentialCategory | null
  group: CredentialGroup | null
  createdAt: string
  updatedAt: string
}

export interface CredentialGroup {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CredentialCategory {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CredentialFormData {
  name: string
  username: string
  password: string
  url: string
  notes: string
  categoryId: number | null
  groupId: number | null
}

export interface GroupFormData {
  name: string
  description: string
}

export interface CategoryFormData {
  name: string
  description: string
}
