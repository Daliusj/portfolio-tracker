import { DEFAULT_SERVER_ERROR } from '@/consts'
import { TRPCClientError } from '@trpc/client'

/**
 * Calls the provided function and handles any errors that may occur.
 * If an error occurs, the error message is set to the provided `setErrorMessage` state setter.
 *
 * @param setErrorMessage - A function to set the error message state.
 * @param fn - The function to call.
 * @param doRethrow - Whether or not to re-throw the error after handling it.
 * @returns The result of the provided function, if no error occurred.
 * @throws The error that occurred, if `doRethrow` is `true`.
 */
export async function handleError<T>(
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  fn: () => Promise<T>,
  doRethrow = false
): Promise<T | undefined> {
  try {
    const result = await fn()

    // clear error message
    setErrorMessage('')

    return result
  } catch (error) {
    setErrorMessage(getErrorMessage(error))

    if (doRethrow) throw error
  }
}

/**
 * Wraps the provided function in a try/catch block and sets the error message to
 * the provided `setErrorMessage` state setter if an error occurs.
 */
export function withError<Args extends any[], Return>(
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  fn: (...args: Args) => Promise<Return>,
  doRethrow = false
): (...args: Args) => Promise<Return | undefined> {
  return (...args: Args) => handleError(setErrorMessage, () => fn(...args), doRethrow)
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return DEFAULT_SERVER_ERROR
  }

  if (!(error instanceof TRPCClientError)) {
    return error.message
  }

  return error.data.message || error.message
}
