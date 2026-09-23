<script setup lang="ts">
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'

const { user, logout } = useAuth()
</script>

<template>
  <a-layout-header class="bg-white border-b border-gray-200 flex items-center justify-between px-6" style="height: 56px; line-height: 56px;">
    <div />
    <div class="flex items-center gap-3">
      <a-dropdown v-if="user">
        <a class="flex items-center gap-2 text-gray-700 cursor-pointer">
          <a-avatar :size="28">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="text-sm">{{ user.name }}</span>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="logout" @click="logout">
              <LogoutOutlined class="mr-2" />
              Logout
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
