const LevelsFactory = require('../classes/LevelsFactory')
const { globalLevelsExecute } = require('../helpers/globalLevelsExecute')
const { sleepProm } = require('../helpers/sleepProm')
const { generatePassword } = require('../helpers/generatePassword')

class ChangePasswordLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'ChangePasswordLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, ChangePasswordLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Cheking that we are on password page...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {
      const element = document.querySelector('input[name="st.password.oldPassword"]')

      if (element) {
        return true
      }

      return false
    })

    if (!res) {
      consoleLog(`old password field not found`)
      return false
    }

    if (!args.browser.getCurrentUrl().includes('/settings/password')) {
      consoleLog(`url not includes /settings/password`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, ChangePasswordLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Typing old password...`)

    await sleepProm(3000)

    let row = await global.db.getrow('SELECT password FROM bots_data WHERE id=?', [global.botId])

    let oldPassword = null

    if (row !== undefined && 'password' in row) {
      oldPassword = row.password.trim()
    } else {
      throw new Error(`password not found or empty`)
    }

    await args.browser.type('input[name="st.password.oldPassword"]', oldPassword)

    return true
  }),
)

levels.push(
  LevelsFactory(3, ChangePasswordLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Typing new password...`)

    await sleepProm(3000)

    const newPassword = generatePassword()
    consoleLog(`generated password: ${newPassword}`)
    
    await args.browser.type('input[name="st.password.newPassword"]', newPassword)

    await sleepProm(3000)

    await args.browser.type('input[name="st.password.retypePassword"]', newPassword)

    args.newPassword = newPassword

    return true
  }),
)

levels.push(
  LevelsFactory(4, ChangePasswordLevels, levelsName, async (args) => {
    consoleLog('Level 4 custom logic')
    consoleLog(`Pressing change button...`)

    await sleepProm(3000)

    await args.browser.click('input[value="Сохранить"][data-l="t,submit"]')
    
    await sleepProm(5000)

    return true
  }),
)

levels.push(
  LevelsFactory(5, ChangePasswordLevels, levelsName, async (args) => {
    consoleLog('Level 5 custom logic')
    consoleLog(`Checking we are not on the password page...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {
      const element = document.querySelector('input[name="st.password.oldPassword"]')

      if (element) {
        return true
      }

      return false
    })

    if (res) {
      consoleLog(`we are still on password page...`)
      return false
    }

    if (args.browser.getCurrentUrl().includes('/settings/password')) {
      consoleLog(`url includes /settings/password`)
      return false
    }

    consoleLog(`updating in bots_data new password ${args.newPassword} for bot id ${global.botId}`)

    await global.db.update('UPDATE bots_data SET password=? WHERE id=?', [args.newPassword, global.botId])

    await sleepProm(10000)

    return true
  }),
)

module.exports = levels
