<script setup lang="ts">
import { KeyOutlined, AppstoreOutlined, TagsOutlined } from '@ant-design/icons-vue'

const { $api } = useNuxtApp()
const { user, fetchUser } = useAuth()

const stats = ref({ credentials: 0, groups: 0, categories: 0 })

async function loadStats() {
  try {
    const [credentials, groups, categories] = await Promise.all([
      $api.get('/credentials', { params: { limit: 1 } }),
      $api.get('/groups', { params: { limit: 1 } }),
      $api.get('/categories', { params: { limit: 1 } }),
    ])
    stats.value = {
      credentials: credentials.data.meta?.total ?? 0,
      groups: groups.data.meta?.total ?? 0,
      categories: categories.data.meta?.total ?? 0,
    }
  }
  catch {
  }
}

onMounted(async () => {
  await fetchUser()
  loadStats()
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 m-0">
        {{ user ? `Halo, ${user.name}` : 'Dashboard' }}
      </h2>
      <p class="text-gray-500 mt-1">
        Ringkasan data credential dan kategori yang tersimpan.
      </p>
    </div>

    <a-row :gutter="16">
      <a-col :xs="24" :sm="8">
        <a-card class="mb-4">
          <a-statistic title="Credentials" :value="stats.credentials">
            <template #prefix>
              <KeyOutlined class="text-blue-500" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card class="mb-4">
          <a-statistic title="Groups" :value="stats.groups">
            <template #prefix>
              <AppstoreOutlined class="text-green-500" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card class="mb-4">
          <a-statistic title="Categories" :value="stats.categories">
            <template #prefix>
              <TagsOutlined class="text-orange-500" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mt-4">
      <a-col :xs="24" :sm="8">
        <NuxtLink to="/credentials">
          <a-button type="primary" block>
            <KeyOutlined />
            Manage Credentials
          </a-button>
        </NuxtLink>
      </a-col>
      <a-col :xs="24" :sm="8">
        <NuxtLink to="/groups">
          <a-button block>
            <AppstoreOutlined />
            Manage Groups
          </a-button>
        </NuxtLink>
      </a-col>
      <a-col :xs="24" :sm="8">
        <NuxtLink to="/categories">
          <a-button block>
            <TagsOutlined />
            Manage Categories
          </a-button>
        </NuxtLink>
      </a-col>
    </a-row>
  </div>
</template>
