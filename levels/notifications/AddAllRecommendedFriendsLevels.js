const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { sleepProm } = require('../../helpers/sleepProm')

class AddAllRecommendedFriendsLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'AddAllRecommendedFriendsLevels'

// Checking if notifications window is opened...
levels.push(require('./AcceptAllFriendsLevels')[0])

levels.push(
  LevelsFactory(2, AddAllRecommendedFriendsLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding recommended friends...`)

    const found = await args.browser.evaluate(() => {
      const matchingDivs = Array.from(document.querySelectorAll('div.notif_media')).filter((div) =>
        div.innerText.includes('Новый рекомендуемый друг'),
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
      consoleLog(`friend approved`)
      await sleepProm(5000)
      return false
    }

    consoleLog(`no recommended friends found`)

    return true
  }),
)

module.exports = levels
