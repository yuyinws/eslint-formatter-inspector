import type { ESLint, Linter } from 'eslint'
import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { cwd, env } from 'node:process'
import { fileURLToPath } from 'node:url'
import c from 'ansis'
import { consola } from 'consola'
import { getPort } from 'get-port-please'
import { getQuery, H3, serve, serveStatic } from 'h3'
import launch from 'launch-editor'
import { lookup } from 'mrmime'
import { dirname, extname, join, relative, resolve } from 'pathe'

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
  const INSPECTOR_MODE = env.INSPECTOR_MODE
  const clientDir = resolve(dirname(fileURLToPath(import.meta.url)), './client/public')
  if (INSPECTOR_MODE === 'build') {
    consola.start('Building static ESLint formatter inspector...')
    const outputDir = resolve(cwd(), '.eslint-formatter-inspector')
    if (existsSync(outputDir)) {
      await rm(outputDir, { recursive: true })
    }
    await mkdir(outputDir, { recursive: true })
    await cp(clientDir, outputDir, { recursive: true })
    await mkdir(resolve(outputDir, 'api'), { recursive: true })
    await writeFile(resolve(outputDir, 'api', 'payload.json'), JSON.stringify(processESLintResults(result), null, 2), 'utf-8')

    consola.success(`Built to ${c.cyan(relative(cwd(), outputDir))}`)
    consola.success(`You can preview this build using ${c.green`npx serve ${relative(cwd(), outputDir)}`}`)
  }
  else {
    const app = new H3()

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

    consola.info(`Starting ESLint formatter inspector at`, c.green`http://localhost:${port}`, '\n')
  }
}

export default formatter
