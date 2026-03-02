/// <reference types="node" />

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node'
import express from 'express'

const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const server = express()
const angularApp = new AngularNodeAppEngine()

server.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
)

server.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next)
})

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  server.listen(port, (error) => {
    if (error) {
      throw error
    }

    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

export const reqHandler = createNodeRequestHandler(server)
