import { withError } from './error'
import { describe, it, expect, vi } from 'vitest'

describe('withError', () => {
  it('should call the provided function and return its result if no error occurs', async () => {
    const setErrorMessage = vi.fn()
    const fn = vi.fn(async () => 42)
    const wrappedFn = withError(setErrorMessage, fn)

    const result = await wrappedFn()

    expect(result).toBe(42)
    expect(fn).toHaveBeenCalled()
    expect(setErrorMessage).toHaveBeenCalledWith('')
  })

  it('should set the error message if an error occurs', async () => {
    const setErrorMessage = vi.fn()
    const fn = vi.fn(async () => {
      throw new Error('Yikes!')
    })
    const wrappedFn = withError(setErrorMessage, fn)

    await expect(wrappedFn()).resolves.not.toThrow()
    expect(fn).toHaveBeenCalled()
    expect(setErrorMessage).toHaveBeenCalledWith('Yikes!')
  })

  it('should re-throw the error if doRethrow is true', async () => {
    const setErrorMessage = vi.fn()
    const fn = vi.fn(async () => {
      throw new Error('Yikes!')
    })
    const wrappedFn = withError(setErrorMessage, fn, true)

    await expect(wrappedFn()).rejects.toThrow('Yikes!')
    expect(fn).toHaveBeenCalled()
    expect(setErrorMessage).toHaveBeenCalledWith('Yikes!')
  })

  it('should use the default error message if the error is not an instance of Error', async () => {
    const setErrorMessage = vi.fn()
    const fn = vi.fn(async () => {
      throw 'Yikes!'
    })
    const wrappedFn = withError(setErrorMessage, fn)

    await expect(wrappedFn()).resolves.not.toThrow()
    expect(fn).toHaveBeenCalled()
    expect(setErrorMessage).toHaveBeenCalledWith('Something went wrong.')
  })

  it('should use the error message if the error is an instance of Error', async () => {
    const setErrorMessage = vi.fn()
    const fn = vi.fn(async () => {
      throw new Error('Yikes!')
    })
    const wrappedFn = withError(setErrorMessage, fn)

    await expect(wrappedFn()).resolves.not.toThrow()
    expect(fn).toHaveBeenCalled()
    expect(setErrorMessage).toHaveBeenCalledWith('Yikes!')
  })
})
