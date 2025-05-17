const LoginLevels = require('../levels/LoginLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')

class LoginPageController {
  async defaultAction(args) {
    consoleLog(`OwnProfilePageController default action`)
  }

  async authAction(args) {
    let row = await global.db.getrow('SELECT login, password FROM bots_data WHERE id=?', [global.botId])

    if (row === undefined || !('login' in row)) {
      throw new Error(`bot id ${global.botId} not found in the bots_data table`)
    }

    args.login = row.login
    args.password = row.password

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 10, interval: 3000 }, // Level 1
      { maxRetries: 10, interval: 3000 }, // Level 2
      { maxRetries: 10, interval: 3000 }, // Level 3
    ]

    // Создание уровней с кастомными параметрами
    LoginLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }
}

module.exports = LoginPageController
