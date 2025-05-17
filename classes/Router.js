const { formatErrorMessage } = require("../helpers/formatErrorMessage")

class Router {
  // Конструктор принимает объект маршрутов
  constructor(routes) {
    this.routes = routes
  }

  // Метод route, который асинхронно обрабатывает запрос
  async route(request, ...args) {
    request = request.trim().replace(/\s+/g, '/')

    consoleLog(`start action ${request}`)

    const [path, methodName] = request.split('/').filter(Boolean)
    const controllerName = this.routes[path]

    consoleLog(`Router request ${request}`)

    if (!controllerName) {
      consoleLog(`Route not found for path: ${path}`)
    }

    // Форматируем имя метода, чтобы оно соответствовало ожиданиям (action)
    const formattedMethodName = methodName
      ? methodName.charAt(0).toLowerCase() + methodName.slice(1) + 'Action'
      : 'defaultAction'

    try {
      // Динамически подключаем контроллер через require
      const ControllerClass = require(`../controllers/${controllerName}`)

      const controllerInstance = new ControllerClass()

      const method = controllerInstance[formattedMethodName]

      if (typeof method === 'function') {
        return await method.apply(controllerInstance, args)
      } else {
        throw new Error(
          `Method not found (it should have ending "Action"): ${formattedMethodName} in ${controllerName}`,
        )
      }
    } catch (error) {

      if (error.message.includes('Method not found')) {
        throw new Error(error.message)
      }

      throw new Error(formatErrorMessage(error, `request ${request}`))
      
    } finally {
      consoleLog(`end action ${request}`)
    }
  }
}

module.exports = Router
