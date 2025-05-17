const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')

class JoinToGroupLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'JoinToGroupLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, JoinToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Finding join button...`)

    await sleepProm(3000)

    // прокрутим страницу немного вниз

    const res = await args.browser.evaluate(() => {
     const element = document.querySelector('div[data-l="outlandertarget,join,t,join"]')

     if(element) {
      return element.innerText.trim()
     }

     return false
      
    })

    if(!res) {
      consoleLog(`join button not found`)
      return false
    }

    if (res == 'В группе') {
      throw new Error(`we are already in group`)
    }

    if (res != 'Вступить') {
      consoleLog(`invalid join button text`)
      return false
    }
    
    return true
  }),
)

levels.push(
  LevelsFactory(2, JoinToGroupLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Clicking on the button...`)

    await sleepProm(3000)

    await args.browser.click('div[data-l="outlandertarget,join,t,join"]')

    await sleepProm(5000)

    return true
  }),
)


module.exports = levels
