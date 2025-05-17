const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')

class CleanWallLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'CleanWallLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, CleanWallLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Checking that we are on the own profile page...`)

    await sleepProm(3000)

    let userFirstAndLastName = await args.browser.evaluate(() => {
      const element = document.querySelector('.profile-user-info_name')

      if (element) {
        return element.innerText.replace(/[^a-zA-Zа-яА-ЯёЁ0-9 ]/g, '').trim()
      }

      return false
    })

    if (!userFirstAndLastName) {
      consoleLog(`going to the user own profile page...`)

      await args.browser.evaluate(() => {
        const link = document.querySelector('a[data-l="t,userPage"]')

        if (link) {
          link.click()
        }
      })

      return false
    } else {
      const match = args.browser.getCurrentUrl().match(/\/profile\/(\d+)/)
      const profileId = match ? parseInt(match[1], 10) : null

      if (profileId) {
        await global.botVars.setAsync('profileId', profileId)
      }

      await global.botVars.setAsync('name', userFirstAndLastName)

      let userAge = await args.browser.evaluate(() => {
        const span = document.querySelector('.user-profile_i_info[data-type="AGE"]')

        // Извлекаем текст из элемента
        const text = span ? span.textContent : ''

        // Регулярное выражение для поиска возраста (цифрового значения)
        const ageMatch = text.match(/\d+\s*(лет|год|года)/)

        // Если возраст найден, выводим его
        return ageMatch ? parseInt(ageMatch[0]) : null
      })

      if (userAge) {
        await global.botVars.setAsync('age', userAge)
      } else {
        throw new Error(`userAge not found`)
      }
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, CleanWallLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Finding records on the own wall...`)

    await sleepProm(5000)

    await args.browser.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    })

    await sleepProm(2000)

    const countRecords = await args.browser.evaluate(() => {
      const divsWithFeedId = document.querySelectorAll('div[data-feed-id]')

      if (!divsWithFeedId) {
        return 0
      }

      return divsWithFeedId.length
    })

    if (!countRecords) {
      consoleLog(`no records on the wall found`)
      return true
    }

    consoleLog(`Found ${countRecords} records on the wall`)

    return true
  }),
)

levels.push(
  LevelsFactory(3, CleanWallLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`Deleting items...`)

    await sleepProm(2000)

    await args.browser.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    })

    await sleepProm(3000)

    const countRecords = await args.browser.evaluate(() => {
      const divsWithFeedId = document.querySelectorAll('div[data-feed-id]')

      if (!divsWithFeedId) {
        return 0
      }

      return divsWithFeedId.length
    })

    if (countRecords == 0) {
      consoleLog(`done`)
      return true
    }

    consoleLog(`countRecords=${countRecords}`)

    const menuSel = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        const divsWithFeedId = document.querySelectorAll('div[data-feed-id]')

        for (let elem of divsWithFeedId) {
          if (
            elem.innerText.includes('some text') ||
            elem.innerText.includes('some text 2')
          ) {
            continue
          }

          let foundElement = elem.querySelector('div[aria-label="Меню"]')

          if (foundElement) {
            return getSelector(foundElement)
          }
        }

        return false
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!menuSel) {
      consoleLog(`menuSel not found. so, that's the end.`)
      return true
    }

    await args.browser.hover(menuSel)

    await sleepProm(3000)

    const delSel = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        const divs = document.querySelectorAll('div.tico[role="button"]')
        const divWithText = Array.from(divs).find((div) => div.innerText === 'Скрыть из ленты')

        if (!divWithText) {
          return false
        }

        return getSelector(divWithText)
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!delSel) {
      throw new Error(`div element with text 'Скрыть из ленты' not found"`)
    }

    await args.browser.click(delSel)
    await sleepProm(3000)
    await args.browser.hover('div.user-feed_filter')
    await args.browser.reloadPage()

    return false
  }),
)

module.exports = levels
