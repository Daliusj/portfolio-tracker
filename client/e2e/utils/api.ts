import { apiOrigin, apiPath } from './config'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { fakeUser } from './fakeData'
import type { Page } from '@playwright/test'
import superjson from 'superjson'

let accessToken: string | null = null

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${apiOrigin}${apiPath}`,

      headers: () => {
        return {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        }
      },
    }),
  ],
})

type UserLogin = Parameters<typeof trpc.user.login.mutate>[0]
type UserLoginAuthed = UserLogin & { id: number; accessToken: string }

/**
 * Logs in a new user by signing them up and logging them in with the provided
 * user login information.
 */
export async function loginNewUser(userLogin: UserLogin = fakeUser()): Promise<UserLoginAuthed> {
  try {
    await trpc.user.signup.mutate(userLogin)
  } catch (error) {
    // ignore cases when user already exists
  }

  const loginResponse = await trpc.user.login.mutate(userLogin)
  const userId = JSON.parse(atob(loginResponse.accessToken.split('.')[1])).user.id

  return {
    ...userLogin,
    id: userId,
    accessToken: loginResponse.accessToken,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
export async function asUser<T extends any>(
  page: Page,
  userLogin: UserLogin,
  callback: (user: UserLoginAuthed) => Promise<T>
): Promise<T> {
  // running independent tasks in parallel
  const [user] = await Promise.all([
    loginNewUser(userLogin),
    (async () => {
      if (page.url() === 'about:blank') {
        await page.goto('/')
        await page.waitForURL('/')
      }
    })(),
  ])

  accessToken = user.accessToken
  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )

  const callbackResult = await callback(user)

  await page.evaluate(() => {
    localStorage.removeItem('token')
  })
  accessToken = null

  return callbackResult
}
