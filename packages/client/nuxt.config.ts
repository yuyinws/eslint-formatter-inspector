// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      dir: '../eslint-formatter-i/dist/client',
    },
  },
  css: ['@/styles/main.css'],
  devServer: {
    port: 3001,
  },
  app: {
    head: {
      htmlAttrs: {
        'data-webtui-theme': 'catppuccin',
      },
      title: 'ESLint Formatter Inspector',
      meta: [
        {
          name: 'description',
          content: 'An interactive tool to inspect ESLint formatter on the browser.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
