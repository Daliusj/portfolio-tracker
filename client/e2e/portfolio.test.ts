import { test, expect } from '@playwright/test'
import { asUser } from './utils/api'
import { fakePortfolio, fakeUser } from './utils/fakeData'

test.describe.serial('see portfolio', () => {
  const portfoliio = fakePortfolio()
  const user = fakeUser()
  test('user with no portfolios is redirected to create portfolio page and can create one', async ({
    page,
  }) => {
    await asUser(page, user, async () => {
      const successMessage = page.getByTestId('successMessage')
      await page.goto('/')
      await expect(page.getByText('You do not have a portfolio!')).toBeVisible()
      await page.getByPlaceholder('My Portfolio').fill(portfoliio.name)
      await page.getByLabel('EUR').click()
      await page.getByRole('button', { name: 'Create' }).click()
      const portfolioName = page.getByRole('button', { name: portfoliio.name })
      await expect(successMessage).toBeVisible()
      await expect(portfolioName).toBeVisible()
    })
  })

  test('user can edit his portfolio', async ({ page }) => {
    await asUser(page, user, async () => {
      await page.goto('/')
      await page.getByTestId('portfolio-menu').click()
      const editButton = page.getByRole('button', { name: 'Edit' })
      await expect(editButton).toBeVisible()
      await editButton.click()
      await expect(page.getByRole('heading', { name: 'Edit portfolio' })).toBeVisible()
      const portfolioName = 'PortfolioNew'
      await page.getByPlaceholder('My Portfolio').fill(portfolioName)
      await page.getByRole('button', { name: 'Update' }).click()
      await expect(page.getByRole('button', { name: portfolioName })).toBeVisible()
    })
  })

  test('user can add more portfolios', async ({ page }) => {
    await asUser(page, user, async () => {
      await page.goto('/')
      await page.getByTestId('portfolio-menu').click()
      const createButton = page.getByRole('button', { name: 'Create new' })
      await expect(createButton).toBeVisible()
      await createButton.click()
      await expect(page.getByRole('heading', { name: 'Create portfolio' })).toBeVisible()
      const portfolioName = 'PortfolioSecond'
      await page.getByPlaceholder('My Portfolio').fill(portfolioName)
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByRole('button', { name: portfolioName })).toBeVisible()
    })
  })

  test('user can delete portfolio', async ({ page }) => {
    await asUser(page, user, async () => {
      const successMessage = page.getByTestId('successMessage')
      await page.goto('/')
      await page.getByTestId('flowbite-dropdown-target').click()
      await page.getByRole('button', { name: 'PortfolioSecond' }).click()
      await page.getByTestId('portfolio-menu').click()
      const deleteButton = page.getByRole('button', { name: 'Delete' })
      await expect(deleteButton).toBeVisible()
      await deleteButton.click()
      const portfolioName = 'PortfolioSecond'
      await expect(page.getByRole('heading', { name: 'Are you sure you want to' })).toBeVisible()
      await page.getByRole('button', { name: 'Yes' }).click()
      await expect(successMessage).toBeVisible()
      await expect(page.getByRole('button', { name: portfolioName })).toBeHidden()
    })
  })
})
