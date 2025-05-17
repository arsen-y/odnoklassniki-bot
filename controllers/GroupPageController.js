const RepostToGroupLevels = require('../levels/group/RepostToGroupLevels')
const JoinToGroupLevels = require('../levels/group/JoinToGroupLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')

class GroupPageController {
  async defaultAction(args) {
    consoleLog(`GroupPageController default action`)
  }

  async repostToGroupAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 2000 }, // Level 1
      { maxRetries: 5, interval: 2000 }, // Level 2
      { maxRetries: 5, interval: 2000 }, // Level 3
      { maxRetries: 5, interval: 2000 }, // Level 4
      { maxRetries: 5, interval: 2000 }, // Level 5
    ]

    // Создание уровней с кастомными параметрами
    RepostToGroupLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async joinAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 2000 }, // Level 1
      { maxRetries: 5, interval: 2000 }, // Level 2
    ]

    // Создание уровней с кастомными параметрами
    JoinToGroupLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }
}

module.exports = GroupPageController
