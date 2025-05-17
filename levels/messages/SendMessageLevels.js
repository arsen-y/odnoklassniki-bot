const LevelsFactory = require('../../classes/LevelsFactory')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'SendMessageLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching input text element`)

    await sleepProm(3000)

    let res = await args.browser.evaluate(() => {
      const element = document.querySelector('div[data-tsid="write_msg_input-input"]')

      if (!element) {
        return false
      }

      return true
    })

    if (!res) {
      consoleLog(`send text field not found`)
      return false
    } else {
      consoleLog(`Input field found`)
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Inserting text and pressing send button`)

    await sleepProm(3000)

    // Фокусируемся на элементе для ввода
    await args.browser
      .click('div[data-tsid="write_msg_input-input"]')

    args.param1 = args.param1.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

    // Разбиваем сообщение по символу `\n`
    const messageBlocks = args.param1.split('\n')

    for (const block of messageBlocks) {
      consoleLog(`Typing block: ${block}`)
      await args.browser.type('div[data-tsid="write_msg_input-input"]', block)

      // Ждем 10 секунд между вводом блоков
      await sleepProm(10000)

      // Имитация нажатия Enter
      await args.browser.pressEnter()
    }

    await sleepProm(3000)

    return true
  }),
)

levels.push(
  LevelsFactory(3, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Checking sending msg errors...`)

    await sleepProm(10000)

    const errorFound = await args.browser.evaluate(() => {
      const element = document.querySelector('div[data-tsid="error_in_message"]')

      if (!element) {
        return false
      }

      return true
    })

    if (errorFound) {
      throw new Error(`Sending error found`)
    }

    return true
  }),
)

module.exports = levels
