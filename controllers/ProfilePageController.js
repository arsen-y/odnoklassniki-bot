const LikeProfilePhotoLevels = require('../levels/profile/LikeProfilePhotoLevels')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')

class ProfilePageController {
  async defaultAction(args) {
    consoleLog(`ProfilePageController default action`)
  }

  async likeProfilePhotoAction(args) {

    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 5, interval: 3000 }, // Level 3
    ]

    // Создание уровней с кастомными параметрами
    LikeProfilePhotoLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {} 
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)

  }
}

module.exports = ProfilePageController
