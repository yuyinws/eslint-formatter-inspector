<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const code = shiki.codeToHtml(props.code, {
  lang: 'js',
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
})
</script>

<template>
  <div v-html="code" />
</template>
