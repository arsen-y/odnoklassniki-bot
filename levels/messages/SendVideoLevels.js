const LevelsFactory = require('../../classes/LevelsFactory')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'SendVideoLevels'

levels.push(require('./SendMessageLevels')[0])
levels.push(require('./SendMessageLevels')[1])
levels.push(require('./SendMessageLevels')[2])

levels.push(
  LevelsFactory(4, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 4 custom logic')
    consoleLog(`Getting last msg-video-poster element selector`)

    await sleepProm(3000)

    let selector = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        // Получаем все элементы с селектором 'msg-video-poster'
        const elements = document.querySelectorAll('msg-video-poster')

        // Проверяем, есть ли такие элементы на странице
        if (elements.length > 0) {
          // Выбираем последний элемент из NodeList
          const lastElement = elements[elements.length - 1]

          // Делаем с ним что необходимо, например, выводим в консоль
          return getSelector(lastElement)
        }

        return false
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!selector) {
      consoleLog(`last msg-video-poster selector not found`)
      return false
    }

    args.selector = selector

    return true
  }),
)

levels.push(
  LevelsFactory(5, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 5 custom logic')
    consoleLog(`Finding and pressing on msg edit button`)

    await sleepProm(3000)

    return true

    await args.browser.hover(args.selector)

    await sleepProm(3000)

    await args.browser.click('button[aria-label="Действия с сообщением"]')

    await sleepProm(3000)

    await args.browser.click('msg-menu-item[data-l="t,messageActionedit"]')

    await sleepProm(3000)

    return true
  }),
)

levels.push(
  LevelsFactory(6, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 6 custom logic')
    consoleLog(`Deleting link in the edit field and pressing send btn`)

    await sleepProm(3000)

    return true

    // Фокусируемся на элементе для ввода
    await args.browser.click('div[data-tsid="write_msg_input-input"]')

    await sleepProm(3000)

    // удаляем текст

    await args.browser.selectAllAndDelete()

    await args.browser.pressEnter()

    await sleepProm(3000)

    return true
  }),
)

module.exports = levels
