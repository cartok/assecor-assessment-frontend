import fs from 'node:fs/promises'

import type { JSONSchema } from 'ya-json-schema-types'

import config from '../config/breakpoints.json' with { type: 'json' }

const schema: JSONSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'device.schema.json',
  type: 'object',
  additionalProperties: false,
  properties: {
    v: {
      type: 'integer',
      const: config.version,
    },
    pointer: {
      type: 'string',
      enum: config.pointer,
    },
    hover: {
      type: 'string',
      enum: config.hover,
    },
    device: {
      type: 'string',
      enum: config.device,
    },
    width: {
      type: 'integer',
      enum: config.width,
    },
    height: {
      type: 'integer',
      enum: config.height,
    },
  },
  required: ['v', 'pointer', 'hover'],
}

const outputDir = new URL('../generated/schema/', import.meta.url)
const outputFile = new URL('device.schema.json', outputDir)

await fs.mkdir(outputDir, { recursive: true })
await fs.writeFile(outputFile, JSON.stringify(schema, null, 2) + '\n')
