import type { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import { nextId, projects, tasks } from './data.js'
import type { Task } from './schemas.js'

// GraphQL runs as a Fastify plugin (mercurius) on the SAME server and the
// SAME in-memory data as the REST routes – one server, two protocols.
// Create a task via REST, query it via GraphQL (and vice versa).

const schema = /* GraphQL */ `
  type Project {
    id: Int!
    name: String!
    tasks: [Task!]!
  }

  type Task {
    id: Int!
    projectId: Int!
    title: String!
    done: Boolean!
    dueDate: String
  }

  type Query {
    projects: [Project!]!
    project(id: Int!): Project
    tasks(projectId: Int): [Task!]!
  }

  type Mutation {
    createTask(projectId: Int!, title: String!): Task!
    toggleTask(id: Int!): Task
    deleteTask(id: Int!): Task
  }
`

const resolvers = {
  Query: {
    projects: () => projects,
    project: (_: unknown, { id }: { id: number }) => projects.find((p) => p.id === id) ?? null,
    tasks: (_: unknown, { projectId }: { projectId?: number }) =>
      projectId === undefined ? tasks : tasks.filter((t) => t.projectId === projectId),
  },
  // Field resolver: runs once PER project in the result – the classic
  // N+1 shape. Harmless on in-memory arrays; against a database this is
  // where DataLoader / mercurius loaders come in.
  Project: {
    tasks: (project: { id: number }) => tasks.filter((t) => t.projectId === project.id),
  },
  Mutation: {
    createTask: (_: unknown, { projectId, title }: { projectId: number; title: string }) => {
      if (!projects.some((p) => p.id === projectId)) {
        throw new Error(`Project ${projectId} does not exist`)
      }
      const task: Task = { id: nextId(), projectId, title, done: false }
      tasks.push(task)
      return task
    },
    toggleTask: (_: unknown, { id }: { id: number }) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return null
      task.done = !task.done
      return task
    },
    // Exercise 6 solution: deleteTask mutation
    deleteTask: (_: unknown, { id }: { id: number }) => {
      const index = tasks.findIndex((t) => t.id === id)
      if (index === -1) return null
      const [removed] = tasks.splice(index, 1)
      return removed
    },
  },
}

export async function registerGraphql(app: FastifyInstance) {
  await app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true, // → http://localhost:3000/graphiql
  })
}
