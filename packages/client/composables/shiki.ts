import js from '@shikijs/langs/javascript'
import ThemeLight from '@shikijs/themes/catppuccin-latte'
import ThemeDark from '@shikijs/themes/catppuccin-mocha'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export const shiki = createHighlighterCoreSync({
  themes: [
    ThemeLight,
    ThemeDark,
  ],
  langs: [js],
  engine: createJavaScriptRegexEngine(),
})
