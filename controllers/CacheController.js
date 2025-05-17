const redis = require('redis')

class CacheController {
  constructor(socketPath = '/var/run/redis/redis.sock') {
    // Создаем клиент для Redis с подключением через Unix сокет
    this.client = redis.createClient({
      socket: {
        path: socketPath,
      },
    })

    this.client.on('error', (err) => {
      console.error('Redis error:', err)
    })

    // Обрабатываем подключение с ошибками
    this.client.connect().catch((err) => {
      console.error('Error connecting to Redis:', err)
    })
  }

  // Получить кэш по ключу
  async get(key) {
    try {
      // Просто возвращаем строковые или бинарные данные
      return await this.client.get(key)
    } catch (err) {
      console.error('Error getting cache:', err)
      return null
    }
  }

  // Сохранить данные в кэш
  async set(key, value, ttl = 3600) {
    try {
      // Записываем строковые или бинарные данные без сериализации
      await this.client.setEx(key, ttl, value)
    } catch (err) {
      console.error('Error setting cache:', err)
    }
  }

  // Удалить кэш по ключу
  async delete(key) {
    try {
      await this.client.del(key)
      console.log(`Cache for key ${key} deleted successfully.`)
    } catch (err) {
      console.error('Error deleting cache:', err)
    }
  }

  // Закрыть соединение с Redis
  async close() {
    await this.client.quit()
    console.log('Redis connection closed')
  }
}

module.exports = CacheController
