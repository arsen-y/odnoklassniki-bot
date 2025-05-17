class BotVars {
  constructor() {
    this.vars = {} // Внутнее свойство для хранения переменных
    this.globalVars = {} // Внутнее свойство для хранения глобальных (разделяемых между ботами) переменных
    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'string') {
          if (prop in target.vars) {
            return target.vars[prop]
          } else {
            return target[prop] // Возвращаем обычные свойства класса
          }
        } else {
          throw new Error(`bot var prop must be a string`)
        }
      },
    })
  }

  async setAsync(propertyName, value) {
    // Асинхронный метод для установки значения
    this.vars[propertyName] = value // Установка значения в внутреннем свойстве
    await global.db.update('UPDATE bots_data SET vars=? WHERE id=?', [this.toJson(), global.botId]) // апдейт свойства в базе
    consoleLog(`Bot property "${propertyName}" set to "${value}".`)
  }

  async setGlobalVarAsync(propertyName, value) {
    // Асинхронный метод для установки значения
    this.globalVars[propertyName] = value // Установка значения в внутреннем свойстве
    await global.db.update('UPDATE global_vars SET vars=? WHERE id=1', [this.toJsonGlobal()]) // апдейт свойства в базе
    consoleLog(`Bot global property "${propertyName}" set to "${value}".`)
  }

  getGlobalVar(propertyName, value) {
    if (propertyName in this.globalVars) {
      return this.globalVars[propertyName]
    } else {
      throw new Error(`bot global var prop ${propertyName} not found`)
    }
  }

  has(propertyName) {
    return propertyName in this.vars // Проверка существования свойства
  }

  hasGlobal(propertyName) {
    return propertyName in this.globalVars // Проверка существования свойства
  }

  // Метод для сериализации this.vars в строку
  toJson() {
    return JSON.stringify(this.vars)
  }

  toJsonGlobal() {
    return JSON.stringify(this.globalVars)
  }

  // Метод для десериализации строки в this.vars
  fromJson(serializedData) {
    try {
      this.vars = JSON.parse(serializedData) // Восстановление из строки
    } catch (error) {
      consoleLog('Error decoding Bot Vars:', error)
    }
  }

  // Метод для десериализации строки в this.vars
  fromJsonGlobal(serializedData) {
    try {
      this.globalVars = JSON.parse(serializedData) // Восстановление из строки
    } catch (error) {
      consoleLog('Error decoding global Bot Vars:', error)
    }
  }
}

module.exports = BotVars
