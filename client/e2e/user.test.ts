import { test, expect } from '@playwright/test'
import { asUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const user = fakeUser()

test.describe.serial('signup and login sequence', () => {
  const URL_LOGGED_IN = '/'

  test('visitor can signup', async ({ page }) => {
    await page.goto('/signup')
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeHidden()

    await page.getByLabel('User name').fill(user.userName)
    await page.getByLabel('Your email').fill(user.email)
    await page.getByLabel('Your password').fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Signup' }).click()

    await expect(successMessage).toBeVisible()
  })

  test('visitor can not access dashboard before login', async ({ page }) => {
    await page.goto(URL_LOGGED_IN)

    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Your email').fill(user.email)
    await page.getByLabel('Your password').fill(user.password)
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page).toHaveURL(URL_LOGGED_IN)

    await page.reload()
    await expect(page).toHaveURL(URL_LOGGED_IN)
  })
})

test('visitor can logout', async ({ page }) => {
  const user = fakeUser()

  await asUser(page, user, async () => {
    await page.goto('/')
    const logoutLink = page.getByRole('button', { name: 'Logout' })

    await logoutLink.click()

    await expect(logoutLink).toBeHidden()

    await expect(page).toHaveURL('/login')

    await page.goto('/')
    await expect(logoutLink).toBeHidden()
    await expect(page).toHaveURL('/login')
  })
})
