<script setup lang="ts">
const props = defineProps<{
  code: string
  ext: string
}>()

function getLang(ext: string) {
  switch (ext) {
    case '.css':
      return 'css'
    case '.js':
      return 'javascript'
    case '.jsx':
      return 'javascript'
    case '.ts':
      return 'typescript'
    case '.tsx':
      return 'typescript'
    case '.json':
      return 'json'
    case '.json5':
      return 'json5'
    case '.jsonc':
      return 'jsonc'
    case '.md':
      return 'markdown'
    case '.mdx':
      return 'mdx'
    default:
      return 'javascript'
  }
}

const code = shiki.codeToHtml(props.code, {
  lang: getLang(props.ext),
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
})
</script>

<template>
  <div v-html="code" />
</template>
