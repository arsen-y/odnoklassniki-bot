// Фабрика классов
function LevelsFactory(levelNumber, BaseClass, baseClassName, callback) {
  class Level extends BaseClass {
    constructor(maxRetries = 5, interval = 5000) {
      super()
      // Сохраняем maxRetries и interval как свойства экземпляра
      this.maxRetries = maxRetries
      this.interval = interval
    }

    // Основной метод handle, который будет вызываться с логикой повторения
    async handle(args) {
      let attempts = 0

      while (attempts < this.maxRetries) {
        attempts++
        consoleLog(`${baseClassName} Level ${levelNumber}, attempt ${attempts}...`)

        // Выполняем родительский handle
        const result = await super.handle(args)
        if (!result) {
          consoleLog(`Super handle failed on attempt ${attempts}`)
          return false
        }

        // Выполняем кастомную логику уровня
        const customResult = await callback(args)

        if (customResult) {
          consoleLog(`${baseClassName} Level ${levelNumber} succeeded on attempt ${attempts}`)
          return true
        }

        consoleLog(`${baseClassName} Level ${levelNumber} failed on attempt ${attempts}, retrying...`)

        if (attempts < this.maxRetries) {
          // Ждём указанный интервал перед следующей попыткой
          await new Promise((resolve) => setTimeout(resolve, this.interval))
        }
      }

      consoleLog(`${baseClassName} Level ${levelNumber} failed after ${this.maxRetries} attempts.`)
      return false
    }
  }

  // Присваиваем уникальное имя классу (например, Level1, Level2)
  Object.defineProperty(Level, 'name', { value: `${baseClassName}Level${levelNumber}` })

  // Возвращаем созданный класс
  return Level
}

module.exports = LevelsFactory