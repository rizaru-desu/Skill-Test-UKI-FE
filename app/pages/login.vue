<script setup lang="ts">
import { LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'auth' })

const { login } = useAuth()

const form = reactive({
  email: '',
  password: '',
})
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await login(form)
    message.success('Login successful')
    navigateTo('/')
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    message.error(error.response?.data?.message || 'Login failed')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-2xl font-semibold text-gray-800 tracking-tight">
        Credential Manager
      </h1>
      <p class="text-gray-500 mt-1">
        Sign in to your account
      </p>
    </div>

    <a-card>
      <a-form :model="form" layout="vertical" @finish="onSubmit">
        <a-form-item label="Email" name="email" :rules="[{ required: true, type: 'email', message: 'Please enter a valid email' }]">
          <a-input v-model:value="form.email" size="large" placeholder="you@example.com">
            <template #prefix>
              <MailOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please enter your password' }]">
          <a-input-password v-model:value="form.password" size="large" placeholder="Password">
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            Sign In
          </a-button>
        </a-form-item>

        <div class="text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600">
            Register
          </NuxtLink>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
