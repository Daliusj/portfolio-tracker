import { router } from '@server/trpc'
import get from './get'
import getAll from './getAll'

export default router({
  get,
  getAll,
})
