import type { Project, Task } from './schemas.js'

// In-memory "database", shared by all routes. Restarting the server resets it.
export const projects: Project[] = [
  { id: 1, name: 'CAS Unterricht' },
  { id: 2, name: 'Konferenz-Talk' },
]

export const tasks: Task[] = [
  { id: 1, projectId: 1, title: 'Client-Server-Demos vorbereiten', done: true },
  { id: 2, projectId: 1, title: 'OpenAPI-Codegen zeigen', done: false, dueDate: '2026-09-01' },
  { id: 3, projectId: 2, title: 'Abstract einreichen', done: false },
]

let nextTaskId = 4
export const nextId = () => nextTaskId++
