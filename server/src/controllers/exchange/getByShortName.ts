import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { exchangeSchema } from '@server/entities/exchange'
import { exchangeRepository } from '../../repositories/exchangeRepository'

export default authenticatedProcedure
  .use(provideRepos({ exchangeRepository }))
  .input(
    exchangeSchema.pick({
      shortName: true,
    })
  )
  .query(async ({ input: exchangeData, ctx: { repos } }) => {
    const exchangeReturned = await repos.exchangeRepository.findByShortName(
      exchangeData.shortName
    )

    return exchangeReturned
  })
