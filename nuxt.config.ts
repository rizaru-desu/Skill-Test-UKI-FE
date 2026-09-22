// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@ant-design-vue/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    'dayjs-nuxt',
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3002',
    },
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
})