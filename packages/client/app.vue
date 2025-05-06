<script setup lang="ts">
import type { Linter } from 'eslint'

// const payload = ref<ESLint.LintResult[]>([])

const { data: listResult, status } = await useFetch<{
  filePath: string
  relativePath: string
  messagesGroupedByLine: Record<number, Linter.LintMessage[]>
  source: string
  errorCount: number
  warningCount: number
  fixableErrorCount: number
  fixableWarningCount: number
}[]>('/payload.json')

function getCodeFromSource(source: string, line: number) {
  const lines = source.split('\n')
  return lines[line - 1]
}

function calculateErrorHeight(messages: Linter.LintMessage[]) {
  // 每个错误信息需要 2 行高度（箭头和错误信息各占一行）
  return `${messages.length * 3}em`
}
</script>

<template>
  <AppHeader />

  <main v-if="status === 'success'" box-="square contain:!top">
    <div is-="badge" variant-="background0" tabindex="0">
      Reports
    </div>

    <section v-for="result in listResult" :key="result.relativePath" box-="square contain:!top" class="m-[1ch]">
      <div class="flex justify-between">
        <FileBadge :relative-path="result.relativePath" :full-path="result.filePath" />
        <div is-="badge" variant-="background0" tabindex="0">
          <span class="dark:text-yellow-400 text-yellow-600 mr-[1ch]">&#xf071; {{ result.warningCount }}</span>

          <span class="dark:text-red-400 text-red-600">&#xf530; {{ result.errorCount }}</span>
        </div>
      </div>

      <div v-for="(messages, line) in result.messagesGroupedByLine" :key="line" class="p-[1ch] mb-[1ch] flex items-start gap-[.5ch] w-[calc(100%-1ch-2px)]">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ line }}:
        </div>
        <div class="leading-none w-full">
          <Shiki :code="getCodeFromSource(result.source!, line)" />

          <div class="text-sm relative w-screen" :style="{ minHeight: calculateErrorHeight(messages) }">
            <template v-for="(message, index) in messages" :key="message.column">
              <div :style="{ left: `${message.column - 1}ch` }" class="absolute w-full dark:text-gray-600 text-gray-400">
                <div class="w-full">
                  ↑
                </div>
                <div v-for="i in ((messages.length - index - 1) * 3)" :key="i" class="w-full">
                  │
                </div>
                <div class="w-full">
                  <span>└─ </span>

                  <span />
                  <span>
                    {{ message.message }}
                  </span>

                  <span>
                    [ <span class="text-xs">{{ message.severity === 2 ? '&#xf530;' : '&#xf071;' }}</span> {{ message.ruleId }} ]
                  </span>

                  <!-- <span :class="message.severity === 2 ? 'text-red-800 dark:text-red-900' : 'text-yellow-600 dark:text-yellow-400'">
                    {{ message.severity === 2 ? '&#xf530;' : '&#xf071;' }}
                  </span> -->
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
