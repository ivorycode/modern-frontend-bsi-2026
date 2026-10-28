// Writes the OpenAPI spec to openapi.json as a build artifact –
// no running server needed. This mirrors the typical CI setup with
// Java (springdoc) or .NET (Swashbuckle) backends, where the spec is
// produced during the build and handed to API consumers.
import { writeFile } from 'node:fs/promises'
import { buildApp } from './app.js'

const app = await buildApp()
await app.ready()

const spec = app.swagger()
await writeFile(new URL('../openapi.json', import.meta.url), JSON.stringify(spec, null, 2))
await app.close()

console.log('OpenAPI spec written to 00-server-solution/openapi.json')
