function formatErrorMessage(error, addMsg = '') {
  // Проверяем наличие обязательных свойств ошибки и составляем подробное сообщение
  const errorName = error.name || 'UnknownError'
  const errorMessage = error.message || 'No error message provided'
  const errorStack = error.stack || 'No stack trace available'

  // Используем регулярное выражение для получения файла и строки из стека
  const stackLines = errorStack.split('\n')
  const locationMatch = stackLines[1]?.match(/\(([^)]+)\)/)
  const errorLocation = locationMatch ? locationMatch[1] : 'Location not available'

  addMsg += addMsg.length > 0 ? '. ' : ''

  // Составляем подробное сообщение об ошибке
  return `${addMsg} Error Details:
- Name: ${errorName}
- Message: ${errorMessage}
- Location: ${errorLocation}
- Stack Trace:
${errorStack}`
}

module.exports = { formatErrorMessage }
