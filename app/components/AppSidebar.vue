<script setup lang="ts">
import {
  DashboardOutlined,
  KeyOutlined,
  AppstoreOutlined,
  TagsOutlined,
  FolderOutlined,
} from '@ant-design/icons-vue'
import type { CredentialGroup } from '~/types'

const { $api } = useNuxtApp()
const route = useRoute()

const groups = useState<CredentialGroup[]>('app-groups', () => [])

const selectedKeys = computed(() => [route.path])

async function fetchGroups() {
  try {
    const { data } = await $api.get('/groups', { params: { limit: 100 }, timeout: 5000 })
    groups.value = data.data ?? data
  }
  catch {
    groups.value = []
  }
}

onMounted(fetchGroups)

watch(() => route.path, (path) => {
  if (path.startsWith('/groups')) {
    fetchGroups()
  }
})
</script>

<template>
  <a-layout-sider
    :width="240"
    theme="light"
    class="min-h-screen border-r border-gray-200"
  >
    <div class="px-5 py-5 border-b border-gray-100">
      <h1 class="text-base font-semibold text-gray-800 m-0 tracking-tight">
        Credential Manager
      </h1>
    </div>

    <a-menu
      :selected-keys="selectedKeys"
      mode="inline"
      class="border-r-0 pt-2"
    >
      <a-menu-item key="/">
        <NuxtLink to="/" class="flex items-center gap-2">
          <DashboardOutlined />
          <span>Dashboard</span>
        </NuxtLink>
      </a-menu-item>

      <a-menu-item key="/credentials">
        <NuxtLink to="/credentials" class="flex items-center gap-2">
          <KeyOutlined />
          <span>Credentials</span>
        </NuxtLink>
      </a-menu-item>

      <a-menu-item key="/categories">
        <NuxtLink to="/categories" class="flex items-center gap-2">
          <TagsOutlined />
          <span>Categories</span>
        </NuxtLink>
      </a-menu-item>

      <a-menu-item key="/groups">
        <NuxtLink to="/groups" class="flex items-center gap-2">
          <AppstoreOutlined />
          <span>Groups</span>
        </NuxtLink>
      </a-menu-item>

      <a-sub-menu v-if="groups.length" key="group-menu">
        <template #title>
          <span class="flex items-center gap-2">
            <FolderOutlined />
            <span>Group List</span>
          </span>
        </template>
        <a-menu-item
          v-for="group in groups"
          :key="`/credentials?groupId=${group.id}`"
        >
          <NuxtLink :to="`/credentials?groupId=${group.id}`">
            {{ group.name }}
          </NuxtLink>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
