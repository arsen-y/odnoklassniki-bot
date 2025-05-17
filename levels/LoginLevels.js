const LevelsFactory = require('../classes/LevelsFactory')
const { globalLevelsExecute } = require('../helpers/globalLevelsExecute')
const { sleepProm } = require('../helpers/sleepProm')

class LoginLevels {
  async handle(args) {
    consoleLog('parent handle')
    return true
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'LoginLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, LoginLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Cheking that we are on login page...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {
      const element = document.querySelector('input#field_email')

      if (element) {
        return true
      }

      return false
    })

    if (!res) {
      consoleLog(`email/phone field not found`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, LoginLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`typing login and password and pressing enter`)

    await sleepProm(3000)

    try {
      await args.browser.type('input#field_email', args.login)

      await sleepProm(3000)

      await args.browser.type('input#field_password', args.password)

      await sleepProm(3000)

      await args.browser.pressEnter()
    } catch (e) {
      consoleLog(`Exception: ${e.message}`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(3, LoginLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`searching nav menu (we should be logined)`)

    await sleepProm(10000)

    let res = false

    try {
      res = await args.browser.evaluate(() => {
        const element = document.querySelector('div[data-l="t,navigation"]')

        if (element) {
          return true
        }

        return false
      })
    } catch (e) {
      consoleLog(`Exception: ${e.message}`)
      return false
    }

    if (!res) {
      consoleLog(`nav menu not found`)
      return false
    }

    // подождём, чтобы точно успели обновиться куки
    await sleepProm(30000)

    return true
  }),
)

module.exports = levels
