import { router } from '@server/trpc'
import create from './create'
import get from './get'
import update from './update'
import remove from './remove'

export default router({
  create,
  get,
  update,
  remove,
})
