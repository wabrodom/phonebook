const { describe, test, expect, beforeEach } = require('@playwright/test')


describe('phonebook main navigation', () => {
  const loginInfo = {
    username: 'root',
    password: 'somePassword'
  }

  test('home page can be opened', async ({ page }) => {
    await page.goto('/')

    const locator = page.getByText('Phone book')
    await expect(locator).toBeVisible()
    await expect(page.getByText('people')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByPlaceholder('Username').fill(loginInfo.username)
    await page.getByPlaceholder('Password').fill(loginInfo.password)

    await page.getByRole('button', { name: 'Log In' }).click()
    await expect(page.getByText(`${loginInfo.username} phonebook`)).toBeVisible()
  })

})

describe('add and remove person from phone book', () => {
  const loginInfo = {
    username: 'root',
    password: 'somePassword'
  }

  const newPerson = {
    name:'joe star',
    number: '02-123456789',
    note: 'deep talk about jojo season6'
  }
  beforeEach(async (page) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByPlaceholder('Username').fill(loginInfo.username)
    await page.getByPlaceholder('Password').fill(loginInfo.password)

    await page.getByRole('button', { name: 'Log In' }).click()
  })

  test('login user can add new person to they phonebook',async ({ page }) => {

    await page.getByTestId('name').fill(newPerson.name)
    await page.getByTestId('number').fill(newPerson.number)

    await page.getByRole('button', { name: 'Add people' }).click()
    await expect(page.getByText(newPerson.number)).toBeVisible()
  })

  test('login use can remove person from their phonebook', async ({ page }) => {
    page.getByTestId(`delete${newPerson.name}${newPerson.number}`).click()

    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'OK' }).click()
    await expect(page.getByText(newPerson.name)).toBeVisible()
  })
})