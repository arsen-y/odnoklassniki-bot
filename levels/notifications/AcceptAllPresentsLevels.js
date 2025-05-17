const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { sleepProm } = require('../../helpers/sleepProm')

class AcceptAllPresentsLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'AcceptAllPresentsLevels'

// Checking if notifications window is opened...
levels.push(require('./AcceptAllFriendsLevels')[0])

levels.push(
  LevelsFactory(2, AcceptAllPresentsLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding presents...`)

    const found = await args.browser.evaluate(() => {
      const matchingDivs = Array.from(document.querySelectorAll('div.notif_media')).filter(
        (div) => div.innerText.includes('открытку') || div.innerText.includes('подарок')
      )

      matchingDivs.forEach((elem) => {
        let button = elem.querySelector('button[data-l="t,btn_accept"][name="ACCEPT"]')

        if (button) {
          const spanPrivatePresent = Array.from(elem.querySelectorAll('span')).filter((span) =>
            span.innerText.includes('Принять как приватный'),
          )

          if (spanPrivatePresent.length == 1) {
            spanPrivatePresent[0].click()
          }

          button.click()

          return true
        }
      })

      return false
    })

    if (found) {
      consoleLog(`present accepted`)
      await sleepProm(3000)
      return false
    }

    consoleLog(`no presents found`)

    return true
  }),
)

module.exports = levels
