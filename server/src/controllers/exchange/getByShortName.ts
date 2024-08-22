import provideRepos from '@server/trpc/provideRepos'
import { exchangeSchema } from '@server/entities/exchange'
import { publicProcedure } from '@server/trpc'
import { exchangeRepository } from '../../repositories/exchangeRepository'

export default publicProcedure
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
