const LevelsFactory = require('../../classes/LevelsFactory')
const { findNewMessagesCount } = require('../../helpers/messages')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'HaveMessagesLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Checking if we have new messages with ${args.param1}...`)

    await sleepProm(1000)

    let res = await args.browser.evaluate(
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

    if (res) {
      consoleLog(`found ${res} new messages in the dialog`)
      return true
    }

    consoleLog(`no new messages found`)

    return false
  }),
)

module.exports = levels
