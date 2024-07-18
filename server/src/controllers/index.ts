import { router } from '../trpc'
import user from './user'
import portfolio from './portfolio'
import historicalData from './historicalData'
import portfolioItem from './portfolioItem'

export const appRouter = router({
  user,
  portfolio,
  historicalData,
  portfolioItem,
})

export type AppRouter = typeof appRouter
