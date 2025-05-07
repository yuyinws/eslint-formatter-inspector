/* eslint-disable no-console */
import type { ESLint, Linter } from 'eslint'
import { readFile, stat } from 'node:fs/promises'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import c from 'ansis'
import { getPort } from 'get-port-please'
import { getQuery, H3, serve, serveStatic } from 'h3'
import launch from 'launch-editor'
import { lookup } from 'mrmime'
import { dirname, extname, join, relative, resolve } from 'pathe'
import { MARK_INFO } from './constants'

export function processESLintResults(result: ESLint.LintResult[]) {
  result = result.filter(item => item.errorCount > 0 || item.warningCount > 0)

  result.sort((a, b) => {
    if (a.errorCount !== b.errorCount) {
      return b.errorCount - a.errorCount
    }
    if (a.warningCount !== b.warningCount) {
      return b.warningCount - a.warningCount
    }
    return a.filePath.localeCompare(b.filePath)
  })

  return result.map((item) => {
    const relativePath = relative(cwd(), item.filePath)
    const ext = extname(relativePath)
    const messagesGroupedByLine: Record<number, Linter.LintMessage[]> = {}

    for (const message of item.messages) {
      if (!messagesGroupedByLine[message.line]) {
        messagesGroupedByLine[message.line] = []
      }
      messagesGroupedByLine[message.line].push(message)
    }

    return {
      ...item,
      relativePath,
      messagesGroupedByLine,
      ext,
    }
  })
}

async function formatter(result: ESLint.LintResult[]): Promise<void> {
  const app = new H3()

  const clientDir = resolve(dirname(fileURLToPath(import.meta.url)), './client/public')

  app.use('/api/payload.json', () => {
    return processESLintResults(result)
  })

  app.use('/api/launch', async (event) => {
    try {
      const query = getQuery(event)
      if (query.file) {
        launch(query.file)
        return {
          status: 'success',
        }
      }
    }
    catch (error) {
      return {
        status: 'error',
        error: String(error),
      }
    }
  })

  app.use('/**', (event) => {
    return serveStatic(event, {
      indexNames: ['/index.html'],
      getContents: id => readFile(join(clientDir, id)),
      getMeta: async (id) => {
        const stats = await stat(join(clientDir, id)).catch(() => {})
        if (stats?.isFile()) {
          return {
            size: stats.size,
            mtime: stats.mtimeMs,
            type: lookup(id),
          }
        }
      },
      fallthrough: true,
    })
  })

  const port = await getPort({ port: 3777, portRange: [3777, 4000] })

  serve(app, { port, silent: true })

  console.log(MARK_INFO, `Starting ESLint formatter inspector at`, c.green`http://localhost:${port}`, '\n')
}

export default formatter
