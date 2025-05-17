const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { sleepProm } = require('../../helpers/sleepProm')

class LikeProfilePhotoLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'LikeProfilePhotoLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, LikeProfilePhotoLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Finding like profile photo button...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {
      const likeButton = document.querySelector('.widget_ico.ic_klass')

      if (likeButton) {
        return true
      }

      return false
    })

    if (!res) {
      consoleLog(`like button not found`)
      return false
    }

    consoleLog(`Found`)

    return true
  }),
)

levels.push(
  LevelsFactory(2, LikeProfilePhotoLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Clicking on it...`)

    await sleepProm(5000)

    await args.browser.hover('.widget_ico.ic_klass')

    return true
  }),
)

levels.push(
  LevelsFactory(3, LikeProfilePhotoLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Clicking on private like button...`)

    await sleepProm(3000)

    await args.browser.click('span.reaction_icw')

    await sleepProm(5000)

    return true
  }),
)

module.exports = levels
