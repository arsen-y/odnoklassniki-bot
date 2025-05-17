const LevelsFactory = require('../../classes/LevelsFactory')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const { getRandomSchool, calculateSchoolYears } = require('../../helpers/profile')
const { sleepProm } = require('../../helpers/sleepProm')

class FillSchoolForm {
  async handle(args) {
    consoleLog('FillSchoolForm parent handle')
    return await globalLevelsExecute(args)
  }
}

const levels = []
const levelsName = 'FillSchoolForm'

levels.push(require('./CleanWallLevels')[0])

levels.push(
  LevelsFactory(2, FillSchoolForm, levelsName, async (args) => {
    consoleLog('filling form...')

    const inputs = await args.browser.getElems('div[class^="main-settings__"] input')

    if(inputs.length != 2) {
      consoleLog('input fields.length!=2, not valid sel response')
      return false
    }

    // выбираем город
    await args.browser.clickOnElem(inputs[0])
    await sleepProm(3000)
    await args.browser.typeInElem(inputs[0], 'Санкт-Петербург')
    await sleepProm(3000)

    let box = await args.browser.boundingBoxElem(inputs[0])
    consoleLog('box',box)
    
    await args.browser.mouseMove(box.x+5.0, box.y+55.0)
    await args.browser.clickOnCoords(box.x+5.0, box.y+55.0)

    // выбираем школу
    await args.browser.clickOnElem(inputs[1])
    await sleepProm(3000)

    const randomSchoolName = await args.browser.evaluate(
      ({ getRandomSchoolFn }) => {
        const getRandomSchool = new Function(`return (${getRandomSchoolFn})`)()
        const inputs = document.querySelectorAll('div[class^="main-settings__"] input')
        return getRandomSchool(inputs[1].nextElementSibling.nextElementSibling)
      },
      {
        getRandomSchoolFn: getRandomSchool.toString(),
      },
    )

    if(!randomSchoolName) {
      consoleLog('can not get randomSchoolName')
      return false
    }

    await args.browser.typeInElem(inputs[1], randomSchoolName.length > 5 ? randomSchoolName.slice(0, 5) : randomSchoolName)
    await sleepProm(3000)

    box = await args.browser.boundingBoxElem(inputs[1])
    await args.browser.mouseMove(box.x+5.0, box.y+55.0)
    await args.browser.clickOnCoords(box.x+5.0, box.y+55.0)

    const selects = await args.browser.getElems('div[class^="main-settings__"] select')

    if(selects.length != 4) {
      consoleLog('selects fields.length!=4, not valid sel response')
      return false
    }

    const { startYear, endYear, graduateYear } = calculateSchoolYears(global.botVars.age)

    console.log('startYear', startYear)
    console.log('endYear', endYear)
    console.log('graduateYear', graduateYear)

    // заполняем остальные поля 
    await args.browser.elemSelectByValue(selects[1], startYear)

    await sleepProm(3000)
    if(endYear) {
      await args.browser.elemSelectByValue(selects[2], endYear)
      await sleepProm(3000)
    }

    await args.browser.elemSelectByValue(selects[3], graduateYear)
    await sleepProm(3000)

    await args.browser.click('div[class^="main-settings__"] button')
    await sleepProm(10000)

    return true
  }),
)

module.exports = levels
