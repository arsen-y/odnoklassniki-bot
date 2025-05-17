const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')

class OpenUnreadDialogLevels {
  async handle(args) {
    let res = await args.browser.evaluate(() => {
      const element = document.querySelector('msg-button[data-l*="scrollToBottom"]')
      if (element) {
        element.click()
        return true
      }
      return false
    })

    if (res) {
      consoleLog(`found chat scroll to bottom button, clicked...`)
      await sleepProm(5000)
    }

    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'OpenUnreadDialogLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, OpenUnreadDialogLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching unread dialog and opening it...`)

    await sleepProm(5000)

    if (!(await args.browser.getElem('div[data-tsid="conversation_name"].title-okmsg.unread-okmsg'))) {
      console.log(`unread dialog not found`)
      return false
    }

    await args.browser.click('div[data-tsid="conversation_name"].title-okmsg.unread-okmsg')

    await sleepProm(5000)

    const id = await args.browser.evaluate(() => {
      const element = document.querySelector('msg-chat-item-container msg-avatar')

      if (!element || !element.id) {
        return false
      }

      return element.id
    })

    if (!id) {
      consoleLog(`user id we are talking with not found`)
      args.interlocutorId = null
      return false
    }

    consoleLog(`scrolling to dialog bottom...`)

    await args.browser.evaluate(() => {
      const scroller = document.querySelector('.scroller-okmsg')
      const maxScrollTop = scroller.scrollHeight - scroller.clientHeight
      scroller.scrollTop = maxScrollTop
    })

    if(id < 0) {
      consoleLog(`group dialog, passing it...`)
      return false
    }

    await sleepProm(3000)

    args.interlocutorId = id

    return true
  }),
)

module.exports = levels
