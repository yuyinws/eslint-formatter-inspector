<script setup lang="ts">
const { relativePath, ext } = defineProps<{
  relativePath: string
  fullPath: string
  ext: string
}>()

const fileIcon = computed(() => {
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
    default:
      return `&#xf15b;`
  }
})
</script>

<template>
  <a is-="badge" variant-="background1">
    <span class="mr-[1.5ch]" v-html="fileIcon" />

    <span>{{ relativePath }}</span>
  </a>
</template>
