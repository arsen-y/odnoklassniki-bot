const LevelsFactory = require('../../classes/LevelsFactory')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'ScrollToFirstMessageLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Scrolling to first message...`)

    await sleepProm(3000)

    if (!(await args.browser.getElem('msg-message'))) {
      console.log(`no messages found`)
      return true
    }

    args.totalMsgCount = await args.browser.evaluate(() => {
      const messageElements = document.querySelectorAll('msg-message')

      if (!messageElements) {
        return 0
      }

      return messageElements.length
    })

    await args.browser.evaluate(() => {
      const container = document.querySelector('.scroller-okmsg')
      if (container) {
        container.scrollTop = 0
      }
    })

    await sleepProm(3000)

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Checking the msg count...`)

    await sleepProm(5000)

    let newTotalMsgCount = await args.browser.evaluate(() => {
      const messageElements = document.querySelectorAll('msg-message')

      if (!messageElements) {
        return 0
      }

      return messageElements.length
    })

    if (newTotalMsgCount >= 69) {
      // максимальное количество сообщений, на которое пркоручиваем
      return true
    }

    if (newTotalMsgCount == args.totalMsgCount) {
      // новые сообщения больше не подгружаются
      return true
    }

    await args.browser.evaluate(() => {
      const container = document.querySelector('.scroller-okmsg')
      if (container) {
        container.scrollTop = 0
      }
    })

    await sleepProm(5000)

    args.totalMsgCount = newTotalMsgCount

    return false
  }),
)

module.exports = levels
