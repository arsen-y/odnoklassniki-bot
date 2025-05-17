const LevelsFactory = require('../../classes/LevelsFactory')
const { getNextYouTubeLink } = require('../../helpers/getNextYouTubeLink')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')

class PostVideoOnTheWallLevelsV2 {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'PostVideoOnTheWallLevelsV2'

// Checking that we are on the own profile page...
levels.push(require('./CleanWallLevels')[0])

levels.push(
  LevelsFactory(2, PostVideoOnTheWallLevelsV2, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding existing records on the own wall...`)

    await sleepProm(3000)

    await args.browser.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    })

    await sleepProm(2000)

    let found = await args.browser.evaluate(() => {
      const divsWithFeedId = document.querySelectorAll('div[data-feed-id]')

      if (!divsWithFeedId) {
        return false
      }

      for (rec of divsWithFeedId) {
        if (
          rec.innerText.includes('some text') ||
          rec.innerText.includes('some text 2')
        ) {
          return true
        }
      }

      return false
    })

    if (found) {
      throw new Error(`video already posted`)
    }

    return true
  }),
)

levels.push(
  LevelsFactory(3, PostVideoOnTheWallLevelsV2, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Pressing publish button...`)

    await sleepProm(3000)

    const found = await args.browser.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button[data-l="t,pf_dropdown"]')).find(
        (btn) => btn.innerText.trim() === 'Опубликовать',
      )

      if (button) {
        button.click()
        return true
      }

      return false
    })

    if (!found) {
      consoleLog(`publish button not found`)
      return false
    }

    await sleepProm(5000)

    return true
  }),
)

levels.push(
  LevelsFactory(4, PostVideoOnTheWallLevelsV2, levelsName, async (args) => {
    consoleLog('Level 4 custom logic')
    consoleLog(`Pressing record button...`)

    await sleepProm(3000)

    await args.browser.click('span[data-testid="ddm-menu-item"][role="menuitem"][data-l="t,feed.posting.ui.input"]')

    await sleepProm(5000)

    return true
  }),
)

levels.push(
  LevelsFactory(5, PostVideoOnTheWallLevelsV2, levelsName, async (args) => {
    consoleLog('Level 5 custom logic')
    consoleLog(`Typing post text...`)

    await sleepProm(3000)

    let videoLink = await getNextYouTubeLink()
    videoLink += ' '

    await args.browser.justType(`${videoLink} `)

    await sleepProm(5000)

    return true
  }),
)

levels.push(
  LevelsFactory(6, PostVideoOnTheWallLevelsV2, levelsName, async (args) => {
    consoleLog('Level 6 custom logic')
    consoleLog(`Pressing share button...`)

    await sleepProm(3000)

    const found = await args.browser.evaluate(() => {
      const button = document.querySelector('button[data-l="t,button.submit"][title="Поделиться"]')

      if (button) {
        button.click()
        return true
      }

      return false
    })

    if (!found) {
      consoleLog(`share button not found`)
      return false
    }

    await sleepProm(5000)

    return true
  }),
)

module.exports = levels
