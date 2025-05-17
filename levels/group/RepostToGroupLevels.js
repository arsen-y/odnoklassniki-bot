const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')

class RepostToGroupLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'RepostToGroupLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, RepostToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Scrolling page to bottom...`)

    await sleepProm(3000)

    // прокрутим страницу немного вниз

    await args.browser.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    })

    await sleepProm(5000)

    await args.browser.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    })

    await sleepProm(3000)

    return true
  }),
)

levels.push(
  LevelsFactory(2, RepostToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding random post share button...`)

    await sleepProm(3000)

    let selector = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        // 1. Получаем все элементы с селектором 'div[data-l="t,feed-actions-menu"]'
        const elements = document.querySelectorAll('li[data-widget-item-type="reshare"].widget-list_i')

        // 2. Проверяем, что элементы найдены
        if (elements.length > 0) {
          // 3. Генерируем случайный индекс
          const randomIndex = Math.floor(Math.random() * elements.length)

          // 4. Выбираем случайный элемент
          const randomElement = elements[randomIndex]

          return getSelector(randomElement)
        }

        return false
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!selector) {
      consoleLog(`post share button in group do not found`)
      return false
    }

    args.selector = selector

    return true
  }),
)

levels.push(
  LevelsFactory(3, RepostToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Opening share menu...`)

    await sleepProm(3000)

    await args.browser.click(args.selector)

    await sleepProm(3000)

    await args.browser.click('a[data-l="t,group"][href^="/group/"]')

    return true
  }),
)

levels.push(
  LevelsFactory(4, RepostToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 4 custom logic')
    consoleLog(`Clicking on the target group title...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {

      const elements = document.querySelectorAll('div.ucard-mini_cnt_i.ellip')

      const targetText = 'ДОБАВЬ В ДРУЗЬЯ (ПИАР)'
      const matchingElement = Array.from(elements).find((element) => element.textContent.trim() === targetText)

      if (matchingElement) {
        matchingElement.click()
        return true
      }

      return false
    })
    
    if(!res) {
      consoleLog('target group title do not found')
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(5, RepostToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 5 custom logic')
    consoleLog(`Clicking on share button...`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(() => {

      const element = document.querySelector('button[data-l="t,button.submit"][title="Поделиться"]')

      if (element) {
        element.click()
        return true
      }

      return false
    })

    if (!res) {
      consoleLog('share button do not found')
      return false
    }

    await sleepProm(5000)

    return true
  }),
)

module.exports = levels
