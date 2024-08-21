import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMessage } from './MessageContext'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { trpc } from '../trpc'
import { apiBase } from '@/config'
import { getStoredAccessToken } from '@/utils/auth'
import { httpBatchLink, TRPCClientError } from '@trpc/client'
import SuperJSON from 'superjson'
import { TRPCError } from '@trpc/server'

type validationError = { message: string }

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { setMessage } = useMessage()

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setMessage('error', [error.message])
    }

    if (!(error instanceof TRPCError)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trpcError = error as TRPCClientError<any>
      try {
        const validationError = JSON.parse(trpcError.message)
        const validationErrorMessages = validationError.map(
          (error: validationError) => error.message
        )
        setMessage('error', validationErrorMessages)
      } catch {
        if (trpcError.message === 'Failed to fetch') setMessage('error', [DEFAULT_SERVER_ERROR])
        else {
          setMessage('error', [trpcError.message])
        }
      }
    }
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => {
              handleError(error)
            },
          },
          queries: {
            onError: (error) => {
              handleError(error)
            },
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

export default AppProvider
