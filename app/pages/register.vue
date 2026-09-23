<script setup lang="ts">
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'auth' })

const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})
const loading = ref(false)

async function onSubmit() {
  if (form.password !== form.passwordConfirmation) {
    message.error('Passwords do not match')
    return
  }

  loading.value = true
  try {
    await register(form)
    message.success('Registration successful')
    navigateTo('/')
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    message.error(error.response?.data?.message || 'Registration failed')
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
        Create your account
      </p>
    </div>

    <a-card>
      <a-form :model="form" layout="vertical" @finish="onSubmit">
        <a-form-item label="Name" name="name" :rules="[{ required: true, message: 'Please enter your name' }]">
          <a-input v-model:value="form.name" size="large" placeholder="Your name">
            <template #prefix>
              <UserOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Email" name="email" :rules="[{ required: true, type: 'email', message: 'Please enter a valid email' }]">
          <a-input v-model:value="form.email" size="large" placeholder="you@example.com">
            <template #prefix>
              <MailOutlined class="text-gray-400" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]">
          <a-input-password v-model:value="form.password" size="large" placeholder="Password">
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="Confirm Password" name="passwordConfirmation" :rules="[{ required: true, message: 'Please confirm your password' }]">
          <a-input-password v-model:value="form.passwordConfirmation" size="large" placeholder="Confirm password">
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            Register
          </a-button>
        </a-form-item>

        <div class="text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600">
            Sign In
          </NuxtLink>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
