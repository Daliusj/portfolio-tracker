import type {
  Services,
  ServicesFactories,
  ServicesKeys,
} from '@server/services'
import { middleware } from '..'

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

const none: Partial<Services> = {}

/**
 * Middleware that provides services for the specified entities in the context.
 * @param servicesFactoriesWanted An object containing the entities for which services are wanted.
 * @returns A middleware function that provides the service in the context.
 */
export default function provideServices<TKeys extends ServicesKeys>(
  servicesFactoriesWanted: Pick<ServicesFactories, TKeys>
) {
  return middleware(({ ctx, next }) => {
    const servicesAlreadyProvided = ctx.services || none

    const servicesWantedTuples = Object.entries(
      servicesFactoriesWanted
    ) as Entries<Pick<ServicesFactories, TKeys>>

    const servicesWanted = Object.fromEntries(
      servicesWantedTuples.map(([key, servicesFactory]) => [
        key,
        // Accept a repo injected through tests or create a new instance.
        // This is not optimized for performance to create new instances,
        // but it's fine for demonstration purposes.
        servicesAlreadyProvided[key] || servicesFactory(ctx.db, ctx.fmp),
      ])
    ) as Pick<Services, TKeys>

    return next({
      ctx: {
        repos: {
          ...servicesAlreadyProvided,
          ...servicesWanted,
        },
      },
    })
  })
}
