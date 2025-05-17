const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { waitForEnter } = require('../../helpers/waitForEnter')

class AcceptAllFriendsLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'AcceptAllFriendsLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, AcceptAllFriendsLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Checking if notifications window is opened...`)

    await sleepProm(1000)

    if (!args.browser.getCurrentUrl().includes('/notifications')) {
      consoleLog(`opening notifications window...`)

      await args.browser.click('button[role="button"][aria-label="Оповещения"]')
      await args.browser.waitForSelector('.notifs_header')
      await args.browser.hover('.notifs_header')
      await sleepProm(3000)

      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, AcceptAllFriendsLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding friends requests...`)

    await sleepProm(1000)

    const found = await args.browser.evaluate(() => {
      const matchingDivs = Array.from(document.querySelectorAll('div.notif_media')).filter((div) =>
        div.innerText.includes('хочет с вами подружиться'),
      )

      matchingDivs.forEach((elem) => {
        let button = elem.querySelector('button[data-l="t,btn_accept"][name="ACCEPT"]')

        if (button) {
          button.click()
          return true
        }
      })

      return false
    })

    if (found) {
      consoleLog(`approve friend button found and clicked`)
      await sleepProm(3000)
      return false
    }

    consoleLog(`no friends requests found`)

    return true
  }),
)

module.exports = levels
