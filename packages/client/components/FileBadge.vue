<script setup lang="ts">
const { relativePath, ext } = defineProps<{
  relativePath: string
  fullPath: string
  ext: string
}>()

const fileIcon = computed(() => {
  // https://www.nerdfonts.com/cheat-sheet
  switch (ext) {
    case '.ts':
      return `&#xe69d;`
    case '.tsx':
      return `&#xe69d;`
    case '.js':
      return `&#xf2ee;`
    case '.jsx':
      return `&#xf2ee;`
    case '.vue':
      return `&#xe6a0;`
    case '.json':
      return `&#xeb0f;`
    case '.svelte':
      return `&#xe8b7;`
    case '.md':
      return `&#xeeab;`
    case '.mdx':
      return `&#xeeab;`
    case '.css':
      return `&#xe749;`
    default:
      return `&#xf15b;`
  }
})

const splitPath = computed(() => {
  const pathArray = relativePath.split('/')
  const last = pathArray.pop()
  return {
    rest: pathArray.join('/'),
    last,
  }
})
</script>

<template>
  <a is-="badge" variant-="background1">
    <span class="mr-[1.5ch]" v-html="fileIcon" />
    <span class="opacity-50">{{ splitPath.rest }}</span>
    <span>/{{ splitPath.last }}</span>
  </a>
</template>
