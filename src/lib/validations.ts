import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']).default('ACTIVE'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  deadline: z.date().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  deadline: z.date().optional(),
  projectId: z.string().optional(),
  parentId: z.string().optional(),
})

export const timeEntrySchema = z.object({
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  taskId: z.string().min(1, 'Task ID is required'),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type TimeEntryFormData = z.infer<typeof timeEntrySchema>
