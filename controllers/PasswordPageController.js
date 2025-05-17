const ChangePasswordLevels = require('../levels/ChangePasswordLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')

class PasswordPageController {
  async defaultAction(args) {
    consoleLog(`OwnProfilePageController default action`)
  }

  async changeAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 10, interval: 1000 }, // Level 1
      { maxRetries: 10, interval: 1000 }, // Level 2
      { maxRetries: 10, interval: 1000 }, // Level 3
      { maxRetries: 10, interval: 1000 }, // Level 4
      { maxRetries: 10, interval: 1000 }, // Level 5
    ]

    // Создание уровней с кастомными параметрами
    ChangePasswordLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }
}

module.exports = PasswordPageController
