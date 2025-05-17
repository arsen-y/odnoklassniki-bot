const { sleepProm } = require('../../helpers/sleepProm')
const { scrollToElem, getSelector, getElemCoordinates } = require('../../helpers/htmlCommon')
const { getProfilesData, getWriteToLink } = require('../../helpers/searchPeople')
const { isValidUserName } = require('../../helpers/isValidUserName')
const { globalLevelsExecute } = require('../../helpers/globalLevelsExecute')
const LevelsFactory = require('../../classes/LevelsFactory')

class SearchPeopleLevels {
  async handle(args) {
    consoleLog('parent handle')
    return await globalLevelsExecute(args)
  }
}

// Массив для хранения классов
const levels = []
const levelsName = 'SearchPeopleLevels'

const parsePeopleOnPage = async (args) => {
  let spliceId = 'empty'

  if (args.people.length > 0) {
    spliceId = args.people[args.people.length - 1].id
    consoleLog(`spliceId=${spliceId}`)
    let lastElemSel = args.people[args.people.length - 1].selector

    await args.browser.evaluate(
      ({ scrollToElemFn, lastElemSel }) => {
        const scrollToElem = new Function(`return (${scrollToElemFn})`)()
        let lastEl = document.querySelector(lastElemSel)
        scrollToElem(lastEl)
      },
      {
        scrollToElemFn: scrollToElem.toString(),
        lastElemSel,
      },
    )

    await sleepProm(7000)
  }

  let people = await args.browser.evaluate(
    ({ getSelectorFn, getProfilesDataFn, spliceId }) => {
      const getSelector = new Function(`return (${getSelectorFn})`)()
      const getProfilesData = new Function(`return (${getProfilesDataFn})`)()

      return getProfilesData(getSelector, spliceId)
    },
    {
      getProfilesDataFn: getProfilesData.toString(),
      getSelectorFn: getSelector.toString(),
      spliceId,
    },
  )

  /*
array of: 
{
  id: '581009339607',
  href: '/profile/581009339607',
  userName: 'Костянец Александр',
  age: 18,
  selector: 'div#tabpanel-users > div.island_cnt__pyx2y > div.row__px8cs.row__m3nyy.skip-first-gap__m3nyy > div > div.card__kq7ru.__h__kq7ru > div.card-section__s39zv > div.empty-line-height__79ad9.card-caption__02cy5 > a.link__91azp.title-link__79ad9.__primary__91azp'
}
*/

  // теперь необходимо навести мышь на каждый элемент, чтобы проверить, можно ли написать юзеру

  for (let i = 0; i < people.length; i++) {
    let sel = people[i].selector

    //await args.browser.waitForSelector(sel)
    //await args.browser.hover(sel)

    //await sleepProm(2000)

    // let userId = await args.browser.evaluate(
    //   ({ getWriteToLinkFn }) => {
    //     const getWriteToLink = new Function(`return (${getWriteToLinkFn})`)()
    //     return getWriteToLink()
    //   },
    //   {
    //     getWriteToLinkFn: getWriteToLink.toString(),
    //   },
    // )

    let userId = people[i].id

    if (userId) {

      userId = userId.toString()
      consoleLog(`userid ${userId} write link found`)
      consoleLog(people[i].id)

      if (userId != people[i].id) {
        throw new Error(`error, userId != people[i].id`)
      }

      // const elementBox = await args.browser.evaluate(
      //   ({ getElemCoordinatesFn, sel }) => {
      //     const getElemCoordinates = new Function(`return (${getElemCoordinatesFn})`)()
      //     return getElemCoordinates(sel)
      //   },
      //   {
      //     getElemCoordinatesFn: getElemCoordinates.toString(),
      //     sel,
      //   },
      // )

      // consoleLog(`elem coordinates:`)
      // consoleLog(elementBox)

      // // Убираем наведение, перемещая мышь в другое место
      // await args.browser.mouseMove(elementBox.x - 10, elementBox.y - 10) // Перемещаем мышь на 10 пикселей влево и на 10 пикселей выше

      people[i].canWrite = true
      people[i].writeHref = `/messages/${people[i].id}`

    } else {
      consoleLog(`userid ${userId} write link not found`)
      people[i].canWrite = false
    }
  }

  args.people = people
}

// Создание уровней через фабрику
levels.push(
  LevelsFactory(1, SearchPeopleLevels, levelsName, async (args) => {
    consoleLog('Level 1 custom logic')
    consoleLog(`searching people data...`)

    args.people = []

    await sleepProm(3000)
    await parsePeopleOnPage(args)

    if (args.people.length == 0) {
      consoleLog(`people not found`)
      return false
    } else {
      consoleLog(`found people: ${args.people.length} people`)
    }

    return true
  }),
)

levels.push(
  LevelsFactory(2, SearchPeopleLevels, levelsName, async (args) => {
    consoleLog('Level 2 custom logic')
    consoleLog(`searching user that is not in dialogs and people_pre_send tables.`)

    await sleepProm(5000)

    // доп. фильтры
    const ids = args.people
      .filter((user) => user.canWrite === true && isValidUserName(user.userName))
      .map((user) => user.id)

    if (ids.length == 0) {
      consoleLog(`all ids not match. continue searching...`)

      await parsePeopleOnPage(args)

      if (args.people.length == 0) {
        consoleLog(`people not found`)
      } else {
        consoleLog(`found people: ${args.people.length} people`)
      }

      return false
    }

    /*
SELECT id
FROM (
    SELECT 1 AS id UNION ALL
    SELECT 2 AS id UNION ALL
    SELECT 3 AS id UNION ALL
    SELECT 4 AS id UNION ALL
    SELECT 5 AS id
) AS ids
WHERE id NOT IN (
    SELECT id FROM people_pre_send
    UNION
    SELECT id FROM dialogs
)
LIMIT 1;
  */

    const sqlQuery = `
SELECT id
FROM (
    ${ids.map((id) => `SELECT ${id} AS id`).join(' UNION ALL\n')}
) AS ids
WHERE id NOT IN (
    SELECT id FROM people_pre_send
    UNION
    SELECT id FROM dialogs
    UNION
    SELECT id FROM people_worked
)
LIMIT 1;
`

    let row = await global.db.getrow(sqlQuery, [])

    if (row !== undefined && 'id' in row) {
      const id = row.id.toString()

      const ind = args.people.findIndex((user) => user.id === id)

      consoleLog(`found user:`)
      consoleLog(args.people[ind])

      await global.db.update('REPLACE INTO people_pre_send SET id=?, botId=?, name=?, age=?', [
        row.id,
        global.botId,
        args.people[ind].userName.replace(/[^а-яА-ЯёЁa-zA-Z0-9\s()]/gu, ''),
        args.people[ind].age,
      ])

      consoleLog(`inserted into people_pre_send table user id ${args.people[ind].id}`)

      args.foundUserId = row.id

      // теперь переходим на страницу этого юзера

      await args.browser.click(args.people[ind].selector)
      args.foundIndex = ind

      return true
    } else {
      consoleLog(`all id are present in the tables. continue searching...`)

      let idsList = ids.join(',')

      if (args.prevIdsList && idsList == args.prevIdsList) {
        throw new Error(`ids list is the same. page does not contain more data.`)
      }
        
      args.prevIdsList = idsList

      await parsePeopleOnPage(args)

      if (args.people.length == 0) {
        consoleLog(`people not found`)
      } else {
        consoleLog(`found people: ${args.people.length} people`)
      }

      return false
    }

    return false
  }),
)

levels.push(
  LevelsFactory(3, SearchPeopleLevels, levelsName, async (args) => {
    consoleLog('Level 3 custom logic')
    consoleLog(`looking at user page, searching write button and checking the page`)

    await sleepProm(3000)

    const writeHref = args.people[args.foundIndex].writeHref

    let found = await args.browser.evaluate(
      ({ writeHref }) => {
        const linkElements = document.querySelectorAll(`a[href="${writeHref}"]`)

        // Ищем элемент с innerText 'Написать'
        const linkElement = Array.from(linkElements).find((el) => el.innerText.trim() === 'Написать')

        if (linkElement) {
          return true
        }

        return false
      },
      {
        writeHref,
      },
    )

    if (!found) {
      consoleLog(`Write button not found on user page`)
      return false
    }

    return true
  }),
)

// Экспортируем массив уровней
module.exports = levels
