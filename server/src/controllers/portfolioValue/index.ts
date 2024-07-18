import { router } from '@server/trpc'
import getTotalValue from './getTotalValue'
import getAssetsTypeValue from './getAssetsTypeValue'
import getAssetValue from './getAssetValue'

export default router({
  getTotalValue,
  getAssetsTypeValue,
  getAssetValue,
})
