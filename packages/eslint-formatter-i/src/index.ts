import type { ESLint, Linter } from 'eslint'
import { readFile, stat } from 'node:fs/promises'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { getPort } from 'get-port-please'
import { H3, serve, serveStatic } from 'h3'
import { lookup } from 'mrmime'
import { dirname, extname, join, relative, resolve } from 'pathe'

export function processESLintResults(result: ESLint.LintResult[]) {
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

  app.use('/payload.json', () => {
    return processESLintResults(result)
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

  serve(app, { port })
}

export default formatter
