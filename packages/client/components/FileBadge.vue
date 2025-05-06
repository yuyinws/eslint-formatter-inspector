<script setup lang="ts">
const { relativePath, ext } = defineProps<{
  relativePath: string
  fullPath: string
  ext: string
}>()

const fileIcon = computed(() => {
  switch (ext) {
    case '.ts':
      return ' '
    case '.js':
      return ' '
    case '.vue':
      return ' '
    case '.json':
      return ' '
    default:
      return '󰈔 '
  }
})
</script>

<template>
  <a is-="badge" variant-="background1" tabindex="0">
    <span class="mr-[1.5ch]">
      {{ fileIcon }}
    </span>

    <span>{{ relativePath }}</span>
  </a>
</template>
