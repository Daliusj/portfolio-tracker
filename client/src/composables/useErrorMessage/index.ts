import { useState } from 'react'
import { withError } from './error'

/**
 * A custom hook that wraps a function with error handling logic.
 *
 * @param {T} fn - The original function to wrap with error handling logic.
 * @returns {[T, string, React.Dispatch<React.SetStateAction<string>>]} - A tuple containing the wrapped function,
 * the error message string, and the setter function for the error message.
 */
export default function useErrorMessage<
  Args extends unknown[],
  Return,
  T extends (...args: Args) => Promise<Return>,
>(
  fn: T
): [
  (...args: Args) => Promise<Return | undefined>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
] {
  const [errorMessage, setErrorMessage] = useState<string>('')

  return [withError(setErrorMessage, fn), errorMessage, setErrorMessage]
}
