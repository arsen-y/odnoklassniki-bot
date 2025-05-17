function truncateText(text, maxLength = 1024) {
  // Проверяем, нужно ли обрезать текст
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

module.exports = { truncateText }