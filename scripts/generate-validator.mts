import fs from 'node:fs/promises'

import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone'

import schema from '../generated/schema/device.schema.json' with { type: 'json' }

const ajv = new Ajv({
  code: { esm: true, source: true },
})

const validate = ajv.compile(schema)
const moduleCode = standaloneCode(ajv, validate)

const outputDir = new URL('../generated/validator/', import.meta.url)
const outputFile = new URL('device.validator.mjs', outputDir)

await fs.mkdir(outputDir, { recursive: true })
await fs.writeFile(outputFile, moduleCode)
