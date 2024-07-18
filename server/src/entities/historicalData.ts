import { z } from 'zod'

export const historicalDataSchema = z.object({
  symbol: z.string().min(1).max(10),
  date: z.string().date(),
  dateFrom: z.string().date(),
  dateTo: z.string().date(),
})
