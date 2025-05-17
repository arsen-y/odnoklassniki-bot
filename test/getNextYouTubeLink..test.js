const { getNextYouTubeLink } = require('../helpers/getNextYouTubeLink')
const Db = require('mysql2-async').default
const dotenv = require('dotenv')

// Загружаем переменные окружения
dotenv.config()

global.db = new Db({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  skiptzfix: true,
})

beforeAll(async () => {
  console.log(`start testing getNextYouTubeLink function`)
})

afterAll(async () => {
  console.log(`end testing getNextYouTubeLink function`)
})

describe('getNextYouTubeLink', () => {
  test('должна возвращать YouTube ссылки', async () => {
    for (let i = 0; i < 10; i++) {
      const link = await getNextYouTubeLink()
      expect(link).toContain('youtube.com')
    }
  })

  test('должна возвращать различные YouTube ссылки в пределах цикла', async () => {
    const numberOfVideoIds = 10
    const linksFirstCycle = []

    // Получаем ссылки в первом цикле
    for (let i = 0; i < numberOfVideoIds; i++) {
      const link = await getNextYouTubeLink()
      expect(link).toContain('youtube.com')
      linksFirstCycle.push(link)
    }

    console.debug('linksFirstCycle', linksFirstCycle)

    // Проверяем, что все ссылки уникальны
    const uniqueLinksFirstCycle = new Set(linksFirstCycle)

    console.debug('uniqueLinksFirstCycle', uniqueLinksFirstCycle)

    expect(uniqueLinksFirstCycle.size).toBe(numberOfVideoIds)

  })
})
