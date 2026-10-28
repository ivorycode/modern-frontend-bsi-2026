import { buildApp } from './app.js'

const app = await buildApp()

await app.listen({ port: 3000 })
console.log('API running on http://localhost:3000')
