const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { isMessagesPageValid } = require('../../helpers/messages')
const { sleepProm } = require('../../helpers/sleepProm')

class MessagesParentLevel {
  async handle(args) {
    consoleLog('parent handle')

    let res = await globalLevelsExecute(args)

    if (!res) {
      return false
    }

    const msgPageIsValid = await args.browser.evaluate(
      ({ isMessagesPageValidFn }) => {
        const isMessagesPageValid = new Function(`return (${isMessagesPageValidFn})`)()
        return isMessagesPageValid()
      },
      {
        isMessagesPageValidFn: isMessagesPageValid.toString(),
      },
    )

    if (!msgPageIsValid) {
      consoleLog(`messages page is not valid`)
      await sleepProm(10000)
      return false
    }

    return true
  }
}

module.exports = { MessagesParentLevel }
