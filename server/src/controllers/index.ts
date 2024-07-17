import { router } from '../trpc'
import user from './user'
import portfolio from './portfolio'

export const appRouter = router({
  user,
  portfolio,
})

export type AppRouter = typeof appRouter
