import { router } from '@server/trpc'
import getForDay from './getforDay'
import getForTimeRange from './getForTimeRange'

export default router({
  getForDay,
  getForTimeRange,
})
