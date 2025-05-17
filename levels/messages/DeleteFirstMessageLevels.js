const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'DeleteFirstMessageLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching msg element...`)

    await sleepProm(5000)

    if (!(await args.browser.getElem('msg-message'))) {
      console.log(`no messages found`)
      return true
    }

    // нам необходимо найти именно первое сообщение от бота

    const firstMsgSel = await args.browser.evaluate(
      ({ getSelectorFn, userId }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        // число, с которого должен начинаться атрибут data-item-id
        const targetPrefix = userId.toString()

        // Ищем все элементы <msg-message> в документе
        const messageElements = document.querySelectorAll('msg-message')

        if (!messageElements) {
          return false
        }

        for (msg of messageElements) {
          const itemId = msg.getAttribute('data-item-id')

          if (itemId && itemId.startsWith(targetPrefix)) {
            return getSelector(msg)
          }
        }

        return false
      },
      {
        getSelectorFn: getSelector.toString(),
        userId: global.botVars.profileId,
      },
    )

    if (!firstMsgSel) {
      consoleLog(`msg from bot profileId ${global.botVars.profileId} not found`)
      return false
    }

    await args.browser.hover(firstMsgSel)

    await sleepProm(3000)

    await args.browser.click('button[aria-label="Действия с сообщением"]')

    await sleepProm(3000)

    await args.browser.click('msg-menu-item[data-l="t,messageActionremove"]')

    await sleepProm(3000)

    await args.browser.click('button[data-tsid="confirm-primary"]')

    await sleepProm(5000)

    return true
  }),
)

module.exports = levels
