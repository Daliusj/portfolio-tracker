import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { User } from '@server/database/types'
import { idSchema } from './shared'

export const userSchema = z.object({
  id: idSchema,
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long'),
  userName: z.string().min(3, 'Too short user name').max(500),
  createdAt: z.date().default(() => new Date()),
})

export const userKeysAll = Object.keys(userSchema.shape) as (keyof User)[]

// list keys that we will return to the client
export const userKeysPublic = ['id', 'userName'] as const
export type UserPublic = Pick<Selectable<User>, (typeof userKeysPublic)[number]>

// a specific schema for authenticated user that is used in JWT
export const authUserSchema = userSchema.pick({ id: true })
export type AuthUser = z.infer<typeof authUserSchema>
