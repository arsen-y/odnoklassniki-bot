const LevelsFactory = require('../../classes/LevelsFactory')
const { getSelector } = require('../../helpers/htmlCommon')
const { deleteMessage } = require('../../helpers/messages')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'DeleteMessagesLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching msg element...`)

    await sleepProm(3000)

    if (!(await args.browser.getElem('msg-message'))) {
      console.log(`no messages found`)
      return true
    }

    const lastMsgSel = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        const elements = document.querySelectorAll('msg-message')

        if (!elements || !elements.length) {
          return false
        }

        return getSelector(elements[elements.length - 1])
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!lastMsgSel) {
      console.log(`done`)
      return true
    }

    await args.browser.hover(lastMsgSel)

    await sleepProm(3000)

    await deleteMessage(args)

    //await args.browser.reloadPage()

    return false
  }),
)


module.exports = levels
