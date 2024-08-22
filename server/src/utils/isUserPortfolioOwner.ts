import type { PortfolioRepository } from '@server/repositories/portfolioRepository'

/**
 * Checks if a portfolio belongs to the given user.
 *
 * This function verifies whether a portfolio identified by `portfolioId`
 * belongs to a user identified by `userId` by querying the repository
 * for all portfolios associated with the user and checking if the
 * specified portfolio is among them.
 * *
 * @param portfolioId - The ID of the portfolio to check.
 * @param userId - The ID of the user to verify ownership.
 * @param portfolioRepository - The repository instance to use for fetching portfolios.
 * @returns - A promise that resolves to `true` if the user owns the portfolio, `false` otherwise.
 *
 */
export async function isUserPortfolioOwner(
  portfolioId: number,
  userId: number,
  portfolioRepository: PortfolioRepository
) {
  const userPortfolios = await portfolioRepository.findByUserId(userId)
  return userPortfolios.map((portfolio) => portfolio.id).includes(portfolioId)
}
