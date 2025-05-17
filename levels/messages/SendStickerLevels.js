const LevelsFactory = require('../../classes/LevelsFactory')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'SendStickerLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching stickers block and opening stickers window`)

    await sleepProm(3000)

    let found = await args.browser.evaluate(
      () => {
        const element = document.querySelector('img.tico_ico-okmsg')

        if(element) {
          element.click()
          return true
        }

        return false
        
      }, 
    )

    if (!found) {
      consoleLog(`img, opening stickers window not found`)
      return false
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Sending sticker`)

    await sleepProm(5000)

    const res = await args.browser.evaluate(() => {
      const sticker = document.querySelector('msg-sticker[data-l="t,sticker"][data-tsid="sticker"]')

      if (sticker) {
        sticker.click()
        return true
      }

      return false
    })

    return res

  }),
)

// checking errors
levels.push(require('./SendMessageLevels')[2])

module.exports = levels
