// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    formatters: {
      css: true,
      markdown: true,
    },
  },
)
