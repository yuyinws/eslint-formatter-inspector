<script setup lang="ts">
import type { Linter } from 'eslint'
import pm from 'picomatch'

const { data, status } = await useFetch<{
  filePath: string
  relativePath: string
  messagesGroupedByLine: Record<number, Linter.LintMessage[]>
  source: string
  errorCount: number
  warningCount: number
  fixableErrorCount: number
  fixableWarningCount: number
  ext: string
}[]>('/api/payload.json')

const filterVal = ref('')

const filteredResults = computed(() => {
  if (!data.value)
    return []

  if (!filterVal.value)
    return data.value

  const isMatch = pm(filterVal.value, {
    contains: true,
  })

  return data.value.filter((result) => {
    return isMatch(result.relativePath)
  })
})

const totalErrorCount = computed(() => filteredResults.value?.reduce((acc, result) => acc + result.errorCount, 0) ?? 0)
const totalWarningCount = computed(() => filteredResults.value?.reduce((acc, result) => acc + result.warningCount, 0) ?? 0)

function getCodeFromSource(source: string, line: number) {
  const lines = source.split('\n')
  return lines[line - 1]
}

function calculateErrorHeight(messages: Linter.LintMessage[]) {
  return `${messages.length * 3}em`
}
</script>

<template>
  <AppHeader />

  <main v-if="status === 'success'" box-="square contain:!top">
    <div class="flex justify-between mx-[1ch]">
      <input v-model="filterVal" placeholder="Filter by file name. eg:*.ts" class="w-[40ch] mr-[1ch]">

      <div is-="badge" variant-="background0">
        <span class="dark:text-yellow-400 text-yellow-600 mr-[1ch]">&#xf071; {{ totalWarningCount }}</span>

        <span class="dark:text-red-400 text-red-600">&#xf530; {{ totalErrorCount }}</span>
      </div>
    </div>

    <section v-for="result in filteredResults" :key="result.relativePath" box-="square contain:!top" class="m-[1ch] result-box">
      <div class="flex justify-between">
        <FileBadge :relative-path="result.relativePath" :full-path="result.filePath" :ext="result.ext" />
        <div is-="badge" variant-="background0">
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
              <div :style="{ left: `${message.column - 1}ch` }" class="absolute w-full dark:text-gray-600 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 group">
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
                    [ <span class="text-xs" :class="message.severity === 2 ? 'group-hover:text-red-800! group-hover:dark:text-red-500!' : 'group-hover:text-yellow-600! group-hover:dark:text-yellow-400!'">{{ message.severity === 2 ? '&#xf530;' : '&#xf071;' }}</span> {{ message.ruleId }} ]
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

<style>
.result-box {
  --box-border-color: var(--background2);
}

.result-box:hover {
  --box-border-color: var(--foreground0)!important;
}
</style>
