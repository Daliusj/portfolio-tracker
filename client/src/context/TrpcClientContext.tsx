import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMessage } from './MessageContext'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { trpc } from '../trpc'
import { apiBase } from '@/config'
import { getStoredAccessToken } from '@/utils/auth'
import { httpBatchLink, TRPCClientError } from '@trpc/client'
import SuperJSON from 'superjson'

interface IError {
  code: string
  message: string
  issues?: IValidationError[]
}
interface IValidationError {
  validation?: string
  code: string
  message: string
  path?: string[]
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { setMessage } = useMessage()

  const handleTRPCError = (error: TRPCClientError<any>) => {
    if (error.data?.zodError && typeof error.data.zodError === 'string') {
      try {
        const zodError = JSON.parse(error.data.zodError)
        if (zodError && zodError.errors) {
          const errorMessages = zodError.errors
            .map((issue: any) => {
              switch (issue.path?.[0]) {
                case 'email':
                  return 'Invalid email address provided.'
                case 'password':
                  return 'Password must be at least 8 characters long.'
                default:
                  return issue.message || 'An unknown validation error occurred.'
              }
            })
            .join(' ')

          setMessage('error', errorMessages)
          return
        }
      } catch (e) {
        setMessage('error', error.data.zodError)
        return
      }
    }

    if (error.data?.issues && error.data.issues.length > 0) {
      const errorMessages = error.data.issues
        .map((issue) => {
          switch (issue.path?.[0]) {
            case 'email':
              return 'Invalid email address provided.'
            case 'password':
              return 'Password must be at least 8 characters long.'
            default:
              return issue.message || 'An unknown error occurred.'
          }
        })
        .join(' ')

      setMessage('error', errorMessages)
    } else {
      setMessage('error', error.message || DEFAULT_SERVER_ERROR)
    }
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => {
              handleTRPCError(error as TRPCClientError<any>)
            },
          },
          queries: {
            onError: (error) => {
              handleTRPCError(error as TRPCClientError<any>)
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
