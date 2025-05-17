const LevelsFactory = require('../../classes/LevelsFactory')
const { getSelector } = require('../../helpers/htmlCommon')
const { sleepProm } = require('../../helpers/sleepProm')
const { MessagesParentLevel } = require('./MessagesParentLevel')

// Массив для хранения классов
const levels = []
const levelsName = 'SendPostcardLevels'

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`Searching postcards block`)

    await sleepProm(3000)

    let stickersAr = await args.browser.evaluate(
      ({ getSelectorFn }) => {
        const getSelector = new Function(`return (${getSelectorFn})`)()

        const stickers = document.querySelectorAll('.list-okmsg msg-assets-sticker')
        const stickersAr = []

        if (!stickers) {
          return false
        }

        let ind = 0

        for (let sticker of stickers) {
          if (ind <= 2) {
            stickersAr.push(getSelector(sticker))
            ind += 1
          }
        }

        return stickersAr
      },
      {
        getSelectorFn: getSelector.toString(),
      },
    )

    if (!stickersAr) {
      consoleLog(`postcards do not found`)
      return false
    }

    args.stickersAr = stickersAr

    return true
  }),
)

levels.push(
  LevelsFactory(2, MessagesParentLevel, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`Sending postcard`)

    await sleepProm(3000)

    const res = await args.browser.evaluate(async () => {

       // Максимальное количество попыток, чтобы избежать бесконечного цикла
      const maxAttempts = 10;
      let attempts = 0;

      while (attempts < maxAttempts) {
        // Получаем все стикеры с правильным селектором
        const allStickers = Array.from(document.querySelectorAll('.list-okmsg msg-assets-sticker')).filter(
        (sticker) => !sticker.querySelector('div.price-okmsg'),
      )
        
        // Выбираем первые 4 стикера
        const firstFourStickers = allStickers.slice(0, 4)
        
        // Фильтруем стикеры, исключая те, которые содержат div.price-okmsg
        const filteredStickers = firstFourStickers.filter(sticker => !sticker.querySelector('div.price-okmsg'))
        
        if (filteredStickers.length > 0) {
          // Кликаем по первому подходящему стикеру (мы нашли бесплатный стикер)
          filteredStickers[0].click()
          return true
        } else {
          // Если подходящих стикеров нет, пытаемся найти и кликнуть кнопку "стрелка вправо"
          const arrowButton = document.querySelector('msg-icon[icon="arrow-right"]')
          
          if (arrowButton && !arrowButton.classList.contains('disabled')) {
            arrowButton.click();
            // Ждем, пока контент обновится после клика
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            return false
          }
        }

        attempts++;
      }

      return false;
      
    })

    return res

    // await args.browser.waitForSelector('msg-assets-sticker')
    // await args.browser.click('msg-assets-sticker')

    // for (let stickerSel of args.stickersAr) {

    //   try {
    //     await args.browser.waitForSelector(stickerSel)
    //     await args.browser.click(stickerSel)
    //     return true
    //   } catch(e) {
    //     consoleLog(`selector ${stickerSel} not found`)
    //     consoleLog(e.message)
    //   }

    // }
  }),
)

// checking errors
levels.push(require('./SendMessageLevels')[2])

module.exports = levels
