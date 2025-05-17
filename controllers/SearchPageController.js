const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')
const { sleepProm } = require('../helpers/sleepProm')
const SearchPeopleLevels = require('../levels/search/SearchPeopleLevels')

class SearchPageController {
  async defaultAction(args) {
    consoleLog(`SearchPageController default action`)
  }

  async peopleAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 10, interval: 1000 }, // Level 1
      { maxRetries: 30, interval: 5000 }, // Level 1
      { maxRetries: 3, interval: 5000 }, // Level 1
    ]

    // Создание уровней с кастомными параметрами
    SearchPeopleLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {} // Берём конфиг уровня или дефолтные значения
      Chain.use(new LevelClass(maxRetries, interval)) // Добавляем уровень в цепочку
    })

    let res = await Chain.run(args)

    const delUser = async () => {
      await global.db.query('DELETE from people_pre_send WHERE id=?', [args.foundUserId])
      await global.db.update('REPLACE INTO people_worked SET id=?', [args.foundUserId])

      args.foundUserId = null
    }

    if (!res && args.foundUserId) {
      await delUser()
      return false
    }

    try {
      res = await global.AppRouter.route('profile/likeProfilePhoto', args)
    } catch(e) {
      consoleLog(e.message)
    }

    if (!res && args.foundUserId) {
      await delUser()
      return false
    }

    if(!args.foundUserId) {
      consoleLog(`args.foundUserId not set`)
      return false
    }

    consoleLog(`sending user a postcard...`)

    await args.browser.goto(`https://ok.ru/messages/${args.foundUserId}`)

    await sleepProm(10000)

    let startDialogRes = false

    try {
      args.param1 = args.foundUserId
      startDialogRes = await global.AppRouter.route('messages/startDialog', args)
    } catch (e) {
      consoleLog(e.message)
    }

    return startDialogRes
  }
}

module.exports = SearchPageController
