import fs from 'node:fs/promises'

import Ajv2020 from 'ajv/dist/2020'
import standaloneCode from 'ajv/dist/standalone'

import schema from './device-cookie.schema.json' with { type: 'json' }

const ajv = new Ajv2020({
  code: { esm: true, source: true },
})

const validate = ajv.compile(schema)
const validator = standaloneCode(ajv, validate)
const dts = `
declare module '@/generated/validators/*.mjs' {
  const validator: any
  export default validator
  export const validate: any
}
`

const outputDir = new URL('../generated/validators/', import.meta.url)
const outputFile = new URL('device-cookie.validator.mjs', outputDir)
const outputFileDts = new URL('device-cookie.validator.d.ts', outputDir)

await fs.mkdir(outputDir, { recursive: true })
await fs.writeFile(outputFile, validator)
await fs.writeFile(outputFileDts, dts)
