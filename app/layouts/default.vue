<template>
  <a-layout class="min-h-screen">
    <AppSidebar />
    <a-layout>
      <AppHeader />
      <a-layout-content class="p-6 bg-gray-50">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
