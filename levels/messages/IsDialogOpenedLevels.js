const LevelsFactory = require('../../classes/LevelsFactory')
const { findNewMessagesCount } = require('../../helpers/messages')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'IsDialogOpenedLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Checking if dialog is onened by the reciever...`)

    await sleepProm(3000)

    let res = await args.browser.evaluate(() => {
      if (document.querySelector('msg-message-delimiter-participants[data-tsid="read_mark"][is-mine]')) {
        return true
      }

      return false
    })

    if (res) {
      consoleLog(`found read mark`)
    }

    let res2 = await args.browser.evaluate(
      ({ findNewMessagesCountFn, myUserId, interlocutorId }) => {
        const findNewMessagesCount = new Function(`return (${findNewMessagesCountFn})`)()
        return findNewMessagesCount(myUserId, interlocutorId)
      },
      {
        findNewMessagesCountFn: findNewMessagesCount.toString(),
        myUserId: global.botVars.profileId,
        interlocutorId: args.param1,
      },
    )

    if (res2) {
      consoleLog(`found ${res2} new messages in the dialog`)
    }

    if (res || res2) {
      return true
    }

    return false
  }),
)

module.exports = levels
