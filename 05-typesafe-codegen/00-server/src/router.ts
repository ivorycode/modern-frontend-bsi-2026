import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { nextId, projects, tasks } from './data.js'
import { NewTaskSchema, type Task } from './schemas.js'

// tRPC: the contract IS the code. The client (15-trpc) imports this
// router's TYPE only – no spec, no codegen, end-to-end type inference.
// Note that the same Zod schemas that drive the OpenAPI spec also validate
// the tRPC inputs at runtime.

const t = initTRPC.create()

export const appRouter = t.router({
  projects: t.procedure.query(() => projects),

  tasks: t.procedure
    .input(z.object({ projectId: z.int().optional() }))
    .query(({ input }) =>
      input.projectId === undefined
        ? tasks
        : tasks.filter((task) => task.projectId === input.projectId),
    ),

  createTask: t.procedure.input(NewTaskSchema).mutation(({ input }) => {
    if (!projects.some((project) => project.id === input.projectId)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Project ${input.projectId} does not exist`,
      })
    }
    const task: Task = { id: nextId(), done: false, ...input }
    tasks.push(task)
    return task
  }),

  toggleTask: t.procedure.input(z.object({ id: z.int() })).mutation(({ input }) => {
    const task = tasks.find((candidate) => candidate.id === input.id)
    if (!task) {
      throw new TRPCError({ code: 'NOT_FOUND', message: `Task ${input.id} not found` })
    }
    task.done = !task.done
    return task
  }),

  // Exercise 4 solution: deleteTask procedure
  deleteTask: t.procedure.input(z.object({ id: z.int() })).mutation(({ input }) => {
    const index = tasks.findIndex((candidate) => candidate.id === input.id)
    if (index === -1) {
      throw new TRPCError({ code: 'NOT_FOUND', message: `Task ${input.id} not found` })
    }
    const [removed] = tasks.splice(index, 1)
    return removed
  }),
})

// The ONLY thing the client imports – and it's just a type.
export type AppRouter = typeof appRouter
