/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error
export const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string) || window.location.origin
// @ts-expect-error
export const apiPath = (import.meta.env.VITE_API_PATH as string) || '/api/v1/trpc'
export const apiBase = `${apiOrigin}${apiPath}`

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
