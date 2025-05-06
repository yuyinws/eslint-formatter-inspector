<script setup lang="ts">
type Theme = 'catppuccin' | 'light' | 'nord'

const theme = ref<Theme>('catppuccin')

function toggleTheme(name: Theme) {
  theme.value = name
  useHead({
    htmlAttrs: {
      'data-webtui-theme': theme,
    },
  })
}
</script>

<template>
  <header box-="square" class="flex justify-between items-center px-[2ch]">
    <a href="https://eslint.org/docs/latest/extend/custom-formatters" target="_blank">
      <span style="font-weight: bold;font-size: 24px;">&#xe7d2; ESLint</span> Formatter Inspector &#xf002;
    </a>

    <div id="theme-switcher">
      <button size-="small" :aria-selected="theme === 'catppuccin'" @click="toggleTheme('catppuccin')">
        Dark
      </button>
      <button size-="small" :aria-selected="theme === 'nord'" @click="toggleTheme('nord')">
        Nord
      </button>
      <button size-="small" :aria-selected="theme === 'light'" @click="toggleTheme('light')">
        Light
      </button>
    </div>
  </header>
</template>

<style>
#theme-switcher button[aria-selected="true"] {
  background-color: var(--background2);
  color: var(--foreground1);
}

#theme-switcher button[aria-selected="false"] {
  background-color: var(--background1);
  color: var(--foreground2);
}
</style>
