const { describe, test, expect, beforeEach, afterEach } = require('@playwright/test')

describe('phonebook app', () => {
  beforeEach( async({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'root root',
        username: 'root',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  const loginInfo = {
    username: 'root',
    password: 'salainen'
  }

  test('home page can be opened', async ({ page }) => {
    const locator = page.getByText('Phone book')
    await expect(locator).toBeVisible()
    await expect(page.getByText('people')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByPlaceholder('Username').fill(loginInfo.username)
    await page.getByPlaceholder('Password').fill(loginInfo.password)

    await page.getByTestId('confirmLogin').click()
    await expect(page.getByText('phonebook')).toBeVisible()
    // make sure to log out
    await page.getByRole('button', { name: 'log out' }).click()
  })

})

describe('when user login add and remove person are possible', () => {
  beforeEach( async({ request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'root root',
        username: 'root',
        password: 'salainen'
      }
    })
  })

  beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('toLogin').click()
    await page.getByPlaceholder('Username').fill(loginInfo.username)
    await page.getByPlaceholder('Password').fill(loginInfo.password)

    await page.getByTestId('confirmLogin').click()
  })

  afterEach(async ({ page }) => {
    // make sure to log out
    await page.getByRole('button', { name: 'log out' }).click()
  })

  const loginInfo = {
    username: 'root',
    password: 'salainen'
  }
  const newPerson = {
    name:'joe star',
    number: '02-123456789',
    note: 'deep talk about jojo seasson6'
  }


  test('login user can add new person to their phonebook',async ({ page }) => {

    await page.getByTestId('name').fill(newPerson.name)
    await page.getByTestId('number').fill(newPerson.number)

    await page.getByRole('button', { name: 'Add people' }).click()
    await expect(page.getByText(newPerson.number)).toBeVisible()
  })

  test('login use can remove person from their phonebook', async ({ page }) => {
    //add one people
    await page.getByTestId('name').fill(newPerson.name)
    await page.getByTestId('number').fill(newPerson.number)
    await page.getByRole('button', { name: 'Add people' }).click()
    await expect(page.getByText(newPerson.name)).toBeVisible()

    page.on('dialog', dialog => dialog.accept())
    await page.getByTestId(`delete${newPerson.name}${newPerson.number}`).click()
    await page.getByRole('button', { name: 'ok' }).click()

    await expect(page.getByText(newPerson.name)).toHaveCount(0)
  })
})