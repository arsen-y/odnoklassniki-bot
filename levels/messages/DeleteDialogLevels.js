const LevelsFactory = require('../../classes/LevelsFactory')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'DeleteDialogLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching and clicking on msg-chat-item-container...`)

    await sleepProm(3000)

    const found = await args.browser.evaluate(() => {
      const element = document.querySelector('msg-chat-item-container')

      if (element) {
        element.click()
        return true
      }

      return false
    })

    if (!found) {
      console.log(`msg-chat-item-container not found`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Searching and clicking on "remove chat" button...`)

    await sleepProm(3000)

    const found = await args.browser.evaluate(() => {
      const element = document.querySelector('msg-l10n[key="remove-chat"][data-type="DIALOG"]')

      if (element) {
        element.click()
        return true
      }

      return false
    })

    if (!found) {
      console.log(`"remove chat" button not found`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(3, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Searching and clicking on confirm button...`)

    await sleepProm(3000)

    const found = await args.browser.evaluate(() => {
      const element = Array.from(document.querySelectorAll('button[data-tsid="confirm-primary"][type="button"]')).find(
        (el) => el.innerText.trim() === 'Удалить',
      )

      if (element) {
        element.click()
        return true
      }

      return false
    })

    if (!found) {
      console.log(`confirm button not found`)
      return false
    }

    await sleepProm(3000)
    
    return true
  }),
)

module.exports = levels
