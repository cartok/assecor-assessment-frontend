/// <reference types="node" />

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  createWebRequestFromNodeRequest,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node'
import { staticPlugin } from '@elysiajs/static'
import { Elysia } from 'elysia'

const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const server = new Elysia()
const angularApp = new AngularNodeAppEngine()

server.use(
  staticPlugin({
    prefix: '',
    assets: browserDistFolder,
    alwaysStatic: true,
    maxAge: process.env['NODE_ENV'] === 'production' ? 60 * 60 * 24 : 60 * 30,
  }),
)

server.get('/*', async (c) => {
  const res = await angularApp.handle(c.request, { server: 'elysia' })
  return res
})

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  server.listen(port, (error) => {
    if (error) {
      throw error
    }

    console.log(`Elysia server listening on http://localhost:${port}`)
  })
}

export const reqHandler = createNodeRequestHandler(async (req, res, next) => {
  try {
    const response = await server.fetch(createWebRequestFromNodeRequest(req))

    if (response) {
      await writeResponseToNodeResponse(response, res)
      return
    }

    next()
  } catch (error) {
    next(error)
  }
})
