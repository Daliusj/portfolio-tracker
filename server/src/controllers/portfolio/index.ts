import { router } from '@server/trpc'
import create from './create'
import get from './get'

export default router({
  create,
  get,
})
