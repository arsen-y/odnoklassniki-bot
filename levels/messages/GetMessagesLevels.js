const LevelsFactory = require('../../classes/LevelsFactory')
const { findNewMessagesText } = require('../../helpers/messages')
const { sleepProm } = require('../../helpers/sleepProm')
const { truncateText } = require('../../helpers/truncateText')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'GetMessagesLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching msg elements...`)

    await sleepProm(1000)

    let res = await args.browser.evaluate((userId) => {
      // число, с которого должен начинаться атрибут data-item-id
      const targetPrefix = userId.toString().trim()

      // Ищем все элементы <msg-message> в документе
      const messageElements = document.querySelectorAll('msg-message')

      if (!messageElements) {
        return { total: 0, found: 0 }
      }

      let found = 0
      let total = messageElements.length

      // Перебираем найденные элементы
      messageElements.forEach((element) => {
        const itemId = element.getAttribute('data-item-id')

        // Проверяем, начинается ли значение атрибута на нужное число
        if (itemId && !itemId.startsWith(targetPrefix)) {
          found += 1
        }
      })

      return { total, found }
    }, global.botVars.profileId)

    if (res.total <= 0) {
      consoleLog(`no messages found`)
      return false
    }

    if (res.found <= 0) {
      consoleLog(`no messages found with userId ${args.param1}`)
      return false
    }

    consoleLog(`found ${res.total} messages total, and ${res.found} with userId ${args.param1}`)

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Getting new msg text data...`)

    await sleepProm(1000)

    const collectedText = await args.browser.evaluate(
      ({ findNewMessagesTextFn, myUserId, interlocutorId }) => {
        const findNewMessagesText = new Function(`return (${findNewMessagesTextFn})`)()
        return findNewMessagesText(myUserId, interlocutorId)
      },
      {
        findNewMessagesTextFn: findNewMessagesText.toString(),
        myUserId: global.botVars.profileId,
        interlocutorId: args.param1,
      },
    )

    if (collectedText.length == 0) {
      consoleLog(`data is empty`)
      return false
    }

    consoleLog(`text data length=${collectedText.length}`)

    args.foundMsgText = truncateText(collectedText)

    return true
  }),
)

module.exports = levels
