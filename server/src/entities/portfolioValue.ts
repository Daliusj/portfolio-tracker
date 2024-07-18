import { z } from 'zod'
import { idSchema } from './shared'
import { INVESTMENT_TYPES } from './asset'

export const portfolioValueSchema = z.object({
  portfolioId: idSchema,
  type: z.enum(INVESTMENT_TYPES),
  assetId: idSchema,
})
