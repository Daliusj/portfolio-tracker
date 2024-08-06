import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
import { getStoredAccessToken } from '@/utils/auth'
import SuperJSON from 'superjson'

export const trpc = createTRPCReact<AppRouter>()
export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,
      async headers() {
        const token = getStoredAccessToken(localStorage)
        if (!token) return {}
        return {
          Authorization: `Bearer ${token}`,
        }
      },
    }),
  ],
})
