import { router } from '@server/trpc'
import create from './create'
import get from './get'
import update from './update'
import remove from './remove'
import getFull from './getFull'

export default router({
  create,
  get,
  update,
  remove,
  getFull,
})
