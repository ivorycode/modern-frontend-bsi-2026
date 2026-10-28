import createClient from 'openapi-fetch'
import type { components, paths } from './schema'

// `paths` is generated from the backend's OpenAPI spec (npm run generate:api).
// The client below knows every route, its parameters and its response types –
// try autocompleting the first argument of api.GET(...) in your editor.
export const api = createClient<paths>({ baseUrl: 'http://localhost:3000' })

// Convenience aliases for schema types from the spec:
export type Project = components['schemas']['Project']
export type Task = components['schemas']['Task']
