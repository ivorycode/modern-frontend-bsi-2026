import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  ErrorSchema,
  NewTaskSchema,
  ProjectListSchema,
  ProjectSchema,
  TaskListSchema,
  TaskSchema,
  type Task,
} from './schemas.js'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { nextId, projects, tasks } from './data.js'
import { registerGraphql } from './graphql.js'
import { appRouter } from './router.js'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function buildApp() {
  const app = Fastify()

  await app.register(cors, {
    origin: true,
    // @fastify/cors only allows GET/HEAD/POST by default – the browser's
    // preflight would block PATCH and DELETE without this.
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Task Board API',
        description: 'Gemeinsames Backend für die Client-Server-Demos',
        version: '1.0.0',
      },
    },
    // The GraphQL (/graphql, /graphiql) and tRPC (/trpc/*) routes carry no
    // Zod route schemas – skip them in the Zod→JSON-schema transform and
    // keep the OpenAPI spec REST-only.
    transform: (data) =>
      data.url.startsWith('/graph') || data.url.startsWith('/trpc')
        ? { schema: { hide: true }, url: data.url }
        : jsonSchemaTransform(data),
    transformObject: jsonSchemaTransformObject,
  })

  // The REST routes live in their own plugin scope: the Zod validator/
  // serializer compilers apply only here, so they don't interfere with the
  // GraphQL route (mercurius brings its own validation).
  await app.register(async (instance) => {
    const rest = instance.withTypeProvider<ZodTypeProvider>()
    rest.setValidatorCompiler(validatorCompiler)
    rest.setSerializerCompiler(serializerCompiler)

    rest.get('/projects', {
      schema: {
        operationId: 'listProjects',
        response: { 200: ProjectListSchema },
      },
      handler: () => projects,
    })

    rest.get('/projects/:id', {
      schema: {
        operationId: 'getProject',
        params: z.object({ id: z.coerce.number().int() }),
        response: { 200: ProjectSchema, 404: ErrorSchema },
      },
      handler: (request, reply) => {
        const project = projects.find((p) => p.id === request.params.id)
        if (!project) {
          reply.code(404)
          return { message: `Project ${request.params.id} not found` }
        }
        return project
      },
    })

    rest.get('/tasks', {
      schema: {
        operationId: 'listTasks',
        querystring: z.object({
          projectId: z.coerce.number().int().optional(),
          // Artificial delay in ms – used by the demos to make loading
          // states and streaming visible (e.g. /tasks?delay=1500).
          delay: z.coerce.number().int().min(0).max(5000).optional(),
        }),
        response: { 200: TaskListSchema },
      },
      handler: async (request) => {
        const { projectId, delay } = request.query
        if (delay) await sleep(delay)
        return projectId === undefined ? tasks : tasks.filter((t) => t.projectId === projectId)
      },
    })

    rest.post('/tasks', {
      schema: {
        operationId: 'createTask',
        body: NewTaskSchema,
        response: { 201: TaskSchema, 400: ErrorSchema },
      },
      handler: (request, reply) => {
        if (!projects.some((p) => p.id === request.body.projectId)) {
          reply.code(400)
          return { message: `Project ${request.body.projectId} does not exist` }
        }
        const task: Task = { id: nextId(), done: false, ...request.body }
        tasks.push(task)
        reply.code(201)
        return task
      },
    })

    rest.patch('/tasks/:id/toggle', {
      schema: {
        operationId: 'toggleTask',
        params: z.object({ id: z.coerce.number().int() }),
        response: { 200: TaskSchema, 404: ErrorSchema },
      },
      handler: (request, reply) => {
        const task = tasks.find((t) => t.id === request.params.id)
        if (!task) {
          reply.code(404)
          return { message: `Task ${request.params.id} not found` }
        }
        task.done = !task.done
        return task
      },
    })
    // Exercise 1 solution: DELETE /tasks/:id
    rest.delete('/tasks/:id', {
      schema: {
        operationId: 'deleteTask',
        params: z.object({ id: z.coerce.number().int() }),
        response: { 200: TaskSchema, 404: ErrorSchema },
      },
      handler: (request, reply) => {
        const index = tasks.findIndex((t) => t.id === request.params.id)
        if (index === -1) {
          reply.code(404)
          return { message: `Task ${request.params.id} not found` }
        }
        const [removed] = tasks.splice(index, 1)
        return removed
      },
    })
  })

  await registerGraphql(app)

  // tRPC as a third contract style over the same data (see router.ts).
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter },
  })

  return app
}
