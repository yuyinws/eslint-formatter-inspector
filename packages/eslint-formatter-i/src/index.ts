import type { ESLint, Linter } from 'eslint'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { H3, serve, serveStatic } from 'h3'

function formatter(result: ESLint.LintResult[]): void {
  const app = new H3()

  const clientDir = resolve(dirname(fileURLToPath(import.meta.url)), './client/public')

  app.use('/payload.json', () => {
    return result
  })

  app.use('/', (event) => {
    return serveStatic(event, {
      indexNames: ['/index.html'],
      getContents: id => readFile(join(clientDir, id)),
      getMeta: async (id) => {
        const stats = await stat(join(clientDir, id)).catch(() => {})
        if (stats?.isFile()) {
          return {
            size: stats.size,
            mtime: stats.mtimeMs,
          }
        }
      },
    })
  })

  serve(app, { port: 3777 })
}

export default formatter
