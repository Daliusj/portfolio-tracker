import { router } from '@server/trpc'
import get from './get'
import getById from './getById'

export default router({
  get,
  getById,
})
