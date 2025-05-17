const AcceptAllFriendsLevels = require('../levels/notifications/AcceptAllFriendsLevels')
const AcceptAllPresentsLevels = require('../levels/notifications/AcceptAllPresentsLevels')
const AddAllRecommendedFriendsLevels = require('../levels/notifications/AddAllRecommendedFriendsLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')
const { sleepProm } = require('../helpers/sleepProm')

class NotificationsPageController {
  async defaultAction(args) {
    consoleLog(`NotificationsPageController default action`)
  }

  async acceptAllNotificationsAction(args) {
    let res1 = false

    try {
      res1 = await global.AppRouter.route('notifications/acceptAllFriends', args)
    } catch (e) {
      consoleLog(e.message)
    }

    let res2 = false

    try {
      res2 = await global.AppRouter.route('notifications/acceptAllPresents', args)
    } catch (e) {
      consoleLog(e.message)
    }

    let res3 = false

    try {
      res3 = await global.AppRouter.route('notifications/addAllRecommendedFriends', args)
    } catch (e) {
      consoleLog(e.message)
    }

    await sleepProm(10000)
    
    if (res1 && res2 && res3) {
      return true
    }

    return false
  }

  async addAllRecommendedFriendsAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 1000 }, // Level 1
      { maxRetries: 99, interval: 1000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    AddAllRecommendedFriendsLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async acceptAllFriendsAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 1000 }, // Level 1
      { maxRetries: 99, interval: 1000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    AcceptAllFriendsLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async acceptAllPresentsAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 1000 }, // Level 1
      { maxRetries: 99, interval: 1000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    AcceptAllPresentsLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }
}

module.exports = NotificationsPageController
