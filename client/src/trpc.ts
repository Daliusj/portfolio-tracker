import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@server/shared/trpc'

export const trpc = createTRPCReact<AppRouter>()
