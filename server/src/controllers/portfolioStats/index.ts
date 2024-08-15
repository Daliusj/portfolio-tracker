import { router } from '@server/trpc'
import getAssetsStats from './getAssetsStats'
import getPortfolioStats from './getPortfolioStats'

export default router({
  getAssetsStats,
  getPortfolioStats,
})
