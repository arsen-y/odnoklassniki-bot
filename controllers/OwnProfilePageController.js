const CleanWallLevels = require('../levels/ownProfile/CleanWallLevels')
const PostVideoOnTheWallLevelsV2 = require('../levels/ownProfile/PostVideoOnTheWallLevelsV2')
const FillSchoolFormLevels = require('../levels/ownProfile/FillSchoolForm')
const ChainOfMiddlewares = require('../classes/ChainOfMiddlewares')

class OwnProfilePageController {
  async defaultAction(args) {
    consoleLog(`OwnProfilePageController default action`)
  }

  async cleanWallAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 10, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 3000 }, // Level 2
      { maxRetries: 10, interval: 3000 }, // Level 3
    ]

    CleanWallLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async postVideoAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 10, interval: 3000 }, // Level 1
      { maxRetries: 10, interval: 2000 }, // Level 2
      { maxRetries: 10, interval: 2000 }, // Level 3
      { maxRetries: 10, interval: 2000 }, // Level 4
      { maxRetries: 10, interval: 2000 }, // Level 5
      { maxRetries: 10, interval: 2000 }, // Level 6
    ]

    PostVideoOnTheWallLevelsV2.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

  async fillSchoolFormAction(args) {
    const Chain = new ChainOfMiddlewares()

    const levelConfigs = [
      { maxRetries: 5, interval: 3000 }, // Level 1
      { maxRetries: 5, interval: 2000 }, // Level 2
      { maxRetries: 5, interval: 2000 }, // Level 3
      { maxRetries: 5, interval: 2000 }, // Level 4
    ]

    FillSchoolFormLevels.forEach((LevelClass, index) => {
      const { maxRetries, interval } = levelConfigs[index] || {}
      Chain.use(new LevelClass(maxRetries, interval))
    })

    return await Chain.run(args)
  }

}

module.exports = OwnProfilePageController
