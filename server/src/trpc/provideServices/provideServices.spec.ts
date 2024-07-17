import { z } from 'zod'
import { createCallerFactory, publicProcedure, router } from '..'
import provideServices from '.'

const db = {} as any
const fmp = {} as any
const portfolioValueServiceBuilder = vi.fn(() => {}) as any

const routes = router({
  testCall: publicProcedure
    .use(
      provideServices({ portfolioValueServices: portfolioValueServiceBuilder })
    )
    .input(z.object({}))
    .query(() => 'ok'),
})

afterEach(() => {
  vi.resetAllMocks()
})

it('provides services', async () => {
  const ctx = {
    db,
    fmp,
  }

  const caller = createCallerFactory(routes)
  const { testCall } = caller(ctx as any)

  expect(await testCall({})).toEqual('ok')
  expect(portfolioValueServiceBuilder).toHaveBeenCalledWith(db, fmp)
})

it('skips providing services if they are already in context', async () => {
  const ctx = {
    db,
    services: {
      portfolioValueServices: {},
    },
  }

  const caller = createCallerFactory(routes)
  const { testCall } = caller(ctx as any)

  expect(await testCall({})).toEqual('ok')
  expect(portfolioValueServiceBuilder).not.toHaveBeenCalled()
})
