import { router } from '../trpc'
import user from './user'
import portfolio from './portfolio'
import historicalData from './historicalData'
import portfolioItem from './portfolioItem'
import asset from './asset'
import portfolioValue from './portfolioValue'

export const appRouter = router({
  user,
  portfolio,
  historicalData,
  portfolioItem,
  asset,
  portfolioValue,
})

export type AppRouter = typeof appRouter
