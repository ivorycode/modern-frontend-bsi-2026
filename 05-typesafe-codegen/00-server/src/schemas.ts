import { z } from 'zod'

// Single source of truth: these Zod schemas drive
//  1. runtime validation (Fastify validates requests/responses against them)
//  2. the backend TypeScript types (via z.infer)
//  3. the OpenAPI spec (via @fastify/swagger + fastify-type-provider-zod)

// The .meta({ id }) registers each schema under that name in
// components/schemas of the OpenAPI spec – like named DTOs in Java/.NET.
export const ProjectSchema = z
  .object({
    id: z.int().positive(),
    name: z.string().min(1),
  })
  .meta({ id: 'Project' })

export const TaskSchema = z
  .object({
    id: z.int().positive(),
    projectId: z.int().positive(),
    title: z.string().min(1),
    done: z.boolean(),
    dueDate: z.iso.date().optional(),
  })
  .meta({ id: 'Task' })

export const NewTaskSchema = TaskSchema.omit({ id: true, done: true }).meta({ id: 'NewTask' })

export const ProjectListSchema = z.array(ProjectSchema)
export const TaskListSchema = z.array(TaskSchema)

export const ErrorSchema = z.object({ message: z.string() }).meta({ id: 'Error' })

export type Project = z.infer<typeof ProjectSchema>
export type Task = z.infer<typeof TaskSchema>
export type NewTask = z.infer<typeof NewTaskSchema>
